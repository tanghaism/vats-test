import { message, Modal, notification } from 'ant-design-vue';

declare global {
  export type IAntdLang = 'zh_CN' | 'ja_JP' | 'en_US';
  interface Window {
    $message: typeof message;
    $modal: typeof Modal;
    $notification: typeof notification;
  }
}
