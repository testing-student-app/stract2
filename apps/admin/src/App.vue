<template>
  <div>
    <nav-bar />

    <b-container fluid class="main py-3">
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import { mapActions } from 'vuex';
import NavBar from './components/NavBar.vue';
import { loguxMixin } from '@logux/vuex';

export default Vue.extend({
  name: 'App',
  mixins: [loguxMixin],
  components: {
    NavBar,
  },
  computed: {
    channels() {
      return ['admin'];
    },
  },
  methods: {
    ...mapActions(['setServerStatus']),
  },
});
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

.main {
  height: calc(100% - 56px);
  position: absolute;
}
</style>
