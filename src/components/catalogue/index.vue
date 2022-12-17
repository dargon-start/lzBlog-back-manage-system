<template>
  <div style="" class="editor_menu">
    <h4 class="title">大纲</h4>
    <ul class="header-container" ref="headerList">
      <li v-for="(item, index) in headers" @click="handScroll" :id="item.id" :type="item.type" class="cata_list"
        :class="{ active: activeTitle === item.id }">
        {{ item.children[0].text }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, withDefaults, watch, inject, onMounted } from "vue";
const props = withDefaults(
  defineProps<{
    headers: any;
  }>(),
  {}
);
let handScroll: any = ref(null);
onMounted(() => {
  const eleMain = inject<any>("eleMain").value.$el; //获取到dom元素
  //点击事件
  handScroll.value = (event: any) => {
    if (event) {
      if (event.target.tagName !== "LI") return;
      event.preventDefault();
      const id = event.target!.id;
      activeTitle.value = id;
      // 滚动到标题
      console.log(id);
      const curHead = document.querySelector<HTMLElement>(`#${id}`);
      //获取元素的位置信息
      function getRect(ele: HTMLElement) {
        const params = ele.offsetTop;
        console.log(params);

        eleMain.scrollTo(0, params + 50);
      }
      curHead && getRect(curHead);
    }
  };
  let scrollTimer: any;
  //监听滚轮的滚动事件
  eleMain.addEventListener("scroll", function (e: any) {
    clearInterval(scrollTimer);
    scrollTimer = setTimeout(() => {
      const list = document.querySelectorAll<HTMLElement>(`.cata_list`);

      for (let i = 0; i < list.length; i++) {
        const curHead = document.querySelector<HTMLElement>(`#${list[i].id}`);

        if (curHead!.offsetTop + 0 > eleMain.scrollTop && i > 0) {
          activeTitle.value = list[i - 1].id;
          console.log(activeTitle.value);

          break;
        }
      }
    }, 100);
  });
});
//当前标题
const activeTitle = ref("");
watch(
  () => props.headers,
  () => {
    if (props.headers.length) {
      activeTitle.value = props.headers[0].id;
    }
  }
);
</script>
<style lang="less" scoped>
li {
  list-style-type: none;
}

.editor_menu {
  width: 170px;
  padding: 10px;

  .title {
    text-align: center;
  }

  .header-container {
    overflow-y: scroll;
    max-height: 400px;

    /* 设置垂直滚动条的宽度和水平滚动条的高度 */
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }

    /* 设置滚动条的滑轨 */
    &::-webkit-scrollbar-track {
      background-color: #ddd;
    }

    /* 滑块 */
    &::-webkit-scrollbar-thumb {
      background-color: #0080ff;
      border-radius: 4px;
    }

    /* 滑轨两头的监听按钮 */
    &::-webkit-scrollbar-button {
      background-color: #888;
      display: none;
    }

    /* 横向滚动条和纵向滚动条相交处尖角 */
    &::-webkit-scrollbar-corner {
      background-color: black;
    }

    .cata_list {
      width: 100%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
      border-left: 2px solid #e0e0e0;
      padding: 10px 10px 10px 5px;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: #0080ff;
      }

      &[type="header1"] {
        padding-left: 5px;
        font-size: 18px;
      }

      &[type="header2"] {
        padding-left: 15px !important;
        font-size: 16px;
      }

      &[type="header3"] {
        padding-left: 30px !important;
        font-size: 15px;
      }

      &[type="header4"] {
        padding-left: 45px !important;
        font-size: 12px;
      }

      &[type="header5"] {
        padding-left: 60px !important;
        font-size: 10px;
      }
    }

    .active {
      color: #0080ff;
      border-left: 2px solid #0080ff;
    }
  }
}
</style>
