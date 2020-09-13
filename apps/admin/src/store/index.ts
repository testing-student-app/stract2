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
  server:
    process.env.NODE_ENV === 'development'
      ? 'ws://localhost:31337'
      : 'wss://logux.example.com',
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

store.client.start();

badge(store.client, { messages: badgeEn, styles: badgeStyles });
log(store.client);

export default store;
