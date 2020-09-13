<template>
  <div>
    <nav-bar />

    <b-container :fluid="true" class="main py-3">
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
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
      return ['tests'];
    },
  },

  watch: {},

  beforeCreate() {
    // tauri.listen('state', ({ payload: state }) => {
    //   const { name, payload } = state;
    //   this.$store.dispatch(name, payload);
    // });
  },
});
</script>

<style lang="scss"></style>
