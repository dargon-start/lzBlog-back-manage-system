<template>
  <div class="text-link">
    <template v-for="item in linkList" :key="item.name">
      <div class="item">
        <span class="title">{{ item.title }}：</span>
        <el-link type="primary">{{ item.desp }}</el-link>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults } from "vue";
const props = withDefaults(
  defineProps<{
    linkList: any[];
  }>(),
  {
    linkList: () => []
  }
);
</script>
<style lang="less" scoped>
.text-link {
  .item {
    margin: 10px 15px;
    .title {
      position: relative;
      display: inline-block;
      margin-right: 20px;
    }
    .title::before {
      position: absolute;
      top: 40%;
      left: -15px;
      width: 5px;
      height: 5px;
      background: black;
      border-radius: 100%;
      content: "";
    }
  }
}
</style>
