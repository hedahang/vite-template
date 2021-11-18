import {
  Router,
  createRouter,
  RouteComponent,
  createWebHashHistory
} from "vue-router";
import { usePermissionStoreHook } from "/@/store/modules/permission";

// Layout组件
import Layout from "/@/layout/index.vue";
// 静态路由
import homeRouter from "./modules/home";
import remainingRouter from "./modules/remaining";
// 动态路由
import { getAsyncRoutes } from "/@/api/routes";

const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");

const constantRoutes: Array<RouteComponent> = [homeRouter];

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = arr => {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
};

// 将所有静态路由导出
export const constantRoutesArr: Array<RouteComponent> = ascending(
  constantRoutes
).concat(...remainingRouter);

// 过滤meta中showLink为false的路由
export const filterTree = data => {
  const newTree = data.filter(v => v.meta.showLink);
  newTree.forEach(v => v.children && (v.children = filterTree(v.children)));
  return newTree;
};

// 创建路由实例
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: filterTree(ascending(constantRoutes)).concat([...remainingRouter]),
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

// 初始化路由
export const initRouter = name => {
  return new Promise(resolve => {
    getAsyncRoutes({ name }).then(({ info }) => {
      if (info.length === 0) {
        usePermissionStoreHook().changeSetting(info);
      } else {
        addAsyncRoutes(info).map((v: any) => {
          // 防止重复添加路由
          if (
            router.options.routes.findIndex(value => value.path === v.path) !==
            -1
          ) {
            return;
          } else {
            // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
            router.options.routes.push(v);
            // 最终路由进行升序
            ascending(router.options.routes);
            router.addRoute(v.name, v);
            usePermissionStoreHook().changeSetting(info);
          }
          resolve(router);
        });
      }
      router.addRoute({
        path: "/:pathMatch(.*)",
        redirect: "/error/404"
      });
    });
  });
};

// 过滤后端传来的动态路由 重新生成规范路由
export const addAsyncRoutes = (arrRoutes: Array<RouteComponent>) => {
  if (!arrRoutes || !arrRoutes.length) return;
  arrRoutes.forEach((v: any) => {
    if (v.redirect) {
      v.component = Layout;
    } else {
      v.component = modulesRoutes[`/src/views${v.path}/index.vue`];
    }
    if (v.children) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
};

export default router;
