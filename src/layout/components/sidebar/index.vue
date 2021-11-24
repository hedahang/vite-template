<template>
  <div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo v-if="showLogo === '1'" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        router
        :collapse-transition="false"
        mode="vertical"
        class="outer-most"
        @select="menuSelect"
      >
        <sidebar-item
          v-for="route in routeStore.wholeRoutes"
          :key="route.path"
          :item="route"
          class="outer-most"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { emitter } from "/@/utils/mitt";
import { storageLocal } from "/@/utils/storage";
import { useAppStoreHook } from "/@/store/modules/app";
import { usePermissionStoreHook } from "/@/store/modules/permission";

import Logo from "./logo.vue";
import SidebarItem from "./sidebarItem.vue";

const route = useRoute();
const pureApp = useAppStoreHook();
const routeStore = usePermissionStoreHook();
const showLogo = ref(storageLocal.getItem("logoVal") || "1");
const isCollapse = computed(() => {
  return !pureApp.getSidebarStatus;
});
const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
    return meta.activeMenu;
  }
  return path;
});
const menuSelect = (indexPath: string, index, item, routeResult): void => {
  console.log(index);
  console.log(indexPath);
  console.log(item);
  console.log(routeResult);
  let parentPath = "";
  let parentPathIndex = indexPath.lastIndexOf("/");
  if (parentPathIndex > 0) {
    parentPath = indexPath.slice(0, parentPathIndex);
  }
  console.log(parentPath);
  // 找到当前路由的信息
  // function findCurrentRoute(routes) {
  //   return routes.map(item => {
  //     if (item.path === indexPath) {
  //       // 切换左侧菜单 通知标签页
  //       emitter.emit("changLayoutRoute", {
  //         indexPath,
  //         parentPath
  //       });
  //     } else {
  //       if (item.children) findCurrentRoute(item.children);
  //     }
  //   });
  // }
  // findCurrentRoute(algorithm.increaseIndexes(router));
};
</script>

<style scoped></style>
