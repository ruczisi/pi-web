const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// When running as pkg exe, __dirname is inside the virtual filesystem.
// Use process.execPath (the exe itself) to locate the real directory.
const pkgDir = path.dirname(process.execPath);
const nextDir = path.join(pkgDir, ".next");

if (!fs.existsSync(nextDir)) {
  console.error("Build artifacts not found. Please run 'npm run build' first.");
  console.error("Expected:", nextDir);
  process.exit(1);
}

// Locate next binary relative to package root
const nextBin = path.join(pkgDir, "node_modules", "next", "dist", "bin", "next");
if (!fs.existsSync(nextBin)) {
  console.error("Next.js not found. Please run 'npm install' first.");
  process.exit(1);
}

// Prefer a local Node 20+ runtime over the pkg-bundled Node 18
function findNode() {
  const localNode = path.join(pkgDir, "node.exe");
  if (fs.existsSync(localNode)) return localNode;

  const candidates = [
    "C:\\Program Files\\nodejs\\node.exe",
    "C:\\Program Files (x86)\\nodejs\\node.exe",
    "D:\\Program Files\\nodejs\\node.exe",
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return "node";
}

const nodeBin = findNode();
const port = process.env.PORT || "30141";
const url = `http://localhost:${port}`;

function openBrowser() {
  if (process.platform === "win32") {
    // Windows: "start "" <url>" — empty title as first arg
    spawn("cmd", ["/c", "start", "", url], {
      windowsHide: true,
      stdio: "ignore",
      detached: true,
    }).unref();
  } else if (process.platform === "darwin") {
    spawn("open", [url], { stdio: "ignore", detached: true }).unref();
  } else {
    spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref();
  }
}

console.log("============================================");
console.log("  Pi Agent Web 启动中...");
console.log("============================================");
console.log("");
console.log(`Node 运行时: ${nodeBin}`);
console.log(`工作目录:    ${pkgDir}`);
console.log(`服务地址:    ${url}`);
console.log("");
console.log("正在启动 Next.js 服务器，请稍候...");
console.log("浏览器将在就绪后自动打开。");
console.log("关闭本窗口即可停止应用。");
console.log("");

const child = spawn(nodeBin, [nextBin, "start", "-p", port], {
  cwd: pkgDir,
  stdio: ["ignore", "pipe", "inherit"],
  env: { ...process.env },
});

let browserOpened = false;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);

  if (!browserOpened && (text.includes("Ready") || text.includes("▲ Next.js"))) {
    browserOpened = true;
    setTimeout(() => {
      openBrowser();
      console.log("");
      console.log("============================================");
      console.log(`  应用已就绪: ${url}`);
      console.log("============================================");
    }, 500);
  }
});

child.on("exit", (code) => {
  console.log("");
  console.log(`服务器已退出 (code ${code ?? 0})`);
  process.exit(code ?? 0);
});
