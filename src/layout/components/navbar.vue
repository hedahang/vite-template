<template>
  <div class="navbar">
    <Hamburger
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <Breadcrumb class="breadcrumb-container" />
    <div class="vertical-header-right">
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
import { useRouter } from "vue-router";
import { emitter } from "/@/utils/mitt";
import { useAppStoreHook } from "/@/store/modules/app";
import { storageSession } from "/@/utils/storage";

import Hamburger from "./sidebar/hamBurger.vue";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import screenfull from "./screenfull/index.vue";

const appStore = useAppStoreHook();
const router = useRouter();
let usename = storageSession.getItem("info")?.username;

function onPanel() {
  emitter.emit("openPanel");
}

function toggleSideBar() {
  appStore.toggleSideBar();
}

// 退出登录
const logout = (): void => {
  storageSession.removeItem("info");
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    .screen-full {
      cursor: pointer;

      &:hover {
        background: #f6f6f6;
      }
    }

    .globalization {
      height: 48px;
      width: 40px;
      padding: 11px;
      cursor: pointer;

      &:hover {
        background: #f6f6f6;
      }
    }

    .el-dropdown-link {
      width: 100px;
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      color: #000000d9;

      &:hover {
        background: #f6f6f6;
      }

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }

    .el-icon-setting {
      height: 48px;
      width: 38px;
      padding: 12px;
      display: flex;
      cursor: pointer;
      align-items: center;

      &:hover {
        background: #f6f6f6;
      }
    }
  }

  .breadcrumb-container {
    float: left;
  }
}

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
