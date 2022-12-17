<template>
  <div class="bread">
    <el-breadcrumb separator="/">
      <template v-for="item in crumbItems" :key="item">
        <template v-if="item.routeName">
          <el-breadcrumb-item :to="{ name: item.routeName }">{{ item.name }}</el-breadcrumb-item>
        </template>
        <template v-else>
          <el-breadcrumb-item>{{ item.name }}</el-breadcrumb-item>
        </template>
      </template>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, PropType } from "vue";
import { IcrumbType } from "../type/index";
defineProps({
  crumbItems: Array as PropType<IcrumbType[]>,
});
</script>
<style lang="less" scoped>
</style>
