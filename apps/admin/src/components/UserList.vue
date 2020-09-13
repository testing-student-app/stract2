<template>
  <b-list-group>
    <b-list-group-item v-for="u in users" :key="u.remote_addr">
      {{ u.name || u.remote_addr }}
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { customMapState } from '@stract2/utils';

export default Vue.extend({
  name: 'UserList',

  computed: {
    ...customMapState({
      users: (state) => state.serverInterlayer.users,
    }),
  },
});
</script>
