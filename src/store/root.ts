import { defineStore, StoreGetters } from 'pinia';
import { Local } from '@/utils/storage';
import { LANG } from '@/constants/storage';
import { ILangMapKey } from '@/utils/i18n';

type IRootState = {
  lang: ILangMapKey;
  userInfo: null | Record<string, unknown>;
};

type IRootAction = {
  setLang(lang: ILangMapKey): Promise<void>;
};

export const useRoot = defineStore<string, IRootState, StoreGetters<unknown>, IRootAction>('root', {
  state() {
    return {
      lang: Local.get(LANG) ?? 'zh',
      userInfo: null,
    };
  },
  actions: {
    async setLang(lang) {
      this.lang = lang;
      Local.set(LANG, lang);
    },
  },
});
