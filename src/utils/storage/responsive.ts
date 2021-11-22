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
    },
    sets: {
      type: Object,
      default: Storage.getData(undefined, "sets") ?? {
        grey: config.Grey ?? false,
        weak: config.Weak ?? false,
        hideTabs: config.HideTabs ?? false
      }
    }
  });
};
