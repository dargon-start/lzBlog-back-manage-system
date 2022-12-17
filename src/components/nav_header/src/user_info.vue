<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <!-- <span class="name">{{ name }}</span> -->
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="exitLogin">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import localCache from "@/utils/cache";
const store = useStore();
const router = useRouter();
// const name = store.state.loginModule.userInfo.name;
const exitLogin = () => {
  console.log("退出登录");
  localCache.removeCache("end_userInfo");
  router.push({ path: '/login' });
};
</script>
<style lang="less" scoped>
.el-dropdown-link {
  display: flex;
  cursor: pointer;
  align-items: center;

  .name {
    margin-right: 5px;
  }
}
</style>
