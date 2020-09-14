import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import { VueConstructor } from 'vue';

export default function createBootstrapVue(Vue: VueConstructor) {
  Vue.use(BootstrapVue);
  Vue.use(BootstrapVueIcons);
}
