#!/usr/bin/env node
"use strict";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parseArgs } = require("util");

const pkgDir = path.join(__dirname, "..");
const nextDir = path.join(pkgDir, ".next");

// Resolve next's CLI entry directly to avoid relying on .bin symlinks (which
// may not exist when installed via npx).
let nextBin;
try {
  nextBin = require.resolve("next/dist/bin/next", { paths: [pkgDir] });
} catch {
  // Fallback: locate next package root and derive the bin path manually.
  try {
    const nextPkg = require.resolve("next/package.json", { paths: [pkgDir] });
    nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
  } catch {
    nextBin = path.join(pkgDir, "node_modules", "next", "dist", "bin", "next");
  }
}

const { values: cliArgs, positionals } = parseArgs({
  options: {
    port:     { type: "string", short: "p" },
    hostname: { type: "string", short: "H" },
    foreground: { type: "boolean", short: "f" },
  },
  strict: false,
});

const port     = cliArgs.port     ?? process.env.PORT     ?? "30141";
const hostname = cliArgs.hostname ?? process.env.HOSTNAME ?? null;
const foreground = cliArgs.foreground ?? positionals?.includes("--foreground") ?? positionals?.includes("-f") ?? false;

if (!fs.existsSync(nextDir)) {
  console.error("Build artifacts not found. Please report this issue.");
  process.exit(1);
}

const nextArgs = ["start", "-p", port];
if (hostname) nextArgs.push("-H", hostname);

const url = `http://${hostname ?? "localhost"}:${port}`;

function openBrowser() {
  const isWindows = process.platform === "win32";
  const isMac = process.platform === "darwin";
  const openCmd = isWindows ? "start" : isMac ? "open" : "xdg-open";
  spawn(openCmd, [url], { shell: isWindows, stdio: "ignore", detached: true }).unref();
}

if (foreground) {
  // Foreground mode — block the terminal (legacy behavior)
  let browserOpened = false;
  const child = spawn(process.execPath, [nextBin, ...nextArgs], {
    cwd: pkgDir,
    stdio: ["inherit", "pipe", "inherit"],
    env: { ...process.env },
  });
  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);
    if (!browserOpened && text.includes("Ready")) {
      browserOpened = true;
      openBrowser();
    }
  });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  // Background mode — detach, ignore stdio, print URL and exit
  const out = fs.openSync(path.join(pkgDir, ".next", "pi-web.out.log"), "a");
  const err = fs.openSync(path.join(pkgDir, ".next", "pi-web.err.log"), "a");

  const child = spawn(process.execPath, [nextBin, ...nextArgs], {
    cwd: pkgDir,
    stdio: ["ignore", out, err],
    env: { ...process.env },
    detached: true,
  });
  child.unref();

  // Open browser after a short delay (Next.js usually ready within 3s)
  setTimeout(() => openBrowser(), 1500);

  console.log(`Pi Agent Web running at ${url}  (PID ${child.pid})`);
  console.log(`Logs: .next/pi-web.out.log  .next/pi-web.err.log`);
  console.log(`Stop: taskkill /PID ${child.pid} /F   (Windows)  or  kill ${child.pid}   (Unix)`);
  process.exit(0);
}
