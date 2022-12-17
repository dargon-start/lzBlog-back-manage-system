<template>
  <div class="container">
    <Form :formItems="formConfig.formItems" v-model="formValue">
      <template #footer>
        <div class="operate_btn">
          <el-button type="primary" :icon="Refresh" @click="handClearForm">重置</el-button>
          <el-button type="primary" :icon="Search" @click="handSearchForm">搜索</el-button>
        </div>
      </template>
    </Form>
    <Tab class="table" v-bind="tableConfig" :pageList="pageList" v-model:page="page" :totalCount="totalCount"
      :showIndexColumn="true">
      <template #option="scope">
        <div class="option">
          <el-button type="primary" size="small" plain @click="handCommentBtn(scope.row)">查看评论</el-button>
          <el-button type="primary" size="small" :icon="Edit" plain @click="handUpdateBtn(scope.row)">编辑</el-button>
          <el-button type="primary" size="small" :icon="Delete" plain @click="handDeleteBtn(scope.row)">删除</el-button>
        </div>
      </template>
      <template #commentNums="scope">
        <span class="comment">
          {{ scope.row.commentNums }}
          <span v-if="scope.row.newCommentNums > 0" class="newComments">{{
          scope.row.newCommentNums
          }}</span>
        </span>
      </template>
    </Tab>
  </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import Tab from "@/base_ui/tab";
import Form from "@/base_ui/form";
import {Edit, Delete, Search, Refresh} from "@element-plus/icons-vue";
import {
  getArticList,
  getCount,
  deleteArticle,
  searchArticle,
} from "@/network/article/article";
import {formatUtcString} from "@/utils/formatDate";
import {tableConfig, formConfig} from "./config";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
const Router = useRouter();

const pageList = ref<any[]>();
const totalCount = ref(0);
const page = ref({currentPage: 1, pageSize: 10});
const formValue = ref<any>({});
const isSearch = ref(false);
const searchValue = ref<any>({});

function getList() {
  //获取文章列表
  getArticList(
    (page.value.currentPage - 1) * page.value.pageSize,
    page.value.pageSize
  ).then((res) => {
    res.data.list.forEach((ele: any) => {
      ele.createTime = formatUtcString(ele.createTime);
      ele.updateTime = formatUtcString(ele.updateTime);
    });
    pageList.value = res.data.list;
  });
}
// 查看评论
const handCommentBtn = (scope: any) => {
  console.log(scope);
  
  Router.push({name: "manageComment", query: {id: scope.articleId,name:scope.title}});
};

//编辑按钮
const handUpdateBtn = (scope: any) => {
  console.log(scope);

  Router.push({name: "updateArticle", params: {id: scope.articleId}});
};

//删除事件
const handDeleteBtn = (scope: any) => {
  deleteArticle(scope.articleId)
    .then((res) => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      //获取总数
      getCount().then((res) => {
        totalCount.value = res.data.articleNum;
      });
      getList();
    })
    .catch((err) => {
      ElMessage({
        type: "error",
        message: err.response.data,
      });
    });
};

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
    deep: true,
    immediate: true,
  }
);

//获取总数
getCount().then((res) => {
  totalCount.value = res.data.articleNum;
});

//搜索和重置
function search() {
  searchArticle(
    (page.value.currentPage - 1) * page.value.pageSize,
    page.value.pageSize,
    searchValue.value.title
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
    .catch((err) => {
      ElMessage({
        type: "error",
        message: "搜索失败",
      });
    });
}

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
.container {
  box-sizing: border-box;
}

.table {
  padding: 20px;

  .comment {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;

    .newComments {
      display: inline-block;
      position: absolute;
      top: 0;
      right: -3px;
      background-color: #db0e0e;
      color: #fff;
      font-size: 12px;
      padding: 0 1px;
      border-radius: 50%;
      min-width: 20px;
      min-height: 20px;
    }
  }
}

.operate_btn {
  text-align: right;
  margin: 0 40px 20px 0;
}
</style>
