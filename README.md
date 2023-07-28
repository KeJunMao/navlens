<p align="center">
  <br>
  <img width="100" src="./public/android-chrome-192x192.png" alt="AI Anything logo">
  <br>
</p>
<h2 align='center'>NavLens</h2>

<p align='center'>
  一个现代 <em>开源</em> 简洁 <strong>美观</strong> 的私有导航应用
<br>
<p align="center">
  <a style="text-decoration:none" href="https://github.com/KeJunMao" target="_blank">
    <img src="https://img.shields.io/badge/Author-KeJun-fb923c" alt="Author" />
  </a>
</p>

## 简介

一个开源导航网站，速度非常快

## 特性

- 🌏 分组、分类、站点、链接
- 🔍 拼音、fuse 模糊查询
- 😃 [100,000+](https://icones.js.org/) 图标可供使用
- ⚡️ Nuxt3 驱动，就是快！
- 🔥 PWA 当然

## 部署

### 使用 Docker Compose

```bash
git clone https://github.com/KeJunMao/navlens.git
docker compose build
docker compose up
```

### 传统部署

```bash
git clone https://github.com/KeJunMao/navlens.git
pnpm install
# 配置 .env 的 NUXT_DATABASE_URL
pnpx prisma generate
pnpx prisma migrate deploy
pnpm build
pnpm start # node /app/.output/server/index.mjs
```

## 💻 发展

- 克隆此代码库
- 使用 `corepack enable` 启用 Corepack (对于 Node.js < 16.10，请使用`npm i -g corepack`)
- 使用 `pnpm install` 安装依赖项
- 使用 `pnpm dev` 运行交互测试

## 协议

用 💛 发电

根据[MIT 许可证](./LICENSE)发布
