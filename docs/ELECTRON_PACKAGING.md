# Electron 打包指南

> 项目：pi-web  
> 更新日期：2026-05-30  
> 适用版本：v0.6.12+

---

## 一、环境要求

- Windows 10/11 (x64)
- Node.js 18+
- Git

---

## 二、打包命令

```bash
# 1. 安装依赖
npm install

# 2. Next.js 生产构建
npm run build

# 3. Electron 打包（输出 zip）
npx electron-builder --win zip
```

**产物路径**：`release/Pi Agent Web-{version}-win.zip`

---

## 三、关键配置说明

### 3.1 为什么用 `zip` target 而不是 `portable`

```yaml
# electron-builder.yml
win:
  target:
    - target: zip    # ✅ 推荐
      arch:
        - x64
```

| target | 说明 | 是否推荐 |
|--------|------|----------|
| `zip` | 直接压缩 `win-unpacked` 目录 | ✅ 稳定、快速 |
| `portable` | 使用 NSIS 编译为单文件 exe | ❌ 在大量零散文件场景下容易卡死 |

**原因**：`portable` 依赖 NSIS 编译器处理数万个零散文件，容易触发内存问题或死锁。`zip` 直接压缩，完全绕过 NSIS。

### 3.2 为什么保持 `asar: false`

```yaml
# electron-builder.yml
asar: false    # ✅ 必须保持 false
```

| 模式 | 说明 | 本项目是否可用 |
|------|------|----------------|
| `asar: false` | 文件直接暴露在 `resources/app/` | ✅ 可用 |
| `asar: true` | 文件打包进 `app.asar` 归档 | ❌ 不可用（见下方注意事项） |

**不可用的原因**：本项目 `package.json` 顶层存在 `"files"` 字段（npm publish 白名单），electron-builder v25.1.8 在 asar 模式下可能误读该字段，导致应用文件（`package.json`、`electron/` 等）无法正确打入 asar，仅 `node_modules` 被打入。

### 3.3 `extraResources` 的作用

```yaml
extraResources:
  - from: .next
    to: app/.next
  - from: public
    to: app/public
  - from: next.config.ts
    to: app/next.config.ts
  - from: package.json
    to: app/package.json
```

Next.js 构建产物（`.next`、`public`）和配置文件需要通过 `extraResources` 复制到 `resources/app/` 目录，否则 Next.js 服务器无法找到构建产物。

### 3.4 Windows 托盘图标格式

`electron/main.js` 中已实现平台自动选择：

```js
const iconName = process.platform === "win32" ? "window.png" : "window.svg";
```

**注意**：Windows 托盘不支持 SVG，必须使用 PNG。项目已提供 `public/window.png`，无需额外处理。

---

## 四、常见问题

### Q1：打包时提示 `d3dcompiler_47.dll: Access is denied`

**原因**：上一次运行的 Electron 进程未退出，锁定了文件。  
**解决**：

```powershell
# 杀掉残留进程后重新打包
Get-Process | Where-Object { $_.ProcessName -match "Pi Agent Web|electron" } | Stop-Process -Force
```

### Q2：打包后 exe 运行无界面

**原因**：Windows 托盘图标加载失败（SVG 格式不支持），同步异常中断了启动流程。  
**解决**：确认 `public/window.png` 存在，且 `main.js` 中使用了平台判断逻辑。

### Q3：asar 模式报错 `package.json does not exist in app.asar`

**原因**：electron-builder v25.1.8 在特定 `package.json` 配置组合下 asar 打包异常。  
**解决**：保持 `asar: false`，不要尝试启用 asar。

---

## 五、完整配置参考

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

## 六、验证清单

解压 zip 后运行 `Pi Agent Web.exe`，确认：

- [ ] 窗口正常显示
- [ ] 系统托盘图标正常（Windows 右下角）
- [ ] Next.js 服务器正常启动（日志路径：`%TEMP%/pi-agent-web-logs/`）
- [ ] 关闭窗口后最小化到托盘（不退出）
- [ ] 托盘右键「退出」可彻底关闭程序
