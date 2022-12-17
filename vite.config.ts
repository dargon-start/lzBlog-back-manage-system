import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src/",
    },
  },
  server: {
    open: true, //启动项目自动弹出浏览器
    port: 4001, //启动端口
    proxy: {
      "/api": {
        target: "http://localhost:8000", //实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {},
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 2000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 处理分包
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.indexOf("node_modules") !== -1) {
    //         return id
    //           .toString()
    //           .split("node_modules/")[1]
    //           .split("/")[0]
    //           .toString();
    //       }
    //     },
    //     chunkFileNames: (chunkInfo) => {
    //       const facadeModuleId = chunkInfo.facadeModuleId
    //         ? chunkInfo.facadeModuleId.split("/")
    //         : [];
    //       const fileName =
    //         facadeModuleId[facadeModuleId.length - 2] || "[name]";
    //       return `js/${fileName}/[name].[hash].js`;
    //     },
    //   },
    // },
  },
});
