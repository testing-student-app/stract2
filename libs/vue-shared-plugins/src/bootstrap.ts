import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

export default function createBootstrapVue(Vue) {
  Vue.use(BootstrapVue);
  Vue.use(BootstrapVueIcons);
}
