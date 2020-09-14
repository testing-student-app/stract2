<template>
  <LightNavbar>
    <ConnectedBadge :channels="['tests']" />
  </LightNavbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConnectedBadge, LightNavbar } from '@stract2/vue-shared-components';

export default Vue.extend({
  name: 'NavBar',
  components: {
    ConnectedBadge,
    LightNavbar,
  },
});
</script>

<style></style>
