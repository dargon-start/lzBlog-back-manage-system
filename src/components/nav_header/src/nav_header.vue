<template>
  <div class="nav_header">
    <el-icon :size="30" @click="handFold" class="icon">
      <expand v-if="isfold" />
      <fold v-if="!isfold" />
    </el-icon>
    <div class="content">
      <div class="crumbs">
        <breadCrumb :crumbItems="breadCurmb"></breadCrumb>
      </div>
      <div class="userInfo">
        <userInfo></userInfo>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Expand, Fold } from "@element-plus/icons-vue";
import { ref, defineEmits, watch } from "vue";
//引入组件
import userInfo from "./user_info.vue";
import breadCrumb from "@/base_ui/breadCrumb/src/breadCrumb.vue";
import { useStore } from "@/store";
import { routeMapBreadcrumb } from "@/utils/menuMapRoutes";
import { useRoute } from "vue-router";

interface Imenu {
  name: string;
  routeName: string;
  index: number;
}

const Store = useStore();
const route = useRoute();

const isfold = ref(false);
const emit = defineEmits(["handCollapse"]);
const handFold = () => {
  isfold.value = !isfold.value;
  emit("handCollapse", isfold.value);
};
const breadCurmb = ref<Imenu[]>([]);
watch(
  () => route.path,
  function () {
    if (route.path !== '/login') {
      console.log(route);
      breadCurmb.value = routeMapBreadcrumb(route.name as string);
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less" scoped>
.nav_header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  .icon {
    cursor: pointer;
  }

  .content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }
}
</style>
