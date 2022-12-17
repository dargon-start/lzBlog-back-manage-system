import {IFormItem} from "@/base_ui/form/type/type";

interface IFormConfig {
  formItems: IFormItem[];
  labelWidth: string;
  colLayout: any;
}
const tableConfig = {
  title: "文章列表",
  listConfig: [
    {prop: "title", label: "标题", minWidth: "150px"},
    {
      prop: "synopsis",
      label: "简介",
      minWidth: "300px",
      slotName: "avatar_url",
    },
    {
      prop: "glanceNum",
      label: "浏览量",
      minWidth: "80px",
    },
    {
      prop: "commentNums",
      label: "评论量",
      minWidth: "80px",
      slotName:'commentNums'
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: "120px",
      slotName: "createTime",
    },
    {
      prop: "createTime",
      label: "更新时间",
      minWidth: "120px",
      slotName: "updateTime",
    },
    {prop: "option", label: "操作", minWidth: "270px", slotName: "option"},
  ],
};
const formConfig: IFormConfig = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "标题",
      placeholder: "请输入标题",
    },
  ],
  labelWidth: "100px",
  colLayout: {
    xl: 6, // >1920px 4个
    lg: 8,
    md: 12,
    sm: 12,
    xs: 24,
  },
};

export {tableConfig, formConfig};
