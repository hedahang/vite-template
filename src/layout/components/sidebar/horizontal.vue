<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left" @click="backHome">
      <Icon svg :width="35" :height="35" content="team-iconlogo" />
      <h4>{{ title }}</h4>
    </div>
    <el-menu
      ref="menu"
      :default-active="activeMenu"
      unique-opened
      router
      class="horizontal-header-menu"
      mode="horizontal"
      @select="menuSelect"
    >
      <sidebar-item
        v-for="route in routeStore.wholeRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>

    <div class="horizontal-header-right">
      <!-- 全屏 -->
      <screenfull />

      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?s=400&u=30907819abd29bb3779bc247910873e7c7f7c12f&v=4"
          />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item icon="switch-button" @click="logout"
              >退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon class="el-icon-setting" title="打开项目配置" @click="onPanel">
        <Setting />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { templateRef } from "@vueuse/core";
import { emitter } from "/@/utils/mitt";
import { algorithm } from "/@/utils/algorithm";
import { storageSession } from "/@/utils/storage";
import Icon from "/@/components/ReIcon";
import { usePermissionStoreHook } from "/@/store/modules/permission";

import SidebarItem from "./sidebarItem.vue";
import screenfull from "../screenfull/index.vue";

const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;

const menuRef = templateRef<ElRef | null>("menu", null);
const route = useRoute();
const router = useRouter();
const routers = useRouter().options.routes;
const routeStore = usePermissionStoreHook();
let usename = storageSession.getItem("info")?.username;

// 退出登录
const logout = (): void => {
  storageSession.removeItem("info");
  router.push("/login");
};

function onPanel() {
  emitter.emit("openPanel");
}

const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
    return meta.activeMenu;
  }
  return path;
});

const menuSelect = (indexPath: string): void => {
  let parentPath = "";
  let parentPathIndex = indexPath.lastIndexOf("/");
  if (parentPathIndex > 0) {
    parentPath = indexPath.slice(0, parentPathIndex);
  }
  // 找到当前路由的信息
  function findCurrentRoute(routes) {
    return routes.map(item => {
      if (item.path === indexPath) {
        // 切换左侧菜单 通知标签页
        emitter.emit("changLayoutRoute", {
          indexPath,
          parentPath
        });
      } else {
        if (item.children) findCurrentRoute(item.children);
      }
    });
  }
  findCurrentRoute(algorithm.increaseIndexes(routers));
};

function backHome() {
  router.push("/welcome");
}

onMounted(() => {
  nextTick(() => {
    menuRef.value.handleResize();
  });
});
</script>
<style lang="scss" scoped>
.logout {
  .el-dropdown-menu__item {
    padding: 0 18px !important;
    display: flex;
    align-items: center;
  }

  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #606266;
    background: #f0f0f0;
  }
}
</style>
