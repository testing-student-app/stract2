<template>
  <b-row class="h-100">
    <b-col cols="12" class="h-100">
      <test-list />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue';
import TestList from '../components/TestList.vue';

export default Vue.extend({
  name: 'Main',

  components: {
    TestList,
  },
});
</script>
