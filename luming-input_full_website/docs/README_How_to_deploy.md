# luming-input 部署与运行指南

本项目是基于 Vite + React + TypeScript 的前后端一体应用：

- 前端：位于 `client/` 目录，由 Vite 构建，产物输出到 `dist/public`
- 后端：位于 `server/index.ts`，使用 Express 提供静态资源和前端路由

本文档将详细说明从本地开发、构建到生产部署的完整流程。

---

## 1. 环境准备

在开始之前，请确保本机已安装：

- Node.js：建议使用 **18 LTS 或 20 LTS**
- pnpm：项目使用 pnpm 管理依赖（仓库锁定版本为 `pnpm@10.4.1`）

推荐使用 Corepack 启用并激活仓库锁定的 pnpm 版本：

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

如果不使用 Corepack，也可以全局安装 pnpm：

```bash
npm install -g pnpm
```

---

## 2. 安装依赖

在项目根目录（即包含 `package.json` 的目录）下执行：

```bash
pnpm install
```

首次安装会根据 `package.json` 和 `pnpm-lock.yaml` 拉取所有依赖。

---

## 3. 本地开发环境启动

开发模式下推荐只运行前端开发服务器（热更新更友好）：

```bash
pnpm dev
```

默认会在本机 3000 端口启动 Vite 开发服务器：

- 开发地址（可能会自动选取 3000 以后的空闲端口）：
  - http://localhost:3000/

如 3000 端口被占用，Vite 会自动选择下一个可用端口，终端输出中会显示实际访问地址。

> 开发模式下，`server/index.ts` 中的 Express 服务器不参与，前端路由和静态资源由 Vite 直接提供。

---

## 4. 构建生产前端与后端

当需要部署到生产环境时，需要先进行构建。

在项目根目录执行：

```bash
pnpm build
```

该命令做两件事：

1. 使用 Vite 构建前端
   - 入口：`client/`
   - 构建配置：`vite.config.ts`
   - 输出目录：`dist/public`

2. 使用 esbuild 打包后端服务器
   - 入口：`server/index.ts`
   - 目标平台：Node.js（ESM）
   - 输出文件：`dist/index.js`

构建完成后，生产部署只需依赖 `dist/` 目录即可运行。

---

## 5. 生产环境运行方式

### 5.1 使用 Node 直接运行（推荐最简方式）

确保已经执行过构建：

```bash
pnpm build
```

然后在项目根目录执行：

```bash
pnpm start
```

该命令实际上执行：

```bash
NODE_ENV=production node dist/index.js
```

此时：

- Express 会从 `dist/public` 提供静态文件
- 所有路由（`*`）都会返回 `dist/public/index.html`，用于支持前端 SPA 路由
- 默认监听端口为：`3000`，可通过环境变量 `PORT` 覆盖

访问地址示例：

- http://localhost:3000/

### 5.2 使用 Node + 进程守护（如 PM2）

在生产环境中，为了保证服务自动重启与日志管理，推荐配合进程管理工具（如 PM2）。

示例步骤：

```bash
# 1. 安装 pm2（如果尚未安装）
npm install -g pm2

# 2. 构建
pnpm build

# 3. 以生产模式启动服务
PORT=3000 NODE_ENV=production pm2 start dist/index.js --name luming-input

# 4. 查看日志
pm2 logs luming-input

# 5. 停止 / 重启
pm2 stop luming-input
pm2 restart luming-input
```

### 5.3 部署到 Linux 服务器（通用流程示例）

以一台 Linux 服务器为例（Ubuntu/CentOS 均可）：

1. **上传代码**
   - 将整个项目目录上传到服务器，例如：`/var/www/luming-input`

2. **安装 Node 与 pnpm**
   - 使用 nvm 或系统包管理器安装 Node 18+/20+
   - 全局安装 pnpm：

     ```bash
     npm install -g pnpm
     ```

3. **安装依赖并构建**

   ```bash
   cd /var/www/luming-input
   pnpm install
   pnpm build
   ```

4. **以生产模式启动服务**（任选一种方式）：

   - 直接使用 Node（适合临时测试）：

     ```bash
     PORT=3000 NODE_ENV=production node dist/index.js
     ```

   - 使用 PM2（推荐生产）：

     ```bash
     PORT=3000 NODE_ENV=production pm2 start dist/index.js --name luming-input
     ```

5. **（可选）结合 Nginx 反向代理**

   - 将 Nginx 的某个域名/路径代理到 `localhost:3000`
   - 示例 Nginx 配置片段：

     ```nginx
     server {
       listen 80;
       server_name your-domain.com;

       location / {
         proxy_pass http://127.0.0.1:3000;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
       }
     }
     ```

### 5.4 纯静态部署（无需 Node）

由于后端只负责提供静态文件与前端路由回退，你也可以把前端产物当作纯静态站点部署。

步骤：

1. 本地或 CI 构建：

   ```bash
   pnpm install
   pnpm build
   ```

2. 将 `dist/public/` 上传到你的静态服务器目录（例如：`/var/www/luming-input/public`）

3. 配置 Nginx 做 SPA 路由回退（关键是 `try_files ... /index.html`）：

   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     root /var/www/luming-input/public;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

---

## 6. 环境变量说明

目前服务器启动文件 [server/index.ts](./server/index.ts) 中用到的环境变量包括：

- `PORT`
  - 作用：指定服务器监听的端口
  - 默认值：`3000`
  - 示例：`PORT=8080 pnpm start`

- `NODE_ENV`
  - 作用：区分开发 / 生产模式
  - 构建后运行时建议设置为 `production`
  - 示例：`NODE_ENV=production pnpm start`

前端若有自定义环境变量，应使用 Vite 约定的前缀 `VITE_`，例如：

```bash
VITE_API_BASE=https://api.example.com pnpm dev
```

相关环境变量文件（如果需要）可以放在项目根目录，如：`.env`, `.env.production`，Vite 会根据 `envDir` 配置加载。

> 当前仓库中未强制要求特定的 `VITE_` 前缀变量，如需引入，请在修改代码时同步更新本说明。

---

## 7. 常用脚本一览

在项目根目录下，可用的 npm 脚本如下（通过 pnpm 调用）：

- 本地开发：

  ```bash
  pnpm dev
  ```

- 构建（前端 + 后端）：

  ```bash
  pnpm build
  ```

- 启动生产环境服务器：

  ```bash
  pnpm start
  ```

- TypeScript 类型检查：

  ```bash
  pnpm check
  ```

- 代码格式化：

  ```bash
  pnpm format
  ```

> 本项目未在 `package.json` 中定义单独的测试脚本，如需添加测试流程，可基于 `vitest` 自行扩展。

---

## 8. 故障排查

### 8.1 启动后访问不了页面

- 检查服务是否正常启动，有无报错日志
- 确认使用的端口与 `PORT`、Nginx 配置一致
- 若使用云服务器，确认安全组/防火墙是否放行对应端口

### 8.2 静态资源 404 或空白页

- 确认是否执行过 `pnpm build`，并检查 `dist/public` 下是否存在 `index.html` 等文件
- 确认生产环境运行的是 `dist/index.js` 而非源码 `server/index.ts`

### 8.3 构建失败

- 确认 Node 版本满足要求（建议 18+/20+）
- 删除 `node_modules` 后重装依赖：

  ```bash
  rm -rf node_modules
  pnpm install
  pnpm build
  ```

如仍有问题，建议将构建日志与错误信息一起提交，以便进一步排查。
上述是