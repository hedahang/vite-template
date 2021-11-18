import {
  Router,
  createRouter,
  RouteComponent,
  createWebHashHistory
} from "vue-router";

// 静态路由
import homeRouter from "./modules/home";
import remainingRouter from "./modules/remaining";

const constantRoutes: Array<RouteComponent> = [homeRouter];

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = arr => {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
};

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

export default router;
