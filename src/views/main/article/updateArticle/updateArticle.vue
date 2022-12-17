<template>
  <div class="article">
    <Aheader ref="aheader"></Aheader>
    <Toolbar style="border-bottom: 1px solid #ccc ;" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <div class="content">
      <Editor class="editor-content-view" style="min-height: 500px; overflow-y: hidden; width: 80%;" v-model="valueHtml"
        :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
      <CateLogue :headers="headers" class="catelogue"></CateLogue>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  defineComponent,
  computed,
  watch,
  nextTick
} from "vue";
import { useRoute, useRouter } from "vue-router";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IDomEditor, IEditorConfig } from "@wangeditor/editor";
import { ElMessage, ElNotification } from "element-plus";
import CateLogue from "@/components/catalogue";
import localCache from "@/utils/cache";
import Aheader from "@/components/askHeader";
import VueEvent from "@/utils/event";
import { pushlishQue, addTags, imgAdd, getArticleInfo, updataArticle } from "@/network/article/article";
import { Boot } from "@wangeditor/editor";
import markdownModule from "@wangeditor/plugin-md";

Boot.registerModule(markdownModule);

const Route = useRoute();
const Router = useRouter();
const articleId = Number(Route.params.id)
const headers = ref<any>();
/* 编辑器 */
let mode = "default";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

// 内容 HTML
let valueHtml = ref("");

onMounted(() => {
  VueEvent.on("publish", publish);

  //编辑进入后请求文章原来的内容
  getArticleInfo(Number(Route.params.id)).then(({ data }) => {
    console.log(data);
    valueHtml.value = data.content;
    aheader.value.title = data.title;
    //处理标签列表
    let tags: string[] = [];
    data.labelList.forEach((tag: any) => {
      tags.push(tag.name)
    })
    VueEvent.emit('updateValue', { outTags: tags, outSynopsis: data.synopsis })
  })
});

const toolbarConfig = {};
const editorConfig: Partial<IEditorConfig> = { placeholder: "请输入内容...", scroll: true, autoFocus: false, MENU_CONF: {} };

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
};

const handleChange = (editor: IDomEditor) => {
  headers.value = editor.getElemsByTypePrefix("header");
};
const aheader = ref<ReturnType<typeof defineComponent>>();

//更新文章
async function publish({ tags, synopsis }: any) {
  let title = computed(() => aheader.value.title);
  //提交请求文章请求
  const res = await updataArticle(articleId, title.value, valueHtml.value, synopsis, imgList).catch(
    (err) => {
      console.log(err);
    }
  );
  console.log(res);
  //提交标签请求
  if (res.code === 200) {
    const result = await addTags(articleId, tags);
    ElNotification({
      title: "更新",
      message: `更新成功！`,
      duration: 1500,
    });

    //清除本地缓存内容和valueHtml和title
    aheader.value.title = ''
    editorRef.value?.clear()
    //跳回管理文章
    Router.push({ name: 'Managearticle' })
  }
}


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
  VueEvent.off('publish', publish);
});

</script>
<style lang="less" scoped>
::v-deep(.myElmessage) {
  width: 50px;
}

.article {
  text-align: left;
  padding: 10px;

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
        background-color: #7eaef3;
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
