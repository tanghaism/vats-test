### web worker文件夹

#### 将使用到web worker的功能放到此文件夹下，如果有用到轮训和较耗性能的算法的功能可考虑使用web worker。

#### [web worker兼容性](https://www.caniuse.com/?search=webworker)
#### [web worker快速入门](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

>使用案例

在worker文件夹内编写轮训或算法逻辑，文件名test.ts
```ts
// 将worker通过函数的方式暴露出去，方便主线程引用
export const childProcess = () => {
  // 声明算法或轮训函数
  function computed(number: number) {
    let total = 0;
    for (let i = 0; i < number; i++) {
      total += ((i * 1000) / 2000 + 1.5 - 1) % 3;
    }
    return total;
  }

  // 监听主线程的调用通知
  self.addEventListener(
    'message',
    function (e) {
      // 获取主线程传递过来的数据
      const number = e.data;

      // 获取计算结果
      const result = computed(number);

      // 将计算结果传递给主线程
      self.postMessage(result);

      // 关闭当前子线程
      self.close();
    },
    false,
  );
}
```

在页面组件内生成worker实例
```vue
<template>
  <div v-loading="loading">
    <p style="margin-bottom: 10px">
      <fe-button type="primary" @click="doWorker">累加一次</fe-button>
    </p>
    <p>worker计算结果：{{ result }}</p>
  </div>
</template>
```
```ts
import { ref } from 'vue'
import { createWorker } from "@/utils/utils";
import { childProcess } from "@/worker/test";

export default {
  setup(){
    const result = ref<number>(0);
    const loading = ref<boolean>(false);

    // 初始化worker实例，并将worker的处理结果通过promise返回
    const doWorker = async () => {
      loading.value = true;
      const data = result.value ? result.value + 10000 : 10000;
      result.value = (await createWorker(childProcess, data)) as number;
      loading.value = false;
    };

    return {
      result,
      loading,
      doWorker,
    };
  }
}

```

