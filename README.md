# vue-admin-demo
vue后台系统demo（前端架构）
简体中文

## 简介
1.后台管理系统
2. vue + vue-router + webpack + axios + element-UI+ scss等技术

## 功能
```
- 登录 / 注销

## 开发
```bash
# 克隆项目
https://github.com/yanjiFan1/vue-admin-demo.git
# 安装依赖
npm install
   
# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run mock 模拟环境
npm run dev  开发环境
```
浏览器访问 http://localhost:9527

## 发布
```bash
# 构建测试环境
npm run build:sit

# 构建生产环境
npm run build:prod
```

## 其它
```bash
# --report to build with bundle size analytics
npm run build:prod --report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix

