import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import { createApp, Directive } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import { getServerConfig } from "./config";
import { useElementPlus } from "../src/plugins/element-plus";
import { injectResponsiveStorage } from "/@/utils/storage/responsive";

import "animate.css";
// 导入公共样式
import "/@/assets/styles/index.scss";

const app = createApp(App);

// 自定义指令
import * as directives from "/@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

getServerConfig(app).then(async config => {
  console.log(config);
  injectResponsiveStorage(app, config);
  setupStore(app);
  app.use(router).use(MotionPlugin).use(useElementPlus);
  await router.isReady();
  app.mount("#app");
});
