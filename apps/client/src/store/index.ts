import Vue from 'vue';
import Vuex from 'vuex';
import serverInterlayer from './modules/serverInterlayer';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    serverInterlayer,
  },
});
