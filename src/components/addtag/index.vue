<template>
  <div class="panel">
    <div class="triangle"></div>

    <div class="title">发布文章</div>
    <div class="tags">
      <div class="tip">文章标签：</div>
      <div class="addtag">
        <el-input type="text" class="tagInput" placeholder="请输入文章标签，回车添加" @keyup.enter="addtag" v-model="inputTag" />
      </div>
      <div class="err" v-if="isshow">{{ error }}</div>
      <div class="tags-list">
        <span class="tag" v-for="(tag, index) in tags" :key="index" ref="tag">{{ tag }} <i @click="removeTag(index)"
            class="removeTag">×</i></span>
      </div>
      <div class="tip">编辑摘要：</div>
      <el-input v-model="synopsis" rows="6" placeholder="请输入文章摘要~" type="textarea" class="synopisi" />
    </div>
    <div class="bottom">
      <el-button @click.stop="$emit('cancel')" class="cancel">取消</el-button>
      <el-button type="primary" class="las-submit" @click="publish">发布</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import VueEvent from "@/utils/event";
const tags = ref<string[]>([]);
const synopsis = ref("");
const inputTag = ref("");
const error = ref("最多只能添加5个标签哦");
const isshow = ref(false);
function addtag() {
  //查重
  if (tags.value.indexOf(inputTag.value) == -1) {
    if (tags.value.length < 5) {
      tags.value.push(inputTag.value);
    } else {
      isshow.value = true;
    }
  }
  inputTag.value = "";
}
function removeTag(index: number) {
  console.log(index);
  tags.value.splice(index, 1);
  if (tags.value.length < 5) {
    isshow.value = false;
  }
}

function publish() {
  VueEvent.emit("publish", { tags: tags.value, synopsis: synopsis.value });
  tags.value = [];
  synopsis.value = "";
}

//监听数据进行回显
VueEvent.on('updateValue', ({ outTags, outSynopsis }: any) => {
  tags.value = outTags;
  synopsis.value = outSynopsis;
})
</script>
<style lang="less" scoped>
.panel {
  position: relative;
  width: 500px;
  height: 450px;
  background-color: #fff;
  box-shadow: 2px 2px 10px #e0e0e0e0;
  .triangle {
    position: absolute;
    z-index: 1502;
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    background: #fff;
    top: -10px;
    right: 100px;
    border-right: none;
    border-bottom: none;
    transform: rotate(45deg);
  }

  .title {
    box-sizing: border-box;
    height: 60px;
    font-size: 20px;
    font-weight: 700;
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    padding-left: 10px;
  }

  .tags {
    margin-top: 10px;
    width: 100%;
    height: 60px;
    // border-bottom: 1px solid #ddd;

    .tip {
      font-size: 14px;
      color: #b6aaaa;
      margin: 10px 40px;
    }

    .addtag {
      width: 90%;
      height: 35px;
      margin: 0 auto;
      box-sizing: border-box;
      align-items: center;
    }

    .synopisi {
      width: 90%;
      margin: 0px 5%;
    }

    .err {
      font-size: 12px;
      color: red;
      margin: 5px 40px;
    }

    .tags-list {
      height: 25px;
      margin: 6px 20px;

      .tag {
        cursor: pointer;
        display: inline-block;
        background: #409eff;
        color: #fff;
        border-radius: 5px;
        margin: 3px;
        padding: 3px;

        .removeTag {
          color: #fff;
          padding: 2px;
        }
      }
    }
  }

  .bottom {
    display: flex;
    position: absolute;
    width: 100%;
    height: 60px;
    border-top: 1px solid #ddd;
    bottom: 10px;
    justify-content: center;
    align-items: center;

    .cancel {
      margin-left: 240px;
    }

    .las-submit {
      margin-left: 30px;
    }
  }
}
</style>
