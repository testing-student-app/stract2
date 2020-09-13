import {
  BuilderContext,
  createBuilder,
  BuilderOutput,
} from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

import { serialHooks } from 'electron-packager/src/hooks';
import { Options as ElectronPackagerOptions } from 'electron-packager';
import electronPackager from 'electron-packager';

import { join } from 'path';
import { sync as removeSync } from 'rimraf';
import { writeFile, readFile, readFileSync, statSync, readdirSync } from 'fs';
import { promisify } from 'util';

import { getSourceRoot } from '../../utils/workspace';
import { normalizePackagingOptions } from '../../utils/normalize';

import { Observable, from, of } from 'rxjs';
import { map, concatMap, catchError } from 'rxjs/operators';

import stripJsonComments from 'strip-json-comments';

try {
  require('dotenv').config();
} catch (e) {
  throw new Error('Failed to load dotenv');
}

const writeFileAsync = (path: string, data: string) =>
  promisify(writeFile)(path, data);
const readFileAsync = (path: string) => promisify(readFile)(path);

export interface PackageElectronBuilderOptions extends ElectronPackagerOptions {
  name: string;
  frontendProject: string;
  out?: string;
}

export interface PackageElectronBuilderOutput extends BuilderOutput {
  target?: any;
  outputPath: string | string[];
}

function normalizeIgnoreOptions(
  options: PackageElectronBuilderOptions
): PackageElectronBuilderOptions {
  // normalize ignore options (if exist) to be of type RegExp | RegExp[]
  const normalizedIgnoreOptions: Array<RegExp> = [];

  if (options.ignore) {
    if (typeof options.ignore === 'string') {
      options.ignore = new RegExp(options.ignore);
    } else if (
      typeof options.ignore === 'object' &&
      options.ignore instanceof RegExp
    ) {
      normalizedIgnoreOptions.push(options.ignore);
    } else if (Array.isArray(options.ignore)) {
      options.ignore.forEach((option) => {
        if (typeof option === 'string') {
          option = new RegExp(option);
        }

        if (option instanceof RegExp) {
          normalizedIgnoreOptions.push(option);
        }
      });

      options.ignore = normalizedIgnoreOptions;
    }
  }

  return options;
}

function mergePresetOptions(
  options: PackageElectronBuilderOptions
): PackageElectronBuilderOptions {
  // lead preset options file
  const externalOptionsPath: string = join(
    options.dir,
    options['sourceRoot'],
    'app',
    'options',
    'packager.options.json'
  );

  if (statSync(externalOptionsPath).isFile()) {
    const rawData = readFileSync(externalOptionsPath, 'utf8');
    const externalOptions = JSON.parse(stripJsonComments(rawData));
    options = Object.assign(
      normalizeIgnoreOptions(options),
      normalizeIgnoreOptions(externalOptions)
    );
  }

  return options;
}

function getUnrelatedWorkspaceAppsIgnoreList(
  options: PackageElectronBuilderOptions
): Array<RegExp> {
  // get regex array of unrelated workspace apps (if exists) to be ignored
  let unrelatedAppsPaths: Array<RegExp> = [];
  const appsDir = 'apps';
  const appsPath: string = join(options.dir, appsDir); // assumes that apps is a super set of compiled apps (dist)

  try {
    unrelatedAppsPaths = readdirSync(appsPath)
      .filter((entry) => (entry as any).isDirectory())
      .filter(
        (entry) =>
          (entry as any).name !== options.name &&
          (entry as any).name !== options.frontendProject
      )
      .map((entry) => new RegExp(appsDir + '/' + (entry as any).name + '$')); // don't use join here
  } catch (error) {
    console.error(
      `${options.name} does not have a valid workspaceRoot. could not generate default ignore list.`
    );
  }

  return unrelatedAppsPaths;
}

function addDefaultIgnoreOptions(
  options: PackageElectronBuilderOptions
): PackageElectronBuilderOptions {
  // add ignore options that ignore all the additional projects in the dist folder
  // const ignoreExtraProjects: RegExp = new RegExp(`\/dist\/(?!${options.name}$|${options.frontendProject}$).*$`);
  const ignoreExtraProjects: Array<RegExp> = getUnrelatedWorkspaceAppsIgnoreList(
    options
  );

  if (options.ignore) {
    if (options.ignore instanceof RegExp) {
      ignoreExtraProjects.push(options.ignore);
      options.ignore = ignoreExtraProjects;
    } else if (Array.isArray(options.ignore)) {
      options.ignore.concat(ignoreExtraProjects);
    }
  } else if (ignoreExtraProjects.length > 0) {
    options.ignore = ignoreExtraProjects;
  }

  return options;
}

function addMissingDefaultOptions(
  options: PackageElectronBuilderOptions
): PackageElectronBuilderOptions {
  //todo: add appVersion

  // remove unset options (use electron packager default where possible)
  Object.keys(options).forEach(
    (key) => options[key] === '' && delete options[key]
  );

  return options;
}

function removeSourceFiles(
  options: PackageElectronBuilderOptions,
  buildPath: string
): Promise<any> {
  // remove source map files
  if (options['ignoreSourceMap']) {
    if (statSync(join(buildPath, 'dist')).isDirectory()) {
      try {
        removeSync(join(buildPath, 'dist', '**', '*.js.map'));
      } catch (error) {
        error('Failed to remove source map files:', error);
      }
    }
  }

  return new Promise((resolve, reject) => {
    // remove source files (./apps directory)
    if (statSync(join(buildPath, 'apps')).isDirectory()) {
      try {
        removeSync(join(buildPath, 'apps'));
      } catch (error) {
        reject(error);
      }
    }

    resolve('');
  });
}

function run(
  options: JsonObject & PackageElectronBuilderOptions,
  context: BuilderContext
): Observable<PackageElectronBuilderOutput> {
  return from(getSourceRoot(context)).pipe(
    map((sourceRoot) =>
      normalizePackagingOptions(options, context.workspaceRoot, sourceRoot)
    ),
    map((options) => mergePresetOptions(options)),
    map((options) => addDefaultIgnoreOptions(options)),
    map((options) => addMissingDefaultOptions(options)),
    concatMap(async (options) => {
      options.afterCopy = [
        serialHooks([
          (buildPath, electronVersion, platform, arch) => {
            return writeFileAsync(
              join(buildPath, 'index.ts'),
              `const Main = require('./dist/apps/${options.name}/main');`
            );
          },
          (buildPath, electronVersion, platform, arch) => {
            return removeSourceFiles(options, buildPath);
          },
        ]),
      ];

      async function packagerWrapper() {
        let result: PackageElectronBuilderOutput;
        let outputPath: string | string[];
        let success = true;

        try {
          outputPath = await electronPackager(options);
        } catch (error) {
          success = false;
          console.error('Packaging failed:', error);
        }

        // eslint-disable-next-line prefer-const
        result = { success, outputPath };

        return result;
      }

      return await packagerWrapper();
    }),
    catchError((error) => {
      console.error(error);

      return of({ success: false, outputPath: null });
    })
  );
}

export default createBuilder<JsonObject & PackageElectronBuilderOptions>(run);
