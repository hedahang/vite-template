// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const permissionRouter = {
  path: "/permission",
  name: "permission",
  redirect: "/permission/page",
  component: "Layout",
  meta: {
    title: "权限管理",
    icon: "Lollipop",
    showLink: true,
    rank: 3
  },
  children: [
    {
      path: "/permission/page",
      name: "permissionPage",
      component: "/permission/page",
      meta: {
        title: "页面权限",
        showLink: true
      }
    },
    {
      path: "/permission/button",
      name: "permissionButton",
      component: "/permission/button",
      meta: {
        title: "按钮权限",
        showLink: true,
        authority: []
      }
    }
  ]
};

// 添加不同按钮权限到/permission/button页面中
function setDifAuthority(authority, routes) {
  routes.children[1].meta.authority = [authority];
  return routes;
}

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: ({ query }) => {
      if (query.name === "admin") {
        return {
          code: 0,
          info: [
            setDifAuthority("v-admin", permissionRouter),
            {
              path: "/test",
              component: "Layout",
              name: "test",
              redirect: "/test/index",
              meta: {
                title: "",
                icon: "Lollipop",
                showLink: true,
                rank: 2
              },
              children: [
                {
                  path: "/test/index",
                  name: "testIndex",
                  component: "/test",
                  meta: {
                    title: "测试主页",
                    showLink: true,
                    keepAlive: true,
                    extraIcon: {
                      svg: true,
                      name: "team-iconxinpin"
                    }
                  }
                }
              ]
            }
          ]
        };
      } else {
        return {
          code: 0,
          info: [setDifAuthority("v-test", permissionRouter)]
        };
      }
    }
  }
] as MockMethod[];
