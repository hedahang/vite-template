<template>
  <div ref="containerDom" class="tags-view" v-if="!showTags">
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll-container">
      <div
        v-for="(item, index) in dynamicTagList"
        :key="index"
        :ref="'dynamic' + index"
        :class="[
          'scroll-item is-closable',
          $route.path === item.path ? 'is-active' : '',
          $route.path === item.path && showModel === 'card' ? 'card-active' : ''
        ]"
        @contextmenu.prevent="openMenu(item, $event)"
        @mouseenter.prevent="onMouseenter(item, index)"
        @mouseleave.prevent="onMouseleave(item, index)"
      >
        <router-link :to="item.path">{{ item.meta.title }}</router-link>
        <el-icon
          v-if="index !== 0"
          class="el-icon-close"
          @click="deleteMenu(item)"
        >
          <CloseBold />
        </el-icon>
        <div
          :ref="'schedule' + index"
          v-if="showModel !== 'card'"
          :class="{
            'schedule-active': $route.path === item.path
          }"
        ></div>
      </div>
    </el-scrollbar>
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <ul
        v-show="visible"
        :key="Math.random()"
        :style="{ left: buttonLeft + 'px', top: buttonTop + 'px' }"
        class="contextmenu"
      >
        <div
          v-for="(item, key) in tagsViews"
          :key="key"
          style="display: flex; align-items: center"
        >
          <li v-if="item.show" @click="selectTag(key, item)">
            <component :is="item.icon" :key="key + 'icon'" />
            {{ item.text }}
          </li>
        </div>
      </ul>
    </transition>
    <!-- 右侧功能按钮 -->
    <ul class="right-button">
      <li>
        <el-icon
          title="刷新路由"
          class="el-icon-refresh-right rotate"
          @click="onFresh"
        >
          <RefreshRight />
        </el-icon>
      </li>
      <li>
        <slot></slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onBeforeMount,
  unref,
  nextTick,
  computed,
  getCurrentInstance,
  ComputedRef,
  shallowRef
} from "vue";
import {
  RouteConfigs,
  relativeStorageType,
  routerArrays as routerArray,
  tagsViewsType
} from "../../types";
import { emitter } from "/@/utils/mitt";
import { templateRef } from "@vueuse/core";
import { handleAliveRoute, delAliveRoutes } from "/@/router";
import { storageLocal } from "/@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { toggleClass, removeClass } from "/@/utils/globalFun";
import Icon from "/@/components/ReIcon/src/Icon.vue";

import close from "/@/assets/images/svg/close.svg";
import refresh from "/@/assets/images/svg/refresh.svg";
import closeAll from "/@/assets/images/svg/close_all.svg";
import closeOther from "/@/assets/images/svg/close_other.svg";

let refreshButton = "refresh-button";
const instance = getCurrentInstance();

// 响应式storage
let relativeStorage: relativeStorageType;
const route = useRoute();
const router = useRouter();
const dynamicTagList: ComputedRef<Array<RouteConfigs>> = computed(() => {
  return relativeStorage.routesInStorage;
});
let routerArrays: Array<RouteConfigs> = [];
const activeIndex = ref(-1);

const showTags = ref(storageLocal.getItem("tagsVal") || false);
const containerDom = templateRef<HTMLElement | null>("containerDom", null);

// 显示模式，默认灵动模式显示
const showModel = ref(storageLocal.getItem("showModel") || "smart");
if (!showModel.value) {
  storageLocal.setItem("showModel", "card");
}

const tagsViews = shallowRef<Array<tagsViewsType>>([
  {
    icon: refresh,
    text: "刷新页面",
    show: true
  },
  {
    icon: close,
    text: "关闭当前",
    show: true
  },
  {
    icon: closeOther,
    text: "关闭其他",
    show: true
  },
  {
    icon: closeAll,
    text: "关闭所有",
    show: true
  }
]);

let visible = ref(false);
let buttonLeft = ref(0);
let buttonTop = ref(0);

// 当前右键选中的路由信息
let currentSelect = ref({});

// 重新加载
function onFresh() {
  toggleClass(true, refreshButton, document.querySelector(".rotate"));
  const { fullPath } = unref(route);
  router.replace({
    path: "/redirect" + fullPath
  });
  setTimeout(() => {
    removeClass(document.querySelector(".rotate"), refreshButton);
  }, 600);
}

function onClickDrop(key, item, selectRoute?: RouteConfigs) {
  // 当前路由信息
  switch (key) {
    case 0:
      // 重新加载
      onFresh();
      break;
    case 1:
      // 关闭当前页
      selectRoute
        ? deleteMenu({
            path: selectRoute.path,
            meta: selectRoute.meta,
            name: selectRoute.name
          })
        : deleteMenu({ path: route.path, meta: route.meta });
      break;
    case 2:
      // 关闭其他标签
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "other"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "other");
      break;
    case 3:
      // 关闭全部标签页
      routerArrays.splice(1, routerArrays.length);
      relativeStorage.routesInStorage = routerArrays;
      usePermissionStoreHook().clearAllCachePage();
      router.push("/home");
      break;
  }
}
// 触发右键中菜单的点击事件
function selectTag(key, item) {
  onClickDrop(key, item, currentSelect.value);
}

function deleteDynamicTag(obj: any, current: any, tag?: string) {
  // 存放被删除的缓存路由
  let delAliveRouteList = [];
  let valueIndex: number = routerArrays.findIndex((item: any) => {
    return item.path === obj.path;
  });

  const spliceRoute = (start?: number, end?: number, other?: boolean): void => {
    if (other) {
      let arrs = [...routerArray];
      if (obj.path !== "/home") arrs.push(obj);
      relativeStorage.routesInStorage = [...arrs];
      routerArrays = relativeStorage.routesInStorage;
    } else {
      delAliveRouteList = routerArrays.splice(start, end);
      relativeStorage.routesInStorage = routerArrays;
    }
  };
  if (tag === "other") {
    spliceRoute(1, 1, true);
  } else {
    // 从当前匹配到的路径中删除
    spliceRoute(valueIndex, 1);
  }
  let newRoute: any = routerArrays.slice(-1);
  if (current === route.path) {
    // 删除缓存路由
    tag
      ? delAliveRoutes(delAliveRouteList)
      : handleAliveRoute(route.matched, "delete");
    // 如果删除当前激活tag就自动切换到最后一个tag
    nextTick(() => {
      router.push({
        path: newRoute[0].path
      });
    });
  } else {
    // 删除缓存路由
    tag ? delAliveRoutes(delAliveRouteList) : delAliveRoutes([obj]);
    if (!routerArrays.length) return;
    let isHasActiveTag = routerArrays.some(item => {
      return item.path === route.path;
    });
    !isHasActiveTag &&
      router.push({
        path: newRoute[0].path
      });
  }
}
// 删除标签
function deleteMenu(item, tag?: string) {
  deleteDynamicTag(item, item.path, tag);
}

// 关闭右键菜单
function closeMenu() {
  visible.value = false;
}
// 打开右键菜单
function openMenu(tag, e) {
  closeMenu();
  // 右键菜单为首页，隐藏关闭当前页
  tagsViews.value[1].show = tag.path === "/home" ? false : true;

  currentSelect.value = tag;
  const menuMinWidth = 105;
  const offsetLeft = unref(containerDom).getBoundingClientRect().left;
  const offsetWidth = unref(containerDom).offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 5;
  if (left > maxLeft) {
    buttonLeft.value = maxLeft;
  } else {
    buttonLeft.value = left;
  }
  buttonTop.value = e.clientY + 10;
  setTimeout(() => {
    visible.value = true;
  }, 10);
}

// 鼠标移入
function onMouseenter(item, index) {
  activeIndex.value = index;
  if (route.path !== item.path) {
    if (unref(showModel) === "smart") {
      toggleClass(true, "schedule-in", instance.refs["schedule" + index]);
      toggleClass(false, "schedule-out", instance.refs["schedule" + index]);
    } else {
      toggleClass(true, "card-in", instance.refs["dynamic" + index]);
      toggleClass(false, "card-out", instance.refs["dynamic" + index]);
    }
  }
}
// 鼠标移出
function onMouseleave(item, index) {
  activeIndex.value = -1;
  if (route.path !== item.path) {
    if (unref(showModel) === "smart") {
      toggleClass(false, "schedule-in", instance.refs["schedule" + index]);
      toggleClass(true, "schedule-out", instance.refs["schedule" + index]);
    } else {
      toggleClass(false, "card-in", instance.refs["dynamic" + index]);
      toggleClass(true, "card-out", instance.refs["dynamic" + index]);
    }
  }
}
watch(
  () => visible.value,
  val => {
    if (val) {
      document.body.addEventListener("click", closeMenu);
    } else {
      document.body.removeEventListener("click", closeMenu);
    }
  }
);
onBeforeMount(() => {
  if (!instance) return;
  relativeStorage = instance.appContext.app.config.globalProperties.$storage;
  routerArrays = relativeStorage.routesInStorage ?? routerArray;

  // 触发隐藏标签页
  emitter.on("tagViewsChange", key => {
    if (unref(showTags) === key) return;
    showTags.value = key;
  });

  // 改变标签风格
  emitter.on("tagViewsShowModel", key => {
    showModel.value = key;
  });

  //  接收侧边栏切换传递过来的参数
  emitter.on("changLayoutRoute", ({ indexPath, parentPath, item }) => {
    const hasValue = relativeStorage.routesInStorage.some((item: any) => {
      return item.path === indexPath;
    });
    if (!hasValue) {
      routerArrays.push({
        path: indexPath,
        parentPath: parentPath,
        meta: item.meta,
        name: item.name
      });
      // 缓存到localStorage
      relativeStorage.routesInStorage = routerArrays;
    }
  });
});
</script>
<style lang="scss" scoped>
@keyframes scheduleInWidth {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}
@keyframes scheduleOutWidth {
  from {
    width: 100%;
  }

  to {
    width: 0;
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }

  to {
    -moz-transform: rotate(360deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }

  to {
    -o-transform: rotate(360deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.tags-view {
  width: 100%;
  font-size: 14px;
  display: flex;
  box-shadow: 0 0 1px #888;

  .scroll-item {
    border-radius: 3px 3px 0 0;
    padding: 2px 6px;
    display: inline-block;
    position: relative;
    margin-right: 4px;
    height: 28px;
    line-height: 25px;
    transition: all 0.4s;

    .el-icon-close {
      font-size: 10px;
      color: #1890ff;
      cursor: pointer;
      transform: fontsize3s;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:hover {
        border-radius: 50%;
        color: #fff;
        background: #b4bccc;
        font-size: 10px;
      }
    }

    &.is-closable:not(:first-child) {
      &:hover {
        // padding-right: 8px;
      }
    }
  }

  a {
    text-decoration: none;
    color: #666;
    padding: 0 4px 0 4px;
  }

  .scroll-container {
    padding: 5px 0;
    white-space: nowrap;
    position: relative;
    width: 100%;
    background: #fff;

    .scroll-item {
      &:nth-child(1) {
        margin-left: 5px;
      }
    }

    .scrollbar-wrapper {
      position: absolute;
      height: 40px;
      overflow-x: hidden !important;
    }
  }

  // 右键菜单
  .contextmenu {
    margin: 0;
    background: #fff;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    color: #000000d9;
    font-weight: normal;
    font-size: 13px;
    white-space: nowrap;
    outline: 0;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);

    li {
      width: 100%;
      margin: 0;
      padding: 7px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        background: #eee;
      }

      svg {
        display: block;
        margin-right: 0.5em;
      }
    }
  }
}

.right-button {
  display: flex;
  align-items: center;
  background: #fff;
  font-size: 16px;

  li {
    width: 40px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-right: 1px solid #ccc;
    cursor: pointer;
  }
}

.is-active {
  background-color: #eaf4fe;
  position: relative;
  color: #fff;

  a {
    color: #1890ff;
  }
}

// 卡片模式
.card-active {
  border: 1px solid #1890ff;
}
// 卡片模式下鼠标移入显示蓝色边框
.card-in {
  border: 1px solid #1890ff;
  color: #1890ff;

  a {
    color: #1890ff;
  }
}
// 卡片模式下鼠标移出隐藏蓝色边框
.card-out {
  border: 1px solid #d8dce5;
  color: #666;

  a {
    color: #666;
  }
}

// 灵动模式
.schedule-active {
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
}
// 灵动模式下鼠标移入显示蓝色进度条
.schedule-in {
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  animation: scheduleInWidth 400ms ease-in;
}
// 灵动模式下鼠标移出隐藏蓝色进度条
.schedule-out {
  width: 0;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  animation: scheduleOutWidth 400ms ease-in;
}
// 刷新按钮动画效果
.refresh-button {
  -webkit-animation: rotate 600ms linear infinite;
  -moz-animation: rotate 600ms linear infinite;
  -o-animation: rotate 600ms linear infinite;
  animation: rotate 600ms linear infinite;
}
</style>
