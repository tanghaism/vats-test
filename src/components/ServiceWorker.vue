<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ServiceWorker',
});
</script>

<script setup lang="ts">
import { h, watch } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { needRefresh, updateServiceWorker } = useRegisterSW();

let savedPrompt: any = null;
window.addEventListener(
  'beforeinstallprompt',
  function (e: any) {
    // 监听到可安装事件，进行触发提醒用户
    e.preventDefault();
    savedPrompt = e;
    window.$notification.info({
      message: '是否将网站安装在桌面上',
      description: h(
        'button',
        {
          type: 'button',
          class: 'el-button el-button--mini el-button--success is-round',
          id: 'prompt',
        },
        {
          default: () => '立即安装',
        },
      ),
    });
    setTimeout(() => {
      const btn = document.querySelector('#prompt');
      if (btn) {
        (btn as any).onclick = () => {
          savedPrompt.prompt();
          savedPrompt.userChoice.then((result: any) => {
            console.log(result);
          });
        };
      }
    }, 200);
    return false;
  },
  { once: true },
);

watch(
  () => needRefresh.value,
  newVal => {
    console.log('needRefresh.value', newVal);
    if (newVal) {
      window.$modal.confirm({
        title: '监测到新版本',
        content: '是否立即刷新，启用新版本？',
        okText: '立即刷新',
        cancelText: '放弃',
        onOk() {
          updateServiceWorker();
        },
        onCancel() {
          needRefresh.value = false;
        },
      });
    }
  },
);

const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => console.log('error'));
  }
};

defineExpose({
  unregister,
});
</script>

<style lang="scss" scoped></style>
