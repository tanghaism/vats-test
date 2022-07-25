// 读取文件
export function scanFiles(ctx: any, fileExt = 'ts', returnType: 'object' | 'array' = 'object') {
  const reg = new RegExp('\\.' + fileExt + '$', 'gim');
  if (returnType === 'object') {
    const map: any = {};
    for (const key of ctx.keys()) {
      const keyArr = key.split('/');
      keyArr.shift(); // 移除.
      map[keyArr.join('.').replace(reg, '')] = ctx(key).default as never;
    }
    return map;
  } else if (returnType === 'array') {
    const map: any = [];
    for (const key of ctx.keys()) {
      map.push(...ctx(key).default);
    }
    return map;
  }
}

// 创建web worker
// @param func: web worker需要执行的函数
// @param data: 传递给web worker的参数
// @param backUpFunc: 如果浏览器不支持web worker的兼容方案，一般不用传入
export function createWorker(
  func: () => void,
  data: unknown,
  backUpFunc?: (data: unknown) => any,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (window.Worker) {
      const blob = new Blob(['(' + func.toString() + ')()']);
      const url = window.URL.createObjectURL(blob);
      const worker = new Worker(url);
      worker.postMessage(data);
      worker.onmessage = ({ data }) => {
        worker.terminate();
        resolve(data);
      };

      worker.onerror = e => {
        worker.terminate();
        reject(e.message);
      };

      worker.onmessageerror = e => {
        worker.terminate();
        reject(e);
      };
    } else {
      return backUpFunc && backUpFunc(data);
    }
  });
}

// 动态引入script
// @param link: script的src地址
// @param id: script的唯一标示，用于避免重复引用
export function loadScript(link: string, id: string) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`#${id}`)) {
      return resolve('');
    }

    // 创建script标签，引入外部文件
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = link;
    if (id) {
      script.id = id;
    }
    document.getElementsByTagName('head')[0].appendChild(script);
    // 引入成功
    script.onload = function () {
      resolve('');
    };
    // 引入失败
    script.onerror = function () {
      reject('引入失败');
    };
  });
}

// 一键复制
// @param content: 需要复制的内容
// @param container: 复制对象所在的dom树，如果为异步弹框，请传入异步弹框的dom
export function copy(
  content: string,
  container: HTMLElement = document.querySelector('body') as HTMLElement,
): boolean {
  if (!document.queryCommandSupported('copy')) {
    // 不支持
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = content;
  container.appendChild(textarea);
  textarea.select(); // 选择对象
  textarea.setSelectionRange(0, content.length); // 核心
  const result = document.execCommand('copy'); // 执行浏览器复制命令
  textarea.remove();
  return result;
}

// 版本号判断
// @param version: 要比较的版本号
// @param minVersion: 不能低于的最小版本号
// @return 如果version>=minVersion,则返回true
export function compareVersion(version: string, minVersion: string): boolean {
  const versionArray = version.split('.');
  const minVersionArray = minVersion.split('.');
  // 以版本号更长的数组作为比较标准
  const len =
    versionArray.length > minVersionArray.length ? versionArray.length : minVersionArray.length;
  // 只有某一位小版本号不一样时，才返回比较结果，小版本号相等则进入下一个小版本号判断
  for (let i = 0; i < len; i++) {
    if (Number(versionArray[i] ?? 0) > Number(minVersionArray[i] ?? 0)) {
      return true;
    }
    if (Number(versionArray[i] ?? 0) < Number(minVersionArray[i] ?? 0)) {
      return false;
    }
  }
  // 这种情况是两个版本号全等
  return true;
}
