// 本地储存类

// @param key: 键名
// @param value: 存储的值
// @param expires: 有效期，单位毫秒，不传或传0则表示不会过期
function setItem(this: Storage, key: string, value: any, expires = 0): void {
  this.setItem(
    key,
    JSON.stringify({
      value,
      expires: expires ? Date.now() + expires : expires,
    }),
  );
}

// @param key: 键名
function getItem(this: Storage, key: string): any {
  const data = this.getItem(key);
  if (!data) {
    return null;
  }
  try {
    const { value, expires } = JSON.parse(data);
    // 如果过期则返回空
    if (expires && Date.now() >= expires) {
      this.removeItem(key);
      return null;
    }
    return value;
  } catch (e) {
    console.warn('getItem获取到的数据格式不正确');
    return null;
  }
}

// @param key: 键名
function removeItem(this: Storage, key: string): void {
  this.removeItem(key);
}

function clearItem(this: Storage) {
  this.clear();
}

export class Local {
  static set(key: string, value: any, expires = 0) {
    return setItem.call(localStorage, key, value, expires);
  }

  static get(key: string) {
    return getItem.call(localStorage, key);
  }

  static remove(key: string) {
    return removeItem.call(localStorage, key);
  }

  static clear() {
    return clearItem.call(localStorage);
  }
}

export class Session {
  static set(key: string, value: any, expires = 0) {
    return setItem.call(sessionStorage, key, value, expires);
  }

  static get(key: string) {
    return getItem.call(sessionStorage, key);
  }

  static remove(key: string) {
    return removeItem.call(sessionStorage, key);
  }

  static clear() {
    return clearItem.call(sessionStorage);
  }
}
