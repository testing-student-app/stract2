<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    {{ a }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

const VueComponent = Vue.extend({
  data() {
    return {};
  },
  components: {
    HelloWorld,
  },
  computed: {
    b(): string {
      this;
      return '123';
    },
  },
  methods: {
    a(this: App): string {
      return this.b;
    },
  },
});
export default class App extends VueComponent {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
