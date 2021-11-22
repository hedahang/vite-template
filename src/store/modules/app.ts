import { defineStore } from "pinia";
import { storageLocal } from "/@/utils/storage";
import { store } from "/@/store";
import { getConfig } from "/@/config";

interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  layout: string;
}

export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    sidebar: {
      opened: storageLocal.getItem("sidebarStatus")
        ? !!+storageLocal.getItem("sidebarStatus")
        : true,
      withoutAnimation: true
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    layout:
      storageLocal.getItem("responsive-layout")?.layout ?? getConfig().Layout
  })
});
export function useAppStoreHook() {
  return useAppStore(store);
}
