<template>
  <div class="article">
    <Aheader ref="aheader" @uploadMd="uploadMd"></Aheader>
    <Toolbar class="toolbar" style="border-bottom: 1px solid #ccc ;" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <div class="content">
      <Editor class="editor-content-view" style="min-height: 300px; overflow-y: hidden; width: 80%;" v-model="valueHtml"
        :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
      <!-- <CateLogue :headers="headers" class="catelogue"></CateLogue> -->
      <Catalogue v-if="isShow" :headers="headers" :scrollToFirstHeader="0" :clickDistance="50" :scrollContinerDom="eleMain"  class="catelogue" ></Catalogue>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Catalogue from 'wangeditor-catalogue';
import 'wangeditor-catalogue/css';

import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IDomEditor, IEditorConfig } from "@wangeditor/editor";
import { ElMain, ElMessage, ElNotification } from "element-plus";
// import CateLogue from "@/components/catalogue";
import localCache from "@/utils/cache";

import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  defineComponent,
  computed,
  watch,
  nextTick,
  inject
} from "vue";

import Aheader from "@/components/askHeader";
import VueEvent from "@/utils/event";
import { pushlishQue, addTags, imgAdd } from "@/network/article/article";
import { Boot } from "@wangeditor/editor";
import markdownModule from "@wangeditor/plugin-md";


const eleMain = ref() //获取到dom元素
const isShow = ref(false);

Boot.registerModule(markdownModule);

const headers = ref<any>();
/* 编辑器 */
let mode = "default";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

// 内容 HTML
let valueHtml = ref("");

onMounted(() => {
  eleMain.value = inject<any>("eleMain").value.$el;
  isShow.value = true;

  VueEvent.on("publish", publish);
  //初始化valueHtml,查看是否由之前缓存的内容
  //必须在下一队列中渲染数据
  nextTick(function () {
    const cacheValue = localCache.getCache('articleValue');
    if (cacheValue) {
      valueHtml.value = cacheValue;
    }
  });
});

const toolbarConfig = {};
const editorConfig: Partial<IEditorConfig> = { placeholder: "请输入内容...", scroll: true, autoFocus: false, MENU_CONF: {} };
editorConfig.hoverbarKeys = {
    text:{
      menuKeys:[
          "headerSelect",
          "insertLink",
          "bulletedList",
          "numberedList",
          "blockquote",
          "|",
          "bold",
          "through",
          "color",
          "bgColor",
          "clearStyle"
      ]
    }
}
//携带token
const userInfo = localCache.getCache("end_userInfo");
const imgList: string[] = [];
userInfo && editorConfig.MENU_CONF && (editorConfig.MENU_CONF['uploadImage'] = {
  // 上传图片的配置
  fieldName: 'picture',
  maxNumberOfFiles: 100,
  server: import.meta.env.VITE_APP_IMG_URL,
  headers: {
    Authorization: `Bearer ${userInfo.token}`
  },
  // 单个文件上传成功之后
  onSuccess(file: File, res: any) {
    console.log(`${file.name} 上传成功`, res)
    imgList.push(res.data.alt)
  },
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  console.log( editor.getAllMenuKeys());
};

let cacheTimer: any = null;
const handleChange = (editor: IDomEditor) => {
  console.log('change');

  headers.value = editor.getElemsByTypePrefix("header");
  clearInterval(cacheTimer);
  //四秒之后没有编译自动保存本地
  cacheTimer = setTimeout(() => {
    localCache.setCache('articleValue', valueHtml.value);
    ElMessage({
      message: '自动保存成功！',
      type: 'success',
      duration: 1500,
      customClass: 'myElmessage'
    })
  }, 4000);
};
const aheader = ref<ReturnType<typeof defineComponent>>();

//发布文章
async function publish({ tags, synopsis }: any) {
  let title = computed(() => aheader.value.title);
  //提交请求文章请求
  const res = await pushlishQue(title.value, valueHtml.value, synopsis, imgList).catch(
    (err) => {
      console.log(err);
    }
  );
  console.log(res);
  //提交标签请求
  if (res.code === 200) {
    const result = await addTags(res.articleId, tags);
    ElNotification({
      title: "发布",
      message: `发布成功,问题ID:${res.articleId}`,
      duration: 1500,
    });

    //清除本地缓存内容和valueHtml和title
    aheader.value.title = ''
    editorRef.value?.clear()
    localCache.removeCache('articleValue');
  }

}


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
  VueEvent.off('publish', publish);
  clearTimeout(cacheTimer);
  //销毁之前保存编辑的文章
  localCache.setCache('articleValue', valueHtml.value);
});

 const uploadMd = (mdres:string)=>{
    valueHtml.value = mdres;
 }

</script>
<style lang="less" scoped>
::v-deep(.myElmessage) {
  width: 50px;
}

.article {
  text-align: left;
  padding: 10px;
  .toolbar{
    position: sticky;
    top: -20px;
    z-index: 1500;
  }
  .content {
    display: flex;

    ::v-deep(.editor-content-view) {
      padding: 0 10px;
      margin-top: 20px;
      overflow-x: auto;

      p,
      li {
        white-space: pre-wrap;
      }

      blockquote {
        border-left: 8px solid #d0e5f2;
        padding: 10px 10px;
        margin: 10px 0;
        background-color: #f1f1f1;
      }

      code {
        font-family: monospace;
        font-size: 16px;
        background-color: #eaf2ff;
        padding: 3px;
        border-radius: 3px;
      }

      pre>code {
        display: block;
        font-family: monospace;
        padding: 10px;
        border-radius: 10px;
        background-color: #f8f8f8;
      }

      td,
      th {
        border: 1px solid #ccc;
        min-width: 50px;
        height: 20px;
      }

      th {
        background-color: #4e96e7;
      }

      ul,
      ol {
        padding-left: 20px;
      }

      input[type="checkbox"] {
        margin-right: 5px;
      }

      .w-e-image-container {
        width: 95% !important;
      }

      .table-container {
        border: none;
      }
    }

    .catelogue {
      position: fixed;
      right: 3%;
      top: 220px;
    }
  }
}
</style>
