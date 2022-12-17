<template>
  <div class="login">
    <div class="container">
      <h2 class="mb-4 text-center">龙仔博客后台管理系统</h2>
      <form action="#" class="signin-form">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Username" v-model="user.email" />
        </div>
        <div class="form-group">
          <input id="password-field" type="password" class="form-control" placeholder="Password" v-model="user.password"
            autocomplete="false" />
        </div>
        <div class="form-group">
          <button type="button" class="submit" @click="successLogin">
            登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, getPublickey } from "@/network/user/user";
import localCache from "@/utils/cache";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "@/store";
import { encrypt } from "@/utils/jsencrypt";
const Router = useRouter();
const Store = useStore();
const user = ref({
  email: "",
  password: "",
});
const successLogin = async () => {
  //判断是否为空
  if (user.value.email === '' || user.value.password === '') {
    ElMessage({
      message: '邮箱或密码不能为空',
      type: "error",
    })
    return;
  }
  //获取公钥
  const resKey = await getPublickey().catch((err) => {
    ElMessage({
      message: err.response.message,
      type: "error",
    });
  });
  const pwd = encrypt(resKey.publicKey, user.value.password);
  if (pwd) {
    user.value.password = pwd;
  }
  login(user.value)
    .then((res) => {
      console.log(res);
      localCache.setCache("end_userInfo", res);
      Store.updateUserinfo();
      //跳转到首页
      Router.push({ path: "/main" });
      ElNotification({
        title: `Hello,${res.name}`,
        message: "欢迎来到龙仔博客后台管理系统",
        type: "success",
        duration: 1500,
      });
    })
    .catch((err) => {
      ElMessage({
        message: err.response.data,
        type: "error",
      });
    });
};
</script>
<style lang="less" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/image/bg.jpg);
  background-position: center;
  overflow: hidden;

  .container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: -50px;

    .signin-form {
      margin-top: 15px;
      text-align: center;

      input {
        width: 300px;
        height: 35px;
        border: none;
        outline: none;
        border-radius: 30px;
        padding-left: 16px;
        color: #fff;
        background-color: rgba(240, 240, 240, 0.2);
        margin-bottom: 20px;
      }

      /* 更改文本框的placeholder的颜色 */
      input::placeholder {
        color: #fff;
      }

      .submit {
        width: 320px;
        height: 40px;
        border-radius: 30px;
        border: none;
        background-color: #fbceb5;
      }

      .tip::v-deep {
        margin-top: 20px;
        color: #fff;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
