<template>
  <el-card class="lz_card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="card-content">
      <slot></slot>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
defineProps<{
  title: string;
}>();
</script>
<style lang="less" scoped>
.lz_card {
  width: 100%;
  margin-top: 10px;
  .card-header {
    text-align: left;
    font-size: 20px;
    font-weight: 700;
  }
  .card-content {
  }
}
</style>
