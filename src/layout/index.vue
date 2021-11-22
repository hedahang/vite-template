<template>
  <div :class="['app-wrapper', set.classes]" v-resize>
    <div class="header" v-show="!hiddenSideBar && layout.includes('vertical')">
      header
    </div>
    <div :class="['main-container', hiddenSideBar ? 'main-hidden' : '']">
      <div v-if="set.fixedHeader">
        <div class="header">fixedHeader</div>
        <!-- 主题内容 -->
        <router-view></router-view>
      </div>
      <el-scrollbar v-else>
        <el-backtop
          title="回到顶部"
          target=".main-container .el-scrollbar__wrap"
          ><backTop />
        </el-backtop>
        <div class="header">el-scrollbar</div>
        <!-- 主题内容 -->
        <router-view></router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { routerArrays, setType } from "./types";
import { emitter } from "/@/utils/mitt";
import backTop from "/@/assets/images/svg/back_top.svg";
import { useAppStoreHook } from "/@/store/modules/app";
import { useSettingStoreHook } from "/@/store/modules/settings";

const instance = getCurrentInstance().appContext.app.config.globalProperties;
const hiddenSideBar = ref(instance.$config?.HiddenSideBar);
const pureSetting = useSettingStoreHook();

// 清空缓存后从serverConfig.json读取默认配置并赋值到storage中

const layout = computed(() => {
  // 路由
  if (
    !instance.$storage.routesInStorage ||
    instance.$storage.routesInStorage.length === 0
  ) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    instance.$storage.routesInStorage = routerArrays;
  }
  // 导航
  if (!instance.$storage.layout) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    instance.$storage.layout = {
      layout: instance.$config?.Layout ?? "vertical",
      theme: instance.$config?.Theme ?? "default"
    };
  }
  // 灰色模式、色弱模式、隐藏标签页
  if (!instance.$storage.sets) {
    // eslint-disable-next-line
    instance.$storage.sets = {
      grey: instance.$config?.Grey ?? false,
      weak: instance.$config?.Weak ?? false,
      hideTabs: instance.$config?.HideTabs ?? false
    };
  }
  console.log("*****", instance);
  return instance.$storage?.layout.layout;
});

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  fixedHeader: computed(() => {
    return pureSetting.fixedHeader;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation
    };
  }),

  hideTabs: computed(() => {
    return instance.$storage?.sets.hideTabs;
  })
});

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  instance.$storage.layout = {
    layout: `${layoutModel}`,
    theme: instance.$storage.layout?.theme
  };
}

// 监听容器
emitter.on("resize", config => {
  let { width } = config.detail;
  width <= 670 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
});
</script>
<style lang="scss" scoped>
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

.app-wrapper {
  @include clearfix;

  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.main-hidden {
  margin-left: 0 !important;
}

.re-screen {
  margin-top: 12px;
}
</style>
