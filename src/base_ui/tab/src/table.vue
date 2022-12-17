<template>
  <div class="show-List">
    <div class="header">
      <h3>{{ title }}</h3>
      <slot name="header"> </slot>
    </div>
    <el-table :data="pageList" border @selection-change="handleSelectionChange" v-bind="childrenProps">
      <el-table-column v-if="showSelectColumn" type="selection" label="选中" align="center" />
      <el-table-column v-if="showIndexColumn" type="index" :index="indexMethod" label="序号" align="center" />
      <template v-for="item in listConfig" :key="item.prop">
        <el-table-column v-bind="item" align="center" show-overflow-tooltip>
          <template #default="scope">
            <slot :name="item.slotName" :row="scope.row">
              {{ scope.row[item.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.currentPage" :page-sizes="[5, 10, 20]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {defineProps, PropType, defineEmits, withDefaults} from "vue";
import {IlistConfig} from "../type/type";
const props = withDefaults(
  defineProps<{
    showSelectColumn?: boolean;
    showIndexColumn?: boolean;
    pageList: any;
    listConfig: IlistConfig[];
    totalCount?: number;
    page?: {currentPage: number; pageSize: number};
    title?: any;
    childrenProps?: {};
  }>(),
  {
    showSelectColumn: false,
    showIndexColumn: false,
    listConfig: () => [],
    page: () => ({currentPage: 1, pageSize: 10}),
    title: "列表",
    totalCount: 20,
  }
);
const emit = defineEmits(["selectVal", "update:page", "handleCurrentChange"]);
const handleSelectionChange = (val: any) => {
  emit("selectVal", val);
};

//序号
const indexMethod = (index: number) => {
  return (props.page.currentPage - 1) * props.page.pageSize + index + 1;
};

const handleSizeChange = (pageSize: number) => {
  console.log("size");
  emit("update:page", {...props.page, pageSize});
};
const handleCurrentChange = (currentPage: number) => {
  console.log("current");
  emit("update:page", {...props.page, currentPage});
};
</script>
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.footer {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}

.option {
  text-align: center;
}
</style>
