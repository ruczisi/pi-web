# 手动发布版本指南

> 项目：pi-web  
> 适用版本：v0.6.12 及以后

---

## 一、发布前准备

### 1.1 确认版本号

```bash
# 查看当前版本
cat package.json | grep '"version"'
```

如需升级版本：

```bash
# 修改 package.json 中的 version 字段
# 然后提交
npm version patch   # 或 minor / major
```

### 1.2 确认代码已提交

```bash
git status
# 确保工作区干净，无未提交修改
```

---

## 二、打包流程

### 2.1 构建 Next.js

```bash
npm run build
```

### 2.2 打包 Electron

```bash
npx electron-builder --win zip
```

**产物位置**：`release/Pi Agent Web-{version}-win.zip`

### 2.3 验证产物

解压 zip，运行 `Pi Agent Web.exe`，确认：

- [ ] 窗口正常弹出
- [ ] 系统托盘图标显示正常
- [ ] 功能正常（会话列表、聊天、文件浏览等）

---

## 三、创建 GitHub Release

### 3.1 打 Tag

```bash
# 格式：v + 版本号
git tag -a v0.6.12 -m "Release v0.6.12"

# 推送 tag
git push origin v0.6.12
```

### 3.2 在 GitHub 上创建 Release

1. 打开仓库页面：`https://github.com/ruczisi/pi-web`
2. 点击右侧 **Releases** → **Create a new release**
3. 在 **Choose a tag** 中选择刚推送的 `v0.6.12`
4. 填写 Release 信息：

**Title**：`Pi Agent Web v0.6.12`

**Description 模板**：

```markdown
## 更新内容

- 功能 A
- 功能 B
- Bug 修复 C

## 安装方式

1. 下载下方 `Pi Agent Web-0.6.12-win.zip`
2. 解压到任意目录
3. 运行 `Pi Agent Web.exe`

## 系统要求

- Windows 10/11 (x64)
- 已安装 Node.js（如使用系统 node）
```

5. 上传打包产物：
   - 拖拽或点击 **Attach binaries** 上传 `release/Pi Agent Web-0.6.12-win.zip`
6. 点击 **Publish release**

### 3.3 使用 GitHub CLI（可选）

如已安装 `gh` CLI，可自动化创建 Release：

```bash
gh release create v0.6.12 \
  --title "Pi Agent Web v0.6.12" \
  --notes-file release-notes.md \
  release/Pi Agent Web-0.6.12-win.zip
```

---

## 四、Release 信息模板

### 4.1 首次发布

```markdown
## Pi Agent Web v0.6.12

### 功能特性
- Next.js Web UI 桌面化封装
- 支持中文/英文国际化（i18n）
- 系统托盘与单实例锁定
- 窗口关闭最小化到托盘

### 安装方式
1. 下载 `Pi Agent Web-0.6.12-win.zip`
2. 解压到任意目录
3. 运行 `Pi Agent Web.exe`

### 系统要求
- Windows 10/11 (x64)
```

### 4.2 后续更新

```markdown
## Pi Agent Web v0.6.13

### 新增
- xxx

### 修复
- xxx

### 安装方式
同上。
```

---

## 五、常见问题

### Q1：Release 上传文件大小限制？

GitHub Release 附件单文件最大 **2GB**。本项目 zip 约 160-200MB，远低于限制。

### Q2：需要保留历史版本吗？

建议保留最近 3-5 个版本的 Release，旧的可以删除以节省空间。

### Q3：如何向已发布 Release 追加文件？

1. 打开该 Release 的编辑页面
2. 在底部 Attach binaries 区域上传新文件
3. 点击 Update release

---

## 六、快速参考

```bash
# 完整发布流程（一键复制）
npm run build
npx electron-builder --win zip
git tag -a v0.6.12 -m "Release v0.6.12"
git push origin v0.6.12
# 然后到 GitHub 网页创建 Release 并上传 zip
```
