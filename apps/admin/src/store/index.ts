import Vue from 'vue';
import { createCustomLogux } from '@stract2/utils';
import users from './modules/users';

const store = createCustomLogux(
  Vue,
  { userId: 'admin', token: '' },
  {
    state: {},
    mutations: {},
    actions: {},
    modules: {
      users,
    },
  }
);

store.client.start();

export default store;
