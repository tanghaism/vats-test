<template>
  <a-result status="404" title="404" sub-title="对不起, 您访问的链接不存在">
    <template #extra>
      <a-button type="primary" @click="toIndex">回到首页</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFound',
});
</script>

<script setup lang="ts">
import { usePermission } from '@/store/permission';
import { useRouter } from 'vue-router';

const router = useRouter();
const permissionStore = usePermission();

const toIndex = () => {
  router.replace(permissionStore.menu[0]?.path ?? '/');
};
</script>

<style lang="scss" scoped></style>
