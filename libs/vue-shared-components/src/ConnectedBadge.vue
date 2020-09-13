<template>
  <b-navbar-brand>
    <b-badge v-if="!isSubscribing" variant="success" class="text-wrap">
      Connected
    </b-badge>
    <b-badge v-else variant="danger" class="text-wrap">
      Not connected
    </b-badge>
  </b-navbar-brand>
</template>

<script lang="ts">
import Vue from 'vue';
import { loguxMixin } from '@logux/vuex';

export default Vue.extend({
  mixins: [loguxMixin],
  props: {
    channels: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style scoped>
</style>
