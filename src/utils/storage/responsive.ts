// 响应式storage
import { App } from "vue";
import Storage from "responsive-storage";

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
  app.use(Storage, {
    // 国际化 默认中文zh
    locale: {
      type: Object,
      default: Storage.getData(undefined, "locale") ?? {
        locale: config.Locale ?? "zh"
      }
    }
  });
};
