<template>
  <vats-provider :locale="localeMessage">
    <router-view />
  </vats-provider>
  <VueWaterMarker :content="watermarkTexts" />
  <ServiceWorker />
</template>

<script setup lang="ts">
import ServiceWorker from '@/components/ServiceWorker.vue';

import { ref, watch } from 'vue';
import { useRoot } from '@/store/root';
import VueWaterMarker from 'vue-watermarker';
import { useI18n } from 'vue-i18n';
import { ILangMapKey, loadMessage } from '@/utils/i18n';

const rootStore = useRoot();
const { setLocaleMessage, locale } = useI18n();

const localeMessage = ref(null);
const setLocale = async (lang: ILangMapKey) => {
  const { message, antMessage } = await loadMessage(lang);
  locale.value = lang;
  localeMessage.value = antMessage.default;
  setLocaleMessage(lang, message.default);
};

setLocale(rootStore.lang);

watch(
  () => rootStore.lang,
  newVal => {
    setLocale(newVal);
  },
);

const watermarkTexts = ref<string[]>([
  'welcome to use Vats',
  'Auth: TangHai',
  new Date().toLocaleString(),
]);
</script>

<style></style>
