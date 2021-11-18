import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { injectResponsiveStorage } from "/@/utils/storage/responsive";
import { getServerConfig } from "./config";

import "animate.css";
// 导入公共样式
import "/@/assets/styles/index.scss";

const app = createApp(App);
getServerConfig(app).then(async config => {
  console.log(config);
  injectResponsiveStorage(app, config);
  app.use(router);
  app.mount("#app");
});
