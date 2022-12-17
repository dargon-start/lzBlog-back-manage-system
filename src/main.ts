import {createApp} from "vue";
import router from "./router";
import App from "./App.vue";
import {createPinia} from "pinia";
import "element-plus/dist/index.css";
import "@/assets/css/base.less";
import "animate.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import ElementPlus from "element-plus";
// import "default-passive-events";
createApp(App)
  .use(createPinia())
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
