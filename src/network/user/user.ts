import lzRequest from "../request";
import {IDataType} from "../type";
import {Iuser, IloginType} from "./type";

//获取验证码
export function getCode(email: string) {
  return lzRequest.post<IDataType>({
    url: `/user/code`,
    data: {
      email,
    },
  });
}

//注册
export function register(userInfo: Iuser) {
  return lzRequest.post<IloginType>({
    url: `/user/register`,
    data: {
      name: userInfo.email,
      password: userInfo.password,
      code: userInfo.code,
    },
  });
}

//登录
export function login(userInfo: Iuser) {
  return lzRequest.post<IloginType>({
    url: `/user/loginEnd`,
    data: {
      name: userInfo.email,
      password: userInfo.password,
    },
  });
}

//获取公钥
export function getPublickey() {
  return lzRequest.get({
    url: "/pubkey",
  });
}

//获取用户列表
export function getUserList(offset: number, size: number) {
  return lzRequest.get({
    url: "/user/list",
    params: {
      offset,
      size,
    },
  });
}

//删除用户
export function deleteUser(userId: number) {
  return lzRequest.delete({
    url: "/user/delete",
    params: {
      userId,
    },
  });
}

//搜索用户
export function searchUser(
  status: number,
  createTime: any,
  offset: number,
  size: number
) {
  return lzRequest.post({
    url: "/user/search",
    params: {
      status,
      createTime,
      offset,
      size,
    },
  });
}
