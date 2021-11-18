import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import { createApp } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import { getServerConfig } from "./config";
import { useElementPlus } from "../src/plugins/element-plus";
import { injectResponsiveStorage } from "/@/utils/storage/responsive";

import "animate.css";
// 导入公共样式
import "/@/assets/styles/index.scss";

const app = createApp(App);
getServerConfig(app).then(async config => {
  console.log(config);
  injectResponsiveStorage(app, config);
  setupStore(app);
  app.use(router).use(MotionPlugin).use(useElementPlus);
  app.mount("#app");
});
