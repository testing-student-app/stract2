import Vue from 'vue';
import { createCustomLogux } from '@stract2/utils';

const store = createCustomLogux(
  Vue,
  { userId: 'anonymous', token: '' },
  {
    state: {},
    mutations: {},
    actions: {},
    modules: {},
  }
);

store.client.start();

export default store;
