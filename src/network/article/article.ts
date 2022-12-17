import {Search} from "@element-plus/icons-vue";
import lzRequest from "../request";
import {IDataType} from "../type";
//获取文章列表
export function getArticList(offset: number, size: number) {
  return lzRequest.get<IDataType<any>>({
    url: `/article/backList`,
    params: {
      offset,
      size,
    },
  });
}

//根据标签获取文章
export function getArticListBylabel(
  offset: number,
  size: number,
  labelName?: string
) {
  return lzRequest.get<IDataType<any>>({
    url: `/label/article`,
    params: {
      offset,
      size,
      labelName,
    },
  });
}

//获取文章详情
export function getArticleInfo(aId: number) {
  return lzRequest.get<IDataType<any>>({
    url: `/article/${aId}`,
  });
}

//发布文章
export function pushlishQue(
  title: string,
  content: string,
  synopsis: string,
  imgList: string[]
) {
  return lzRequest.post({
    url: "/article",
    data: {title, synopsis, content, imgList},
  });
}

//更新文章
export function updataArticle(
  id: number,
  title: string,
  content: string,
  synopsis: string,
  imgList: string[]
) {
  return lzRequest.patch({
    url: `/article/${id}`,
    data: {title, synopsis, content, imgList},
  });
}

//给文章添加标签
export function addTags(articleId: number, labels: []) {
  return lzRequest.post({
    url: `/article/${articleId}/labels`,
    data: {labels},
  });
}

//上传图片
export function imgAdd(formdata: any) {
  return lzRequest.post({
    url: "/upload/picture",
    data: formdata,
    headers: {"Content-Type": "multipart/form-data"},
  });
}

export function getCount() {
  return lzRequest.get({
    url: "/article/amount",
  });
}

//删除文章
export function deleteArticle(AId: number) {
  return lzRequest.delete({
    url: `/article/${AId}`,
  });
}
//搜索文章
export function searchArticle(offset: number, size: number, keyword: string) {
  return lzRequest.get({
    url: "/article/search",
    params: {
      offset,
      size,
      keyword,
    },
  });
}

// 获取文章评论
export function getCommentList(
  articleId: number,
  offset: number,
  size: number
) {
  return lzRequest.get({
    url: "/comment/back",
    params: {
      articleId,
      offset,
      size,
    },
  });
}

// 删除评论
export function deleteComment(commentIds: number[]) {
  return lzRequest.delete({
    url: "/comment",
    data: {
      commentIds,
    },
  });
}
