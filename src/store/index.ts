import {defineStore} from "pinia";
import localCache from "@/utils/cache";
export const useStore = defineStore("main", {
  state: () => {
    return {
      menuItems: [
        {
          name: "用户管理",
          routeName: "user",
          index: "1",
          breadCrumb: [{name: "用户管理"}],
          isShow: true,
        },
        {
          name: "文章管理",
          index: "2",
          isShow: true,
          children: [
            {
              name: "发布文章",
              routeName: "addarticle",
              index: "2-1",
              breadCrumb: [{name: "文章管理"}, {name: "发布文章"}],
              isShow: true,
            },
            {
              name: "管理文章",
              routeName: "Managearticle",
              index: "2-2",
              breadCrumb: [{name: "文章管理"}, {name: "管理文章"}],
              isShow: true,
            },
            {
              name: "更新文章",
              routeName: "updateArticle",
              index: "2-3",
              breadCrumb: [
                {name: "文章管理"},
                {name: "管理文章", routeName: "Managearticle"},
                {name: "更新文章"},
              ],
              isShow: false,
            },
            {
              name: "评论管理",
              routeName: "manageComment",
              index: "2-4",
              breadCrumb: [
                {name: "文章管理"},
                {name: "管理文章", routeName: "Managearticle"},
                {name: "评论管理"},
              ],
              // 是否在左侧导航页
              isShow: false, 
            }
          ],
        },
        {
          name: "工具管理",
          routeName: "tool",
          index: "3",
          breadCrumb: [{name: "工具管理"}],
          isShow: true,
        },
      ],
      userInfo: null,
    };
  },
  actions: {
    updateUserinfo() {
      if (localCache.getCache("end_userInfo")) {
        this.userInfo = localCache.getCache("end_userInfo");
      } else {
        this.userInfo = null;
      }
    },
  },
});

() => <any>{};
