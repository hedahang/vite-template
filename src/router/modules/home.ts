import Layout from "/@/layout/index.vue";

const homeRouter = {
  path: "/",
  name: "home",
  component: Layout,
  redirect: "/home",
  meta: {
    icon: "HomeFilled",
    showLink: true,
    rank: 0
  },
  children: [
    {
      path: "/home",
      name: "home",
      component: () => import("/@/views/home.vue"),
      meta: {
        title: "首页",
        showLink: true
      }
    }
  ]
};

export default homeRouter;
