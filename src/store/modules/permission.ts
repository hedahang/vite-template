import { defineStore } from "pinia";
import { store } from "/@/store";
import { constantRoutesArr, ascending, filterTree } from "/@/router/index";

export const usePermissionStore = defineStore({
  id: "permission",
  state: () => ({
    // 静态路由
    constantRoutes: constantRoutesArr,
    wholeRoutes: [],
    buttonAuth: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    asyncActionRoutes(routes) {
      if (this.wholeRoutes.length > 0) return;
      console.log(routes);
    },
    async changeSetting(routes) {
      await this.asyncActionRoutes(routes);
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
