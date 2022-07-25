import axios, { CustomerAxiosResponse } from 'axios';
import { Local } from '@/utils/storage';
import { TOKEN } from '@/constants/storage';
import { message } from 'ant-design-vue';

// 创建实例时设置配置的默认值
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/api',
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    return {
      ...config,
      headers: {
        Authorization: Local.get(TOKEN) || '',
        ...config.headers,
      },
      params: {
        ...config.params,
        _t: Date.now(),
      },
    };
  },
  error => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response: CustomerAxiosResponse) {
    // 对响应数据做点什么
    const { data } = response;
    return Promise.resolve(data);
  },
  function (error) {
    const hideError = error?.config?.hideError;
    const { data, statusText } = error?.response || {};
    if (!hideError) {
      message.error(data?.message || statusText || '服务异常，请稍后再试');
    }
    return Promise.reject(error);
  },
);

export default instance;
