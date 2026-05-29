const { app, BrowserWindow, dialog, Tray, Menu } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// ===== 日志系统 =====
const logDir = path.join(os.tmpdir(), "pi-agent-web-logs");
try { fs.mkdirSync(logDir, { recursive: true }); } catch {}
const logFile = path.join(logDir, `main-${Date.now()}.log`);
function log(...args) {
  const line = `[${new Date().toISOString()}] ${args.join(" ")}\n`;
  try { fs.appendFileSync(logFile, line); } catch {}
  console.log(...args);
}
function logError(...args) {
  const line = `[${new Date().toISOString()}] ERROR: ${args.join(" ")}\n`;
  try { fs.appendFileSync(logFile, line); } catch {}
  console.error(...args);
}

log("=== Pi Agent Web Electron Main Process Started ===");
log("Electron version:", process.versions.electron);
log("Node version:", process.versions.node);
log("Platform:", process.platform);

// ===== 定位应用资源根目录 =====
function getAppRoot() {
  const candidates = [
    path.join(process.resourcesPath, "app"),
    path.join(__dirname, ".."),
    process.cwd(),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, ".next"))) {
      log("App root found:", dir);
      return dir;
    }
  }
  logError("Could not find app root with .next directory");
  return candidates[0];
}

const appRoot = getAppRoot();
const nextDir = path.join(appRoot, ".next");
const nextBin = path.join(appRoot, "node_modules", "next", "dist", "bin", "next");

log("appRoot:", appRoot);
log("nextDir exists:", fs.existsSync(nextDir));
log("nextBin exists:", fs.existsSync(nextBin));

// ===== 查找 Node.js 运行时 =====
function findNode() {
  const candidates = [
    path.join(appRoot, "node.exe"),
    path.join(path.dirname(process.execPath), "node.exe"),
    "C:\\Program Files\\nodejs\\node.exe",
    "C:\\Program Files (x86)\\nodejs\\node.exe",
    "D:\\Program Files\\nodejs\\node.exe",
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      log("Found node:", c);
      return c;
    }
  }
  log("Falling back to 'node' in PATH");
  return "node";
}

const nodeBin = findNode();
const port = process.env.PORT || "30141";
const url = `http://localhost:${port}`;

let mainWindow = null;
let serverProcess = null;
let windowCreated = false;
let tray = null;

// ===== 创建窗口 =====
function createWindow() {
  if (windowCreated) {
    log("Window already created, skipping");
    return;
  }
  windowCreated = true;

  log("Creating BrowserWindow...");
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: "Pi Agent Web",
    show: true,
    backgroundColor: "#0f0f0f",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false,
    },
  });

  log("Loading URL:", url);
  mainWindow.loadURL(url);

  // 无论加载是否成功，都显示窗口
  mainWindow.once("ready-to-show", () => {
    log("Window ready-to-show event fired");
    mainWindow.show();
    mainWindow.focus();
  });

  // 加载失败处理
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    logError("Page failed to load:", errorCode, errorDescription);
    // 5 秒后重试
    setTimeout(() => {
      log("Retrying loadURL...");
      mainWindow.loadURL(url);
    }, 5000);
  });

  // 控制台消息转发到日志
  mainWindow.webContents.on("console-message", (_event, level, message) => {
    const levels = ["log", "warn", "error"];
    log(`[Renderer ${levels[level] || level}]`, message);
  });

  // 点击关闭按钮时最小化到托盘，而不是退出
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      log("Window hidden to tray");
    }
  });

  mainWindow.on("closed", () => {
    log("Window closed");
    mainWindow = null;
  });

  // 开发时可取消注释下面这行打开 DevTools
  // mainWindow.webContents.openDevTools();
}

// ===== 创建系统托盘 =====
function createTray() {
  // Windows 不支持 SVG 托盘图标，使用 PNG
  const iconName = process.platform === "win32" ? "window.png" : "window.svg";
  const iconPath = path.join(__dirname, "..", "public", iconName);
  try {
    tray = new Tray(iconPath);
  } catch (err) {
    logError("Failed to create tray icon:", err.message);
    return;
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: "退出",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Pi Agent Web");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

// ===== 启动 Next.js 服务器 =====
function startServer() {
  if (!fs.existsSync(nextDir)) {
    logError("Build artifacts not found:", nextDir);
    dialog.showErrorBox("启动失败", `找不到构建产物: ${nextDir}\n请先运行 npm run build`);
    app.quit();
    return;
  }

  log("Starting Next.js server...");
  log("  Node:", nodeBin);
  log("  Root:", appRoot);
  log("  Port:", port);

  serverProcess = spawn(nodeBin, [nextBin, "start", "-p", port], {
    cwd: appRoot,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });

  log("Server PID:", serverProcess.pid);

  let ready = false;

  serverProcess.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    fs.appendFileSync(logFile, `[SERVER] ${text}`);
    if (!ready && (text.includes("Ready") || text.includes("Local:"))) {
      ready = true;
      log("Server is ready, creating window...");
      createWindow();
    }
  });

  serverProcess.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    fs.appendFileSync(logFile, `[SERVER ERR] ${text}`);
  });

  serverProcess.on("exit", (code) => {
    log("Server exited with code", code);
    if (!mainWindow?.isDestroyed()) {
      app.quit();
    }
  });

  serverProcess.on("error", (err) => {
    logError("Server spawn error:", err.message);
    dialog.showErrorBox("启动失败", `无法启动服务器: ${err.message}`);
  });

  // 后备：即使服务器没输出 Ready，15 秒后也尝试打开窗口
  setTimeout(() => {
    if (!windowCreated) {
      log("Fallback timeout: creating window anyway");
      createWindow();
    }
  }, 15000);
}

// ===== 单实例锁定 =====
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  log("Another instance is already running, quitting...");
  app.quit();
} else {
  app.on("second-instance", () => {
    log("Second instance detected, focusing existing window");
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ===== Electron 生命周期 =====
app.whenReady().then(() => {
  log("Electron app ready");
  createTray();
  startServer();
});

app.on("window-all-closed", () => {
  log("All windows closed, quitting app");
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    log("Re-creating window on activate");
    createWindow();
  }
});

// 未捕获异常处理
process.on("uncaughtException", (err) => {
  logError("Uncaught exception:", err.message, err.stack);
});

process.on("unhandledRejection", (reason) => {
  logError("Unhandled rejection:", reason);
});
