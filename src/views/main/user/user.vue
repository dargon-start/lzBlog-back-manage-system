<template>
  <div>
    <Form :formItems="formConfig.formItems" v-model="formValue">
      <template #footer>
        <div class="operate_btn">
          <el-button type="primary" :icon="Refresh" @click="handClearForm">重置</el-button>
          <el-button type="primary" :icon="Search" @click="handSearchForm">搜索</el-button>
        </div>
      </template>
    </Form>
    <Tab class="table" v-bind="tableConfig" :pageList="pageList" :totalCount="totalCount" v-model:page="page">
      <template #status="scope">
        <template v-if="scope.row.status">
          <el-button type="primary" size="small" text>已注册</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" text>未注册</el-button>
        </template>
      </template>
      <template #option="scope">
        <div class="option">
          <el-button type="primary" size="small" :icon="Delete" plain @click="handDeleteBtn(scope.row)">删除</el-button>
        </div>
      </template>
    </Tab>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import Tab from "@/base_ui/tab";
import Form from "@/base_ui/form";
import { Edit, Delete, Search, Refresh } from "@element-plus/icons-vue";
import { tableConfig, formConfig } from "./config";
import { deleteUser, getUserList, searchUser } from "@/network/user/user";
import { ElMessage } from "element-plus";
import { formatUtcString } from "@/utils/formatDate";
const pageList = ref([]);
const page = ref({ currentPage: 1, pageSize: 10 });
const totalCount = ref(0);
const formValue = ref<any>({});
const isSearch = ref(false);
const searchValue = ref<any>({});
function getList() {
  getUserList(
    (page.value.currentPage - 1) * page.value.pageSize,
    page.value.pageSize
  )
    .then((res) => {
      console.log(res);
      res.data.list.forEach((ele: any) => {
        ele.createTime = formatUtcString(ele.createTime);
        ele.updateTime = formatUtcString(ele.updateTime);
      });
      pageList.value = res.data.list;
      totalCount.value = res.data.total;
    })
    // .catch((err) => {
    //   ElMessage({
    //     type: "error",
    //     message: err.response.data,
    //   });
    // });
}

watch(
  page,
  () => {
    if (isSearch.value) {
      search();
    } else {
      getList();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

//删除按钮
const handDeleteBtn = (scope: any) => {
  console.log(scope);
  deleteUser(scope.id)
    .then((res) => {
      getList();
      ElMessage({
        type: "success",
        message: res.msg,
      });
    })
    .catch((err) => {
      ElMessage({
        type: "success",
        message: err.response.data,
      });
    });
};
//搜索
function search() {
  searchUser(
    searchValue.value?.status,
    searchValue.value?.createTime,
    (page.value.currentPage - 1) * page.value.pageSize,
    page.value.pageSize
  ).then((res) => {
    res.data.list.forEach((ele: any) => {
      ele.createTime = formatUtcString(ele.createTime);
      ele.updateTime = formatUtcString(ele.updateTime);
    });
    pageList.value = res.data.list;
    totalCount.value = res.data.total;
  });
}

//搜索和重置

const handSearchForm = () => {
  page.value.currentPage = 1;
  isSearch.value = true;
  searchValue.value = formValue.value;
  search();
};

const handClearForm = () => {
  page.value.currentPage = 1;
  isSearch.value = false;
  formValue.value = {};
  searchValue.value = {};
  search();
};
</script>
<style lang="less" scoped>
.table {
  padding: 20px;
}

.operate_btn {
  text-align: right;
  margin: 0 40px 20px 0;
}
</style>
