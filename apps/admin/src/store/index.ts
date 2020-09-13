import Vue from 'vue';
import Vuex from 'vuex';
import fileSystem from './modules/fileSystem';
import tests from './modules/tests';
import serverInterlayer from './modules/serverInterlayer';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    fileSystem,
    tests,
    serverInterlayer,
  },
});
