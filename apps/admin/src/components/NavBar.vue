<template>
  <LightNavbar>
    <ConnectedBadge :channels="['admin']" />
  </LightNavbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConnectedBadge, LightNavbar } from '@stract2/vue-shared-components';

export default Vue.extend({
  name: 'NavBar',

  components: {
    ConnectedBadge,
    LightNavbar
  },

  methods: {}
});
</script>

<style></style>
