<template>
  <div>
    <el-descriptions class="margin-top" :title="title" :column="1" border>
      <template v-for="item in desData" :key="item.name">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">{{ item.name }}</div>
          </template>
          <el-tag size="small">{{ item.description }}</el-tag>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults } from "vue";
withDefaults(
  defineProps<{
    title: string;
    desData: any[];
  }>(),
  {
    title: "",
    desData: () => []
  }
);
</script>
<style lang="less" scoped>
.cell-item {
  color: #5b5858;
}
</style>
