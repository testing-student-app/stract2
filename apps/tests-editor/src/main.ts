import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { ConfirmPlugin, createBootstrapVue } from '@stract2/vue-shared-plugins';

createBootstrapVue(Vue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(ConfirmPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
