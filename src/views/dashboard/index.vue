<template>
  <vats-page :has-permission="true" title="Dashboard" @init="handlePass">
    这是dashboard页面
  </vats-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DashboardIndex',
});
</script>

<script lang="ts" setup>
const handlePass = () => {
  console.log('触发了');
};
</script>

<style scoped lang="scss"></style>
