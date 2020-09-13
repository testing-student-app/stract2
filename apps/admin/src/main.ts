import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './plugins/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import WebSocketPlugin from './plugins/websocket';
import ConfirmPlugin from './plugins/confirm';

Vue.use(WebSocketPlugin, { store });
Vue.use(ConfirmPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
