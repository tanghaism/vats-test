import { defineConfig, loadEnv, HtmlTagDescriptor } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import { name, description, dependencies } from './package.json';
import semver from 'semver';

const getVersion = (name: string) => {
  const { version } = require(`./node_modules/${name}/package.json`) || {};
  if (version) {
    return semver.minVersion(version);
  } else {
    return semver.minVersion(dependencies[name]);
  }
};

const external = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  'vue-i18n': 'VueI18n',
  pinia: 'Pinia',
  axios: 'axios',
  dayjs: 'dayjs',
  'vue-demi': 'VueDemi',
  './dayjs': 'dayjs',
  'ant-design-vue': 'antd',
  'ant-design-vue/dist/antd.min.css': 'antd',
};

const injectType: Record<'js' | 'css', (attrs: Record<string, string>) => HtmlTagDescriptor> = {
  js: attrs => ({
    tag: 'script',
    injectTo: 'body',
    attrs: {
      ...attrs,
    },
  }),
  css: attrs => ({
    tag: 'link',
    injectTo: 'head',
    attrs: {
      rel: 'stylesheet',
      ...attrs,
    },
  }),
};

const jsLink = [
  `https://cdn.staticfile.org/axios/${getVersion('axios')}/axios.min.js`,
  `https://cdn.staticfile.org/dayjs/${getVersion('dayjs')}/dayjs.min.js`,
  `https://cdn.staticfile.org/vue/${getVersion('vue')}/vue.global.prod.min.js`,
  `https://cdn.staticfile.org/vue-router/${getVersion('vue-router')}/vue-router.global.prod.min.js`,
  `https://cdn.staticfile.org/vue-i18n/${getVersion('vue-i18n')}/vue-i18n.global.prod.min.js`,
  `https://cdn.staticfile.org/vue-demi/${getVersion('vue-demi')}/index.iife.js`,
  `https://cdn.staticfile.org/pinia/${getVersion('pinia')}/pinia.iife.prod.min.js`,
  `https://cdn.staticfile.org/ant-design-vue/${getVersion('ant-design-vue')}/antd.min.js`,
];

const cssLink = [
  `https://cdn.staticfile.org/ant-design-vue/${getVersion('ant-design-vue')}/antd.min.css`,
];

const externalCDN: HtmlTagDescriptor[] = [
  ...jsLink.map(str => injectType.js({ src: str })),
  ...cssLink.map(str => injectType.css({ href: str })),
];

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const IS_PROD = mode === 'production';
  const { VITE_APP_BASE_API, VITE_APP_BASE_HOST } = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [
      vue(),
      VitePWA({
        registerType: 'prompt',
        workbox: {
          skipWaiting: false,
          cleanupOutdatedCaches: true,
          // 可缓存远程静态资源
          // runtimeCaching: [
          //   {
          //     urlPattern: /^https:\/\/cdn\.staticfile\.org\/.*/i,
          //     handler: 'CacheFirst',
          //     method: 'GET',
          //     options: {
          //       cacheName: 'cdn-assets',
          //       expiration: {
          //         maxEntries: 10,
          //         maxAgeSeconds: 60 * 60 * 24 * 30, // <== 30 days
          //       },
          //       cacheableResponse: {
          //         statuses: [0, 200],
          //       },
          //     },
          //   },
          // ],
        },
        manifest: {
          name: name,
          short_name: name,
          description: description,
          theme_color: '#4DBA87',
          start_url: '.',
          display: 'standalone',
          background_color: '#000000',
          icons: [
            { src: './img/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: './img/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: './img/icons/android-chrome-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: './img/icons/android-chrome-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: name,
            description: description,
          },
          tags: IS_PROD ? externalCDN : [],
        },
        minify: 'terser',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/scss/variables.scss";`,
        },
      },
    },
    server: {
      open: true,
      host: '0.0.0.0',
      port: 8091,
      proxy: {
        [`^${VITE_APP_BASE_API}`]: {
          target: VITE_APP_BASE_HOST,
          changeOrigin: true,
          rewrite: path => path.replace(`${VITE_APP_BASE_API}`, ''),
        },
      },
      cors: true,
    },
    preview: {
      port: 8091,
      host: '0.0.0.0',
      open: true,
      https: true,
      proxy: {
        [`^${VITE_APP_BASE_API}`]: {
          target: VITE_APP_BASE_HOST,
          changeOrigin: true,
          rewrite: path => path.replace(`${VITE_APP_BASE_API}`, ''),
        },
      },
    },
    build: {
      minify: 'terser',
      emptyOutDir: true,
      cssCodeSplit: false,
      polyfillDynamicImport: false,
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        external: Object.keys(external),
        output: {
          format: 'iife',
          globals: external,
          inlineDynamicImports: true,
        },
      },
    },
  });
};
