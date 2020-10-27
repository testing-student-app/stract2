<template>
  <b-row class="h-100">
    <b-col cols="4" class="h-100 overflow-auto border-right">
      <h3 class="font-weight-bold">Connected Users</h3>
      <user-list />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue';
import UserList from '../components/UserList.vue';

export default Vue.extend({
  name: 'Main',

  components: {
    UserList,
  },
});
</script>
