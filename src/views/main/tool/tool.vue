<template>
  <div class="toolWrapper">
    <div class="operation">
      <el-button type="primary" @click="addType">添加类别</el-button>
      <el-button type="primary" @click="addTool">添加工具</el-button>
    </div>

    <!-- 添加类别 -->
    <el-dialog v-model="dialogType" title="添加类别" width="500px">
      <el-form :model="typeObj" ref="typeRef">
        <el-form-item label="类别名称" label-width="100px" :rules="[{required: true, message: '请输入类别名称'}]" prop="typeName">
          <el-input v-model="typeObj.typeName" placeholder="请输入类别名称" autocomplete="off" style="width: 70%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="() => resetForm(typeRef, 'type')">取消</el-button>
          <el-button type="primary" @click="() => typeEvent(typeRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogTool" title="添加工具" width="500px">
      <el-form :model="toolObj" ref="toolRef" :rules="toolRules">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="toolObj.name" placeholder="请输入名称" autocomplete="off" style="width: 80%" />
        </el-form-item>
        <el-form-item label="地址" label-width="100px" prop="url">
          <el-input v-model="toolObj.url" placeholder="请输入地址" autocomplete="off" style="width: 80%" />
        </el-form-item>
        <el-form-item label="图标" label-width="100px" prop="icon">
          <el-upload :action="aciton" list-type="picture-card" :on-success="uploadSuccess" :headers="headers"
            name="icon" :disabled="disabled" :class="{hiden:disabled}" v-model:file-list="iconList">
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="scope">
              <div>
                <img class="el-upload-list__item-thumbnail" v-if="File.url" :src="File.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="handleRemove">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型" label-width="100px" prop="type">
          <el-select v-model="toolObj.type" placeholder="请选择类型" style="width: 80%">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="() => resetForm(toolRef, 'tool')">取消</el-button>
          <el-button type="primary" @click="addToolEvent(toolRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 工具类型 -->
    <div>
      <h3>工具类别</h3>
      <el-tag
        class="mr-10"
        v-for="type in typeList"
        :key="type.id"
        closable
        size="large"
        :disable-transitions="false"
        @close="handleDelete(type.id)"
      >
        {{ type.name }}
      </el-tag>
    </div>

    <!-- 工具分类表 -->
    <h3>工具列表</h3>
    <div v-for="(item, index) in toolList" class="site_category">
      <h3>{{ item.typeName }}</h3>
      <section class="site_list">
        <div v-for="(site, index) in item.tool" class="site_item" >
          <a :href="site.url" target="_blank">
            <img :src="site.icon" alt="" class="site_img" :style="site.style" />
            <span class="site_name">{{ site.name }}</span>
          </a>
          <el-icon class="delete" color="#fff" @click.stop="delsite(site.id)"><Close /></el-icon>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref, reactive, computed} from "vue";
import type {FormInstance, UploadFile} from "element-plus";
import {addToolType ,getTypeList,addToolSite,getToolList,deleteTool,deleteType} from "@/network/tool/tool";
import {ElMessage} from "element-plus";
import {Delete, Plus,Close} from "@element-plus/icons-vue";
import localCache from "@/utils/cache";

const tools = ref([]);

// 类别
let typeList = ref<Array<{
  id:number,
  name:string
}>>()
const typeRef = ref<FormInstance>();
const dialogType = ref(false);
const typeObj = reactive({
  typeName: "",
});



function getTypeListFn(){
  // 获取typeList
  getTypeList().then((res:any)=>{
    typeList.value = res.data
  })
}
getTypeListFn()

function addType() {
  dialogType.value = true;
  typeObj.typeName = "";
}

function typeEvent(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      addToolType(typeObj.typeName).then((res) => {
        console.log(res);
        ElMessage({
          message: res.msg,
          type: "success",
        });
        getTypeListFn();
        dialogType.value = false;
        formEl.resetFields();
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
}

function handleDelete(id:number){
  deleteType(id).then(res=>{
    ElMessage({
              message: res.msg,
              type: "success",
          });
    getTypeListFn();
    getList();
  })
}

// 工具
const userInfo = localCache.getCache("end_userInfo");

const toolList = ref<any>([])
const toolRef = ref<FormInstance>();
const toolRules = reactive({
  name: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
  url: [{required: true, message: '请输入工具url',trigger: 'blur' }],
  icon: [{ required: true,message: '请上传工具icon',trigger: 'blur' }],
  type:[{ required: true,message: '请选择工具类别',trigger: 'blur' }]
})
const dialogTool = ref(false);
const toolObj = reactive({
  name: "",
  url: "",
  icon: "",
  type: '',
});
const iconList = reactive<any>([]);
const headers = ref({
  Authorization: `Bearer ${userInfo.token}`,
});
const aciton = import.meta.env.VITE_APP_ICON_URL;
const File = ref({
  url: "",
});
const disabled = computed(() => File.value.url === '' ? false : true);
const uploadSuccess = (res:any) => {
  console.log(res.data.url);
  if (res.data.url) {
    File.value.url = res.data.url;
    toolObj.icon = File.value.url;
  }
};
const handleRemove = () => {
  File.value.url = "";
  toolObj.icon = "";
  iconList.pop()
};



function addTool() {
  dialogTool.value = true;
}

function addToolEvent(formEl: FormInstance | undefined){
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      addToolSite(toolObj.name,toolObj.url,toolObj.icon,toolObj.type).then(res=>{
        dialogTool.value = false;

        ElMessage({
              message: res.msg,
              type: "success",
        });
        getList();
        formEl.resetFields();
        File.value.url = '';
        iconList.pop();
      })
    } else {
      console.log("error submit!");
      return false;
    }
  });
  
}

// 获取tool列表
function getList(){
  getToolList().then(res=>{
    console.log(res);
    toolList.value = res.data;
  })
}
getList();

function delsite(id:number){
  console.log(id);
  deleteTool(id).then(res=>{
    
    ElMessage({
              message: res.msg,
              type: "success",
        });
    getList();
  })
}
const resetForm = (formEl: FormInstance | undefined, tag: string) => {
  if (!formEl) return;
  formEl.resetFields();

  switch (tag) {
    case "type":
      dialogType.value = false;
      break;
    case "tool":
      dialogTool.value = false;
      break;
  }
};
</script>
<style lang="less" scoped>
.toolWrapper {
  text-align: left;
  padding: 15px;

  .site_category {
    margin: 10px;
    padding: 20px 30px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0px 0px 5px #e0e0e0;

    .site_list {
      display: flex;
      flex-wrap: wrap;

      .site_item {
        position: relative;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        box-shadow: 0px 0px 5px #e0e0e0;
        border-radius: 5px;
        padding: 7px 10px;
        margin: 10px;
        transition: all 0.7s;

        a{
          display: flex;
          justify-content: center;
          align-items: center;
          .site_img {
            width: 50px;
            height: 50px;
          }

          .site_name {
            margin-left: 5px;
          }
        }

        .delete {
          display: none;
          position: absolute;
          z-index: 10;
          top: 0;
          right: 0;
          // font-size: 18px;
          cursor: pointer;
          width: 16px;
          height: 16px;
          background-color: rgba(115, 110, 110, 0.5);
          box-shadow: 0 0 5px #e0e0e0;
          border-radius: 50%;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0px 0px 10px #e0e0e0;

          .delete {
            display: block;
          }
        }
      }
    }
  }
}

.hiden {
  ::v-deep(.el-upload--picture-card) {
    display: none;
  }
}
</style>
