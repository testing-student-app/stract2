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
import { customMapState } from '@stract2/utils';
import NavBar from './components/NavBar.vue';
import { loguxMixin } from '@logux/vuex';

export default Vue.extend({
  name: 'App',
  mixins: [loguxMixin],
  components: {
    NavBar,
  },

  computed: {
    ...customMapState({
      // serverLoaded: (state) => state.serverLoaded,
      // serverPort: (state) => state.serverPort,
    }),
    channels() {
      return ['admin'];
    },
  },

  watch: {},

  beforeCreate() {
    // tauri.listen('state', ({ payload: state }) => {
    //   const { name, payload } = state;
    //   this.$store.dispatch(name, payload);
    // });
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
