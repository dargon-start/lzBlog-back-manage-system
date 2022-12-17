<template>
  <div class="main">
    <el-container class="container">
      <el-aside :width="isCollapse ? '60px' : '210px'" class="aside">
        <env_menu :isCollapse="isCollapse"></env_menu>
      </el-aside>
      <el-container class="content">
        <el-header>
          <env_header @handCollapse="handCollapse"></env_header>
        </el-header>
        <el-main ref="main">
          <div class="page">
            <router-view v-slot="{Component}">
              <transition
                name="animate__animated animate__bounce"
                enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
                mode="out-in"
              >
                <component :is="Component"></component>
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import {ref, provide, onMounted} from "vue";
import env_menu from "@/components/nav_menui";
import env_header from "@/components/nav_header";
const main = ref(null);
const isCollapse = ref(false);
const handCollapse = (isfold: boolean) => {
  isCollapse.value = isfold;
};
onMounted(() => {
  console.log(main);
});
provide("eleMain", main);
</script>
<style lang="less" scoped>
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .container {
    width: 100%;
    height: 100%;
  }

  .aside {
    height: 100%;
    overflow: hidden;
    background-color: #001529;
    transition: width 0.3s linear;
  }

  .content {
    .el-header {
      height: 48px;
      background-color: #fff;
    }

    .el-main {
      position: relative;
      color: #333;
      text-align: center;
      background-color: #f0f2f5;
      .page {
        background-color: #fff;
        border-radius: 5px;
      }
    }
  }
}
</style>
