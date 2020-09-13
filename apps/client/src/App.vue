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

export default Vue.extend({
  name: 'App',

  components: {
    NavBar,
  },

  computed: {},

  watch: {},

  mounted() {
    this.$ws.connect(`ws://127.0.0.1:port/ws/c`);
  },

  beforeCreate() {
    // tauri.listen('state', ({ payload: state }) => {
    //   const { name, payload } = state;
    //   this.$store.dispatch(name, payload);
    // });
  },
});
</script>

<style lang="scss"></style>
