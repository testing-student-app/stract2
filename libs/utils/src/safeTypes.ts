/* eslint-disable @typescript-eslint/ban-ts-ignore */
/**
 * SSR safe types
 */

import { hasWindowSupport } from './env';

const w = hasWindowSupport ? window : {};

export const Element = hasWindowSupport
  ? // @ts-ignore
    w.Element
  : class Element extends Object {};

export const HTMLElement = hasWindowSupport
  ? // @ts-ignore
    w.HTMLElement
  : class HTMLElement extends Element {};

export const SVGElement = hasWindowSupport
  ? // @ts-ignore
    w.SVGElement
  : class SVGElement extends Element {};

// @ts-ignore
export const File = hasWindowSupport ? w.File : class File extends Object {};
