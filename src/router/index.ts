import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import localCache from "@/utils/cache";
// import { firstmenu } from "@/utils/menuMapRoutes";
const Login = () => import("@/views/login/login.vue");
const Main = () => import("@/views/main/main.vue");
const User = () => import("@/views/main/user/user.vue");
const ManageArticle = () =>
  import("@/views/main/article/manageArticle/manageArticle.vue");
const AddArticle = () =>
  import("@/views/main/article/addArticle/addArticle.vue");

const updateArticle = () =>
  import("@/views/main/article/updateArticle/updateArticle.vue");
const Website = () => import("@/views/main/website/website.vue");
const notFount = () => import("@/views/not_found/not_found.vue");
const ManageComment = () => import("@/views/main/article/manageComment/manageComment.vue");
const Tool = () => import('@/views/main/tool/tool.vue')

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/main/user",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
    children: [
      {
        path: "",
        redirect: "/main/user",
      },
      {
        path: "user",
        name: "user",
        component: User,
      },
      {
        path: "article/Managearticle",
        name: "Managearticle",
        component: ManageArticle,
      },
      {
        path: "article/addarticle",
        name: "addarticle",
        component: AddArticle,
      },
      {
        path: "article/updateArticle/:id",
        name: "updateArticle",
        component: updateArticle,
      },
      {
        path: "comment/manageComment",
        name: "manageComment",
        component: ManageComment,
      },
      {
        path: "website",
        name: "website",
        component: Website,
      },
      {
        path: "tool",
        name: "tool",
        component: Tool,
      }
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFount",
    component: notFount,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (to.path !== "/login") {
    const token = localCache.getCache("end_userInfo");
    if (!token) {
      console.log("没有token");
      return "/login";
    }
  }
});

export default router;
