<template>
  <div class="lz_form">
    <!-- 预留顶部插槽 -->
    <div>
      <slot name="header"></slot>
    </div>
    <!-- 表单部分 -->
    <el-form :label-width="labelWidth" @submit.prevent>
      <el-row>
        <template v-for="item in formItems" :key="item.label">
          <el-col v-bind="colLayout">
            <el-form-item :label="item.label" :style="itemStyle" :rules="item.rules" v-if="!item.isHidden">
              <!-- input -->
              <template v-if="item.type == 'input' || item.type == 'password'">
                <el-input :placeholder="item.placeholder" v-bind="item.otherOptions"
                  :show-password="item.type === 'password'" :model-value="modelValue[`${item.field}`]"
                  @update:modelValue="handleValueChange($event, item.field)"></el-input>
              </template>
              <!-- select-->
              <template v-else-if="item.type == 'select'">
                <el-select :placeholder="item.placeholder" v-bind="item.otherOptions" style="width: 100%"
                  :model-value="modelValue[`${item.field}`]" @update:modelValue="handleValueChange($event, item.field)">
                  <el-option v-for="(option, index) in item.options" :key="index" :value="option.value">{{ option.title
                  }}
                  </el-option>
                </el-select>
              </template>
              <!-- datepicker -->
              <template v-else-if="item.type == 'datepicker'">
                <el-date-picker style="width: 100%" v-bind="item.otherOptions"
                  :model-value="modelValue[`${item.field}`]" @update:modelValue="handleValueChange($event, item.field)"
                  value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <!-- 底部插槽 -->
    <div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults } from "vue";
import { IFormItem } from "@/base_ui/form/type/type";
const props = withDefaults(
  defineProps<{
    modelValue: any;
    formItems: IFormItem[];
    labelWidth?: string;
    itemStyle?: any;
    colLayout?: any;
  }>(),
  {
    itemStyle: () => ({
      padding: "10px 40px",
    }),
    labelWidth: "100px",
    colLayout: () => ({
      xl: 6, // >1920px 4个
      lg: 8,
      md: 12,
      sm: 24,
      xs: 24,
    }),
  }
);
const emit = defineEmits(["update:modelValue"]);

//实现数据的双向绑定
//双向绑定，改变了moduleValue对象中的值，那么结构出来的
console.log(props.modelValue);

//方式一：双向绑定
// const formData = ref({ ...props.modelValue });
// watch(
//   formData,
//   (newValue) => {
//     console.log("---");
//     emit("update:modelValue", newValue);
//   },
//   {
//     deep: true
//   }
// );
//方式二：手动实现传值和绑定
const handleValueChange = (val: string, field: string) => {
  emit("update:modelValue", { ...props.modelValue, [field]: val });
};
</script>
<style lang="less" scoped>
.lz_form {
  padding-top: 22px;
  overflow: hidden;
}
</style>
