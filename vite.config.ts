import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  // root: './src',
  // base: './',
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] })
  ],
  build: {
    assetsDir: './',
    rollupOptions: {
      inlineDynamicImports: true,
      input: {
        /**
         * 点击插件图标出现的弹窗
         * */
        popup: resolve(__dirname, 'src/popup/index.html'),
        /**
         * chrome devtool pane 页面
         * */
        // devtoolPage: resolve(__dirname, 'src/devtoolPage/index.html'),
        /**
         * 插件的核心 JS，一直活跃在后台，来监听所有请求
         * */
        // background: resolve(__dirname, 'src/background/index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        /**
         * 加载 chrome devtool pane 的入口
         * */
        // devtool: resolve(__dirname, 'src/devtool/index.html'),
        /**
         * 插件设置页面
         * */
        // options: resolve(__dirname, 'src/options/index.html'),
        /**
         * 与页面同级，并在某个时机执行，可以拿到页面的 document
         * */
        content: resolve(__dirname, 'src/content.ts'),
        main: resolve(__dirname, 'src/main.ts')
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js'
      }
    }
  }
})
