<template>
  <VatsLayout
    :menu="permissionStore.menu"
    :system="{
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Vats',
      subTitle: 'This is Vats',
    }"
    :userInfo="{
      nickname: 'Vats User',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    }"
    startYear="2022"
    :onLogout="() => true"
    :onEditPwd="() => true"
  >
    <template #setting>
      <!--  切换语言  -->
      <a-typography-text strong class="vats-setting-title vats-block"> 语言设置 </a-typography-text>
      <div class="vats-flex vats-setting-subtitle">
        <span class="vats-flex-1">
          <a-typography-text> 当前语言 </a-typography-text>
        </span>
        <div>
          <VatsSelect
            :value="rootSetting.lang"
            placeholder="请选择语言"
            @change="rootSetting.setLang"
            style="width: 140px"
          >
            <a-select-option
              v-for="item in LANG_OPTION"
              :key="item.lang"
              :value="item.lang"
              :disabled="item.disabled"
            >
              <span>{{ item.flag }}</span>
              &nbsp;&nbsp;{{ item.name }}
            </a-select-option>
          </VatsSelect>
        </div>
      </div>

      <a-divider />
    </template>
  </VatsLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutIndex',
});
</script>

<script setup lang="ts">
import { usePermission } from '@/store/permission';
import { useRoot } from '@/store/root';
import { LANG_OPTION } from '@/constants/options';

const permissionStore = usePermission();
const rootSetting = useRoot();
</script>

<style lang="scss" scoped></style>
