<template>
  <div class="container">
    <div>
      <h3 class="header">{{article.name}}</h3>
      <div class="operation">
        <el-button :disabled="isAble" @click="deleteCom">删除</el-button>
      </div>
      <div class="comment">
        <Tab class="table" v-bind="tableConfig" :pageList="pageList" v-model:page="page" :totalCount="totalCount"
          :showSelectColumn="true" @selectVal="selectChange">
          <template #comment="{row}">
            <div class="comment_item">
              <div class="userInfo">
                <span>{{row.user.name}}</span>
                <span v-if="row.parentComment">
                  <span class="huifu">回复</span>
                  <span>{{row.parentComment.pname}}</span>
                </span>

              </div>
              <div class="content" v-html="row.content"></div>
              <div class="replyContent" v-if="row.parentComment" v-html="row.parentComment.content"></div>
              <div class="date">{{formatUtcString(row.createAt)}}</div>
            </div>
          </template>
        </Tab>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import {ref, watch} from "vue";
import Tab from "@/base_ui/tab";
import {
  getCommentList,
  deleteComment
} from "@/network/article/article";
import {tableConfig} from "./config";
import {formatUtcString} from '@/utils/formatDate';
import {ElMessage} from "element-plus";

const Route = useRoute();
const article = Route.query;
const page = ref({currentPage: 1, pageSize: 5});
const totalCount = ref(0)
const pageList = ref();

const isAble = ref(true);

function getComment(){
  getCommentList(Number(article.id) ,
              (page.value.currentPage - 1) * page.value.pageSize,
              page.value.pageSize).then(res=>{
                console.log(res);
                pageList.value = res.data.data;
                totalCount.value = res.data.total;
              })
}

watch(
  page,
  () => {
    getComment()
  },
  {
    deep: true,
    immediate: true,
  }
);

// 获取勾选的评论
let selectComment = ref<number[]>();
function selectChange(value:any){
  isAble.value = value.length > 0 ? false : true;
  selectComment.value = value.map((item:any)=>{
    return item.id
  })
}

// 删除评论
async function deleteCom(){
  console.log(selectComment);
  if(selectComment.value){
    await deleteComment(selectComment.value)
    ElMessage({
        type: "success",
        message: "删除成功",
      });
    getComment()
  }
}

</script>
<style lang="less" scoped>
ul li {
  list-style: none;
}

.container {
  box-sizing: border-box;
  text-align: left;
  padding: 10px;

  .header {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  .comment_item {
    text-align: left;
    margin-left: 20px;
    overflow: hidden;

    .userInfo {
      color: #757575;

      .huifu {

        margin: 0 7px;
        color: #00a1d6;
      }
    }

    .content {
      margin-left: 2em;
    }

    .replyContent {
      margin-left: 2em;
      padding: 1px 2em;
      background-color: #e0e0e0;
      border-radius: 5px;
    }

    .date {
      color: #757575;
    }
  }
}
</style>
