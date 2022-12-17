## lzBlog-back_manage_system

该项目为博客后台项目，实现了用户管理，文章管理，发布文章，导航页中的工具管理等。



> 本项目使用的包管理工具为`pnpm`，需要先安装pnpm
>
> `npm install pnpm -g`



接下来，安装项目依赖，运行项目。

1、安装依赖

`pnpm install`

2、运行项目

`pnpm run dev`





项目打包

`pnpm run build`

打包部署时，需要将.env.production中的网络请求地址修改为自己服务器的接口地址。

```
# 服务器接口地址
VITE_APP_BASE_URL=http://49.232.**.105:8000  
# 发表文章时，图片上传地址
VITE_APP_IMG_URL=http://49.232.**.105:8000/upload/picture
# 工具网站的图标 上传地址
VITE_APP_ICON_URL=http://49.232.**.105:8000/upload/icon
```



