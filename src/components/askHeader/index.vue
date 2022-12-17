<template>
  <div class="Aheader">
    <input
      type="text"
      class="title"
      placeholder="请输入文章标题"
      v-model="title"
      @blur="$emit('tranTitle', title)"
    />
    <div class="Hright">
      <div class="publish-box" id="publish">
        <el-button type="primary" class="submit" @click="submit" size="large"
          >发布</el-button
        >
        <el-upload
          :auto-upload="false"
          :multiple="false"
          :show-file-list="false"
          :on-change="onchange"
          style="margin-left:10px"
        >
          <template #trigger>
            <el-button type="primary"  size="large">解析md</el-button>
          </template>
        </el-upload>
        <addtag class="addtag" v-show="isactive" @cancel="cancel"></addtag>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref,defineEmits} from "vue";
import addtag from "@/components/addtag";
import VueEvent from "@/utils/event";
import {marked} from 'marked'
const emits = defineEmits(['uploadMd','tranTitle'])

const isactive = ref(false);
const title = ref("");
//点击非发布窗口时，发布窗口隐藏
document.addEventListener(
  "click",
  (e: Event) => {
    let typePanel = document.getElementById("publish");
    //如果触发事件的元素不是弹窗的子元素，那么弹窗隐藏
    //这里需要在捕获阶段触发该事件，因为内部删除标签后，触发事件的元素被删除了，
    //获取元素为null，则判断不是窗口元素的子元素，会隐藏窗口
    //在捕获阶段是可以获取到被删除的元素的。
    if (typePanel) {
      if (!typePanel.contains(e.target as Node)) {
        isactive.value = false;
      }
    }
  },
  true
);
const submit = () => {
  isactive.value = !isactive.value;
};
const cancel = () => {
  isactive.value = false;
};
VueEvent.on("publish", () => {
  isactive.value = false;
});
defineExpose({
  title,
});

// 导入md文档，进行解析

const onchange = (file:any)=>{
  console.log(file);
  let { raw } = file

  let reader = new FileReader()

  reader.readAsText(raw,"UTF-8")

  reader.onload = e => {
    console.log(e)
    let data
    if (e.target && typeof e.target.result === 'string') {
      console.log(e.target.result)
      const rawResult = e.target.result;
      let mdRes =  marked(rawResult)
      console.log(mdRes);
      emits('uploadMd',mdRes)
      // 把 Array Buffer 转化为 blob
    } else console.error('获取文件 blob 错误')
  }
}

</script>
<style lang="less" scoped>
.Aheader {
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .title {
    width: 70%;
    height: 100%;
    padding: 0;
    font-size: 25px;
    font-weight: 700px;
    outline: none;
    border: 0px;
    overflow: visible;
  }
  .Hright {
    display: flex;
    justify-items: space-between;
    align-items: center;
    .publish-box {
      display: flex;
      position: relative;
      // .submit ,.upload {
      //   width: 90px;
      //   height: 40px;
      //   margin-right: 50px;
      // }

      .addtag {
        position: absolute;
        z-index: 1501;
        left: -350px;
        top: 60px;
      }
    }

    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
    .userName {
      margin-left: 15px;
    }
  }
}
</style>
