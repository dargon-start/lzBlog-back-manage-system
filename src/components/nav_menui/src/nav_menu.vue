<template>
  <div class="nav_menu">
    <div class="nav_head">
      <img class="img" src="~@/assets/image/action.gif" alt="logo" />
      <span class="title">龙仔博客系统</span>
    </div>
    <el-menu :default-active="currentMenu + ''" class="el-menu-vertical-demo" :collapse="isCollapse">
      <template v-for="(item, index) in Store.menuItems">
        <template v-if="item.routeName && item.isShow">
          <el-menu-item :index="item.index" @click="handleMenuItemClick(item)">
            <el-icon>
              <Setting />
            </el-icon>
            <template #title>{{ item.name }}</template>
          </el-menu-item>
        </template>
        <template v-else>
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon>
                <Monitor />
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="(subItem, index) in item.children">
              <el-menu-item v-if="subItem.isShow" :index="subItem.index" @click="handleMenuItemClick(subItem)">{{
                  subItem.name
              }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import {
  Monitor,
  Setting,
  ShoppingBag,
  ChatRound,
} from "@element-plus/icons-vue";
import { computed, defineProps, ref, watch } from "vue";
import { useStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import { flatMenu } from "@/utils/menuMapRoutes";
//type
interface Imenu {
  name: string;
  routeName: string;
  index: string;
}
//初始化
const router = useRouter();
const route = useRoute();
const Store = useStore();
defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});

//业务逻辑
const currentMenu = ref(1);
function getCurindex(name: string) {
  console.log(name);
  // console.log(Store.menuItems);
  const menuList = flatMenu();
  let curIndex;
  menuList.forEach((item) => {
    if (item.routeName === name) {
      curIndex = item.index;
    }
  });
  console.log(curIndex);

  return curIndex;
}

const handleMenuItemClick = (menu: Imenu) => {
  router.push({ name: menu.routeName });
};

watch(
  () => route.name,
  function () {
    currentMenu.value = getCurindex(route.name as string) || 1;
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.nav_menu {
  height: 100%;

  .nav_head {
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    overflow: hidden;

    .img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }

    .title {
      margin-left: 10px;
      color: white;
    }
  }

  .el-menu {
    border-right: 0px;

    .el-menu-item {
      background-color: #02294e;
      color: #e0e0e0;
    }

    ::v-deep(.el-sub-menu) {
      background-color: #001529;

      // 二级菜单 ( 默认背景 )
      .el-menu-item {
        padding-left: 50px;
        font-size: 14px;
        background-color: #12324f;
        color: #e0e0e0;
      }
    }

    ::v-deep(.el-sub-menu__title) {
      background-color: #02294e;
      color: #fff;
    }

    ::v-deep(.el-sub-menu__title:hover) {
      background-color: #034389;
    }

    // hover 高亮
    .el-menu-item:hover {
      color: #fff;
      // 菜单
      background-color: #034389;
    }

    .el-sub-menu:hover {
      color: #fff;
    }

    ::v-deep(.el-menu-item.is-active) {
      color: #fff !important;
      background-color: #0a60bd !important;
    }
  }
}
</style>
