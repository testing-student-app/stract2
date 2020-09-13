import Vue from 'vue';
import fileSystem from './modules/fileSystem';
import tests from './modules/tests';
import serverInterlayer from './modules/serverInterlayer';
import { LoguxVuex, createLogux } from '@logux/vuex';
import { badge, badgeEn, log } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';

Vue.use(LoguxVuex);

const Logux = createLogux({
  subprotocol: '1.0.0',
  server: 'ws://localhost:31337',
  userId: 'anonymous',
  token: '',
});

const store = new Logux.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    fileSystem,
    tests,
    serverInterlayer,
  },
});

badge(store.client, { messages: badgeEn, styles: badgeStyles });
log(store.client);

store.client.start();

export default store;
