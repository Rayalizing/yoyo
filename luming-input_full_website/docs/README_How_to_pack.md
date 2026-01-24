# 如何把本项目打包成“可安装的桌面程序”

本文讲清楚三件事：

- 打包的整体思路是什么
- 用到哪些工具，它们各自做什么
- 从零到出包的具体步骤（含常见报错排查）

适用对象：会基本的命令行操作，能跑起 `pnpm run dev` 的同学。

---

## 1. 背景：为什么“网站”能变成“可安装程序”

浏览器里运行的前端应用，本质是：

- 一堆静态文件：HTML / CSS / JS / 图片等
- 由浏览器负责“加载 + 执行”

把它变成桌面程序的关键是：用一个“桌面壳”把浏览器能力带到用户电脑里，并打成安装包。

在本项目里我们选用的方案是：

- Electron：桌面壳（内置 Chromium + Node.js）
- electron-builder：打包器（把 Electron 应用打成 dmg / exe / AppImage 等）

---

## 2. 本项目采用的打包架构

### 2.1 构建链路（从源码到安装包）

1. Vite 负责把前端源码打成静态资源（输出到 `dist/public`）
2. Electron 主进程启动后：
   - 开发环境：直接加载 Vite Dev Server（`http://localhost:3000`）
   - 生产环境：本地起一个 Express 静态服务，加载 `dist/public`（避免直接用 `file://` 的各种坑）
3. electron-builder 把“Electron 主进程 + 静态资源 + 配置”打包成安装包

### 2.2 目录/文件对应关系（你需要认识的几个文件）

- `vite.config.ts`
  - Vite 的 `root` 是 `client/`
  - Vite build 输出到 `dist/public`
- `electron/main.mjs`
  - Electron 主进程入口：创建窗口、决定加载 dev URL 或本地静态站
- `electron/preload.mjs`
  - 预加载脚本入口（目前是空壳，保留扩展点）
- `package.json`
  - `scripts` 里提供了打包命令
  - `build` 字段是 electron-builder 的配置
- `.npmrc`
  - Electron / electron-builder 下载镜像配置（解决网络超时）

---

## 3. 需要安装的工具

### 3.1 Node.js 与 pnpm

- 需要 Node.js（建议 18/20+）
- 本项目使用 pnpm（见 `package.json -> packageManager`）

安装依赖：

```bash
pnpm install
```

### 3.2 Electron 与 electron-builder（已在项目里配置）

项目已在 `devDependencies` 里加入：

- `electron`
- `electron-builder`
- `concurrently`（让两个命令并行跑）
- `wait-on`（等待 dev server ready）
- `cross-env`（跨平台设置环境变量）

你只要 `pnpm install` 即可。

---

## 4. 开发模式：用桌面壳打开（推荐先跑通）

桌面开发模式会做两件事：

- 启动 Vite Dev Server（端口固定 3000）
- 等待 Dev Server ready 后启动 Electron，并加载该 URL

执行：

```bash
pnpm run desktop:dev
```

常见现象：

- 会弹出一个桌面窗口，内容就是你平时浏览器访问的页面
- 默认会自动打开 DevTools（方便调试）

---

## 5. 生产模式：打出可安装包/可执行文件

### 5.1 一键打包（本机平台）

执行：

```bash
pnpm run desktop:dist
```

它会依次做：

1. `pnpm run build`（Vite build + 打包 server）
2. `electron-builder`（生成安装包）

产物在：

```text
release/
```

macOS 常见产物：

- `*.dmg`（安装盘镜像，最常见）
- `*.zip`（压缩包形式的 App）

### 5.2 跨平台说明（Windows / Linux）

electron-builder 的 `build` 配置里已写了：

- Windows: `nsis`
- Linux: `AppImage`

但通常建议：

- 在 Windows 上打 Windows 包
- 在 Linux 上打 Linux 包

因为跨平台打包常需要额外环境（例如在 mac 上打 NSIS 可能需要 wine 等），新手成本较高。

---

## 6. pnpm v10 的一个“新手坑”：Ignored build scripts

你可能见过类似提示：

```text
Ignored build scripts: electron.
Run "pnpm approve-builds" ...
```

原因：pnpm v10 默认更安全，不会随便执行依赖包的安装脚本（而 Electron 安装脚本需要下载对应平台的二进制）。

本项目采取的做法是：在 `package.json` 里配置允许执行的构建依赖：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["electron"]
  }
}
```

如果你已经安装过但 Electron 启动报“Electron failed to install correctly”，可以执行：

```bash
pnpm rebuild electron
```

---

## 7. 网络问题：Electron 下载超时怎么办

Electron 安装时会下载对应平台的二进制。如果网络不通，会出现 `ETIMEDOUT` 之类的错误。

本项目已在 `.npmrc` 配置镜像：

```ini
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
```

如果你仍然遇到下载失败：

1. 确认 `.npmrc` 在项目根目录且已生效
2. 重试安装/重建：
   ```bash
   pnpm rebuild electron
   ```

---

## 8. macOS 签名与“打不开应用”的问题（初学者可先跳过）

你可能会看到 electron-builder 提示类似：

- skipped macOS application code signing

这意味着：

- 本机能打包出 dmg/zip
- 但分发到别的 Mac 上，可能遇到 Gatekeeper 拦截（“无法验证开发者”）

入门阶段建议：

- 先在开发/测试环境验证功能
- 真要面向大量用户分发，再去做签名与公证（Apple Developer 账号相关流程）

---

## 9. 最小自检清单（出包前建议跑一遍）

```bash
pnpm run check
pnpm run build
pnpm run desktop:dist
```

确认：

- `pnpm run check` 无 TypeScript 报错
- `release/` 目录下生成了安装包

---

## 10. 你可以如何扩展（可选）

- 增加应用图标：在 electron-builder 的 `build` 配置里设置 `icon`
- 增加自动更新：配合 `electron-updater` 等
- 增加本地能力：通过 `preload.mjs` 暴露受控 API 给渲染进程（注意安全边界）

