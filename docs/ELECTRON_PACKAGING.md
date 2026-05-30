# Electron 打包踩坑记录

> 项目：pi-web  
> 记录日期：2026-05-30  
> 适用版本：v0.6.12

---

## 一、项目背景

本项目基于 Next.js + Electron 构建桌面应用。打包流程为：

```
npm run build          # Next.js 生产构建
npx electron-builder   # Electron 打包
```

目标平台：Windows (x64)  
目标产物：可直接分发的 zip 压缩包

---

## 二、踩坑记录

### 坑 1：NSIS portable 单文件打包卡住

**现象**：`electron-builder --win portable` 执行到 NSIS 编译阶段后无响应，进程不再输出任何日志，也不退出。

**根因分析**：

1. 配置中 `asar: false`，禁用 asar 后 electron-builder 需要直接处理数万个零散文件
2. 每次重新打包时，Windows 文件锁定机制导致 `d3dcompiler_47.dll` 等文件无法被覆盖
3. NSIS 编译器在处理大量零散文件时容易内存溢出或死锁

**错误日志**：

```
• building target=portable file=release\Pi Agent Web 0.6.12.exe archs=x64
# ← 此后永久卡住，无后续输出
```

**解决方案**：

放弃 `portable` target，改用 `zip` target：

```yaml
# electron-builder.yml
win:
  target:
    - target: zip   # ← 替代 portable
      arch:
        - x64
```

`zip` target 直接将 `win-unpacked` 目录压缩为 zip，完全绕过 NSIS，打包稳定且速度快。

---

### 坑 2：Windows 托盘图标不支持 SVG 格式

**现象**：打包后的 exe 双击运行后，任务管理器显示进程存在，但没有任何窗口弹出。

**排查过程**：

1. 查看 `%TEMP%/pi-agent-web-logs/main-*.log` 日志
2. 发现错误：`Failed to load image from path '...\window.svg'`
3. 该异常发生在 `createTray()` 中，且为同步异常，直接中断了 `startServer()` 的执行

**根因**：Windows 系统托盘（Tray）仅支持 PNG / ICO 格式，不支持 SVG。

**解决方案**：

1. 生成 PNG 格式的图标文件 `public/window.png`
2. `main.js` 中根据平台自动选择图标格式：

```js
const iconName = process.platform === "win32" ? "window.png" : "window.svg";
const iconPath = path.join(__dirname, "..", "public", iconName);
try {
  tray = new Tray(iconPath);
} catch (err) {
  logError("Failed to create tray icon:", err.message);
  return;
}
```

3. 为 `createTray()` 添加 `try-catch`，防止图标加载失败中断整个应用启动流程

---

### 坑 3：asar 模式下 files 配置不生效（未解决，已回退）

**现象**：尝试启用 `asar: true` 解决文件锁定问题时，`app.asar` 中只有 `node_modules`，`package.json`、`electron/` 等应用文件全部缺失。

**错误日志**：

```
⨯ Application "package.json" in the "...\app.asar" does not exist.
  Seems like a wrong configuration.
```

**排查过程**：

1. 使用 `npx asar list app.asar` 检查内容 → 48,662 个文件全在 `node_modules` 下
2. 检查 `resources/app/` 目录 → 文件确实存在（来自 `extraResources`）
3. 但 asar 打包后这些文件全部消失

**尝试过的修复（均无效）**：

| 尝试 | 结果 |
|------|------|
| 移除不存在的 `node.exe` 从 `files` | 仍报错 |
| 把 `extraResources` 合并到 `files` | 仍报错 |
| 配置 `asarUnpack` 保留关键文件 | 仍报错 |

**结论**：electron-builder v25.1.8 在本项目的特定配置组合下，asar 打包逻辑存在异常。由于耗时过长且反复失败，决定**回退 `asar: false`，改用 zip target 作为最终方案**。

---

## 三、最终可用配置

```yaml
# electron-builder.yml
appId: com.agegr.pi-web
productName: Pi Agent Web
directories:
  output: release
files:
  - electron/**/*
  - package.json
  - node.exe           # 可选，用于无 Node.js 环境的目标机器
extraResources:
  - from: .next
    to: app/.next
  - from: public
    to: app/public
  - from: next.config.ts
    to: app/next.config.ts
  - from: package.json
    to: app/package.json
asar: false
win:
  target:
    - target: zip
      arch:
        - x64
```

---

## 四、打包命令

```bash
# 1. Next.js 构建
npm run build

# 2. Electron 打包（输出 zip）
npx electron-builder --win zip

# 产物路径：release/Pi Agent Web-{version}-win.zip
```

---

## 五、验证清单

打包完成后，解压 zip 并运行验证：

- [ ] `Pi Agent Web.exe` 可正常启动
- [ ] 窗口正常显示
- [ ] 系统托盘图标正常（Windows 右下角）
- [ ] Next.js 服务器正常启动（查看日志 `%TEMP%/pi-agent-web-logs/`）
- [ ] 关闭窗口后最小化到托盘（不退出进程）
- [ ] 托盘右键菜单「退出」可彻底关闭程序

---

## 六、相关文件

| 文件 | 说明 |
|------|------|
| `electron/main.js` | 主进程入口，含路径查找、服务器启动、托盘逻辑 |
| `electron-builder.yml` | 打包配置 |
| `public/window.png` | Windows 托盘图标（PNG 格式） |
| `public/window.svg` | macOS/Linux 托盘图标（SVG 格式） |
