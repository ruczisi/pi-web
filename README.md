# Pi Agent Web

[pi 编程智能体](https://github.com/badlogic/pi-mono) 的网页界面。在浏览器中浏览会话、与智能体对话、分叉对话、切换消息分支。

> **本 fork 新增功能**：界面中文化 + Electron 桌面应用打包（双击 exe 直接运行）

## 快速开始

### 方式一：桌面应用（推荐）

下载 `Pi Agent Web.exe`，双击直接运行，无需安装 Node.js，无需打开浏览器。

适用于 Windows 10/11（x64）。

### 方式二：命令行（原版）

**无需安装，直接运行：**

```bash
npx @agegr/pi-web@latest
```

**或全局安装后使用：**

```bash
npm install -g @agegr/pi-web
pi-web
```

启动后打开 [http://localhost:30141](http://localhost:30141)。

**可选参数：**

```bash
pi-web --port 8080               # 自定义端口
pi-web --hostname 127.0.0.1      # 仅本机访问
pi-web -p 8080 -H 127.0.0.1     # 组合使用

PORT=8080 pi-web                 # 也支持环境变量
```

## 功能介绍

- **会话浏览器** — 按工作目录分组展示所有 pi 会话
- **实时对话** — 通过 SSE 流式输出与智能体实时交互
- **会话分叉** — 从任意用户消息创建独立的新会话分支
- **会话内分支** — 回退到任意节点继续对话，在同一文件内创建分支
- **分支导航器** — 可视化切换同一会话内的各个分支
- **模型切换** — 对话中途随时切换模型
- **工具面板** — 控制智能体可使用的工具
- **压缩会话** — 对长会话进行摘要，节省上下文窗口
- **引导 / 追加** — 打断正在运行的智能体，或在其完成后追加消息
- **界面中文化** — 所有 UI 文本已翻译为中文
- **桌面应用** — 基于 Electron 打包为独立 exe，无需浏览器

## 注意事项

- **数据目录** — 默认读取 `~/.pi/agent/sessions` 下的会话文件。可通过环境变量 `PI_CODING_AGENT_DIR` 指定其他目录。
- **模型配置** — 从智能体数据目录下的 `models.json` 读取可用模型，可在侧边栏的「模型」面板中编辑。
- **文件浏览** — 侧边栏内置文件浏览器，可在标签页中查看当前工作目录下的文件。
- **桌面应用日志** — Electron 版本运行时日志写入 `%TEMP%\pi-agent-web-logs\` 目录，用于排查启动问题。

## 关于本 Fork

本项目 fork 自 [pi-web](https://github.com/badlogic/pi-mono)，在原版基础上做了以下增强：

1. **界面中文化** — 所有 UI 文本、标签、提示信息已翻译为中文
2. **Electron 桌面应用** — 支持打包为 Windows 便携版 exe，双击直接运行，无需浏览器

## 开发

```bash
npm install
npm run dev   # 端口 30141
```

## 打包桌面应用

```bash
npm run dist
```

打包输出位于 `release/` 目录，生成 `Pi Agent Web x.x.x.exe`（便携版，无需安装）。

**打包要求**：
- Windows 10/11（x64）
- Node.js >= 20.9.0
- 需先执行 `npm run build` 生成 Next.js 静态产物（`dist` 命令已包含）

## 项目结构

```
app/
  api/
    sessions/      # 读写会话文件
    agent/         # 发送命令、SSE 事件流
    files/         # 文件内容读取
    models/        # 可用模型列表与默认模型
    models-config/ # 读写 models.json
components/        # UI 组件
lib/
  session-reader.ts  # 解析 .jsonl 会话文件
  rpc-manager.ts     # 管理 AgentSession 生命周期
  normalize.ts       # 规范化 toolCall 字段名
  types.ts
  i18n/              # 国际化（中文化）
    dict.ts          # 中文翻译字典
    index.ts         # useTranslation hook
electron/
  main.js            # Electron 主进程入口
```

会话文件存储路径：`~/.pi/agent/sessions/<编码后的工作目录>/<时间戳>_<uuid>.jsonl`
