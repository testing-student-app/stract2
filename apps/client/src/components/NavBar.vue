<template>
  <b-navbar variant="dark">
    <ConnectedBadge :channels="['tests']" />
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { customMapState } from '@stract2/utils';
import { ConnectedBadge } from '@stract2/vue-shared-components';

export default Vue.extend({
  name: 'NavBar',
  components: {
    ConnectedBadge,
  },
  computed: {
    ...customMapState({
      serverStatus: (state) => state.serverInterlayer.serverStatus,
    }),
  },
});
</script>

<style></style>
