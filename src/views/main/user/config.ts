import {IFormItem} from "@/base_ui/form/type/type";

interface IFormConfig {
  formItems: IFormItem[];
  labelWidth: string;
  colLayout: any;
}
const tableConfig = {
  title: "用户列表",
  showIndexColumn: true,
  listConfig: [
    {prop: "id", label: "ID", minWidth: "100px"},
    {prop: "name", label: "邮箱", minWidth: "100px"},
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: "150px",
      slotName: "createAt",
    },
    {
      prop: "status",
      label: "状态",
      minWidth: "150px",
      slotName: "status",
    },
    {prop: "option", label: "操作", minWidth: "100px", slotName: "option"},
  ],
};
const formConfig: IFormConfig = {
  formItems: [
    {
      field: "status",
      type: "select",
      label: "状态",
      placeholder: "请输入用户状态",
      options: [
        {title: "已注册", value: 1},
        {title: "未注册", value: 0},
      ],
    },
    {
      field: "createTime",
      type: "datepicker",
      label: "创建时间",
      otherOptions: {
        isRange: true,
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        type: "daterange",
      },
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
