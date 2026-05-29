const fs = require("fs");
const path = require("path");

const COMPONENTS = [
  "AppShell.tsx",
  "ChatInput.tsx",
  "ChatWindow.tsx",
  "SessionSidebar.tsx",
  "MessageView.tsx",
  "ModelsConfig.tsx",
  "SkillsConfig.tsx",
  "ToolPanel.tsx",
  "FileViewer.tsx",
  "TabBar.tsx",
  "BranchNavigator.tsx",
];

const IMPORT_LINE = `import { useTranslation } from "@/lib/i18n";`;

function addImport(content) {
  if (content.includes("useTranslation")) return content;
  // Insert after "use client"; or first import
  const useClient = content.indexOf('"use client";');
  if (useClient !== -1) {
    const after = content.indexOf("\n", useClient) + 1;
    return content.slice(0, after) + IMPORT_LINE + "\n" + content.slice(after);
  }
  return IMPORT_LINE + "\n" + content;
}

function addHook(content, funcName) {
  const pattern = new RegExp(`(export (function|const) ${funcName}(\\s*<[^>]*>)?\\s*\\(\\s*\\{?)`);
  if (content.includes("const t = useTranslation()")) return content;
  // Find the opening brace of the function
  const match = content.match(new RegExp(`(export (function|const) ${funcName}[^\\{]*\\{)`));
  if (!match) return content;
  const idx = match.index + match[0].length;
  return content.slice(0, idx) + "\n  const t = useTranslation();" + content.slice(idx);
}

const REPLACEMENTS = {
  'AppShell.tsx': [
    [/label: "Models"/g, 'label: t.models'],
    [/label: "Skills"/g, 'label: t.skills'],
    [/title=\{sidebarOpen \? "Hide sidebar" : "Show sidebar"\}/g, 'title={sidebarOpen ? t.hideSidebar : t.showSidebar}'],
    [/title=\{isDark \? "Switch to light mode" : "Switch to dark mode"\}/g, 'title={isDark ? t.switchToLightMode : t.switchToDarkMode}'],
    [/aria-label=\{isDark \? "Switch to light mode" : "Switch to dark mode"\}/g, 'aria-label={isDark ? t.switchToLightMode : t.switchToDarkMode}'],
    [/<span>System<\/span>/g, '<span>{t.system}</span>'],
    [/<div[^>]*>Get Started<\/div>/g, '<div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{t.getStarted}</div>'],
    [/Select a session from the sidebar/g, '{t.selectSessionFromSidebar}'],
    [/Select a project directory from the sidebar/g, '{t.selectProjectDir}'],
    [/Add models via the <strong[^>]*>Models<\/strong> button at the bottom/g, '{t.addModelsViaButton}'],
    [/No file open/g, '{t.noFileOpen}'],
    [/title=\{rightPanelOpen \? "Hide file panel" : "Show file panel"\}/g, 'title={rightPanelOpen ? t.hideFilePanel : t.showFilePanel}'],
  ],
  'ChatInput.tsx': [
    [/placeholder=\{\s*isStreaming && \(onSteer \|\| onFollowUp\)\s*\?\s*"Steer 立即注入 \/ Follow-up 排队…"/g, 'placeholder={isStreaming && (onSteer || onFollowUp) ? t.steer + " / " + t.followUp + "…"'],
    [/"Agent is running…"/g, '"{t.agentIsRunning}"'],
    [/"Message…"/g, '"{t.messagePlaceholder}"'],
    [/title="Attach image"/g, 'title={t.attachImage}'],
    [/title="打断 Agent 当前运行，立即注入消息"/g, 'title={t.steerDesc}'],
    [/title="在 Agent 完成后排队发送"/g, 'title={t.followUpDesc}'],
    [/>Send</g, '>{t.send}<'],
    [/>Steer</g, '>{t.steer}<'],
    [/>Follow-up</g, '>{t.followUp}<'],
    [/>Stop</g, '>{t.stop}<'],
    [/title="停止 Agent"/g, 'title={t.stop}'],
    [/title="切换推理强度"/g, 'title={t.thinkingLevel}'],
    [/title="切换工具预设"/g, 'title={t.toolPreset}'],
    [/>Compacting…</g, '>{t.compacting}<'],
    [/>Compact</g, '>{t.compact}<'],
    [/title=\{isCompacting \? "停止压缩" : "压缩上下文"\}/g, 'title={isCompacting ? t.abortCompactDesc : t.compactDesc}'],
    [/title=\{soundEnabled \? "关闭完成提示音" : "开启完成提示音"\}/g, 'title={soundEnabled ? t.soundOffDesc : t.soundOnDesc}'],
    [/"Retrying \(/g, '"{t.retrying('],
  ],
  'ChatWindow.tsx': [
    [/>Loading session\.\.\.<\/div>/g, '>{t.loadingSession}</div>'],
    [/"Running tool\.\.\."/g, '"{t.runningTool([])}"'],
    [/"Waiting for model\.\.\."/g, '"{t.waitingForModel}"'],
    [/"Thinking\.\.\."/g, '"{t.thinking}"'],
    [/function phaseLabel\(phase: AgentPhase\): string \{/g, 'function phaseLabel(phase: AgentPhase, t: Dict): string {'],
    [/if \(names\.length === 0\) return "Running tool\.\.\.";/g, 'if (names.length === 0) return t.runningTool([]);'],
    [/if \(names\.length === 1\) return `Running \$\{names\[0\]\}…`;/g, 'if (names.length === 1) return t.runningTool(names);'],
    [/if \(names\.length <= 3\) return `Running \$\{names\.join\(", "\)\}…`;/g, 'if (names.length <= 3) return t.runningTool(names);'],
    [/return `Running \$\{names\.slice\(0, 2\)\.join\(", "\)\} \(\+\$\{names\.length - 2\}\)…`;/g, 'return t.runningTool(names);'],
    [/if \(phase\?\.kind === "waiting_model"\) return "Waiting for model\.\.\.";/g, 'if (phase?.kind === "waiting_model") return t.waitingForModel;'],
    [/return "Thinking\.\.\.";/g, 'return t.thinking;'],
    [/const TYPEWRITER_PHRASES = \[/g, 'const TYPEWRITER_PHRASES_EN = ['],
  ],
  'SessionSidebar.tsx': [
    [/>New</g, '>{t.new}<'],
    [/title=\{selectedCwd \? `New session in \$\{selectedCwd\}` : "Select a project first"\}/g, 'title={selectedCwd ? t.newSessionIn(selectedCwd) : t.selectProjectFirst}'],
    [/title="Refresh"/g, 'title={t.refresh}'],
    [/"Select project…"/g, '{t.selectProject}'],
    [/<span>Use default directory<\/span>/g, '<span>{t.useDefaultDir}</span>'],
    [/<span>Custom path…<\/span>/g, '<span>{t.customPath}</span>'],
    [/placeholder="\/path\/to\/project"/g, 'placeholder={t.pathPlaceholder}'],
    [/>Open</g, '>{t.open}<'],
    [/>Cancel</g, '>{t.cancel}<'],
    [/>Loading\.\.\.<\/div>/g, '>{t.loading}</div>'],
    [/No sessions found/g, '{t.noSessionsFound}'],
    [/>Explorer</g, '>{t.explorer}<'],
    [/title="Refresh explorer"/g, 'title={t.refreshExplorer}'],
    [/>Delete</g, '>{t.delete}<'],
    [/>Rename</g, '>{t.rename}<'],
    [/title=\{collapsed \? "Expand forks" : "Collapse forks"\}/g, 'title={collapsed ? t.expandForks : t.collapseForks}'],
    [/"Delete <span/g, '{t.deleteConfirm(title)} <span'],
    [/Delete <span/g, '{t.deleteConfirm(title)} <span'],
    [/if \(mins < 1\) return "just now";/g, 'if (mins < 1) return t.justNow;'],
    [/if \(mins < 60\) return `\$\{mins\}m ago`;/g, 'if (mins < 60) return t.minutesAgo(mins);'],
    [/if \(hours < 24\) return `\$\{hours\}h ago`;/g, 'if (hours < 24) return t.hoursAgo(hours);'],
    [/if \(days < 7\) return `\$\{days\}d ago`;/g, 'if (days < 7) return t.daysAgo(days);'],
    [/<span>\$\{session\.messageCount\} msgs<\/span>/g, '<span>{t.msgs(session.messageCount)}</span>'],
  ],
  'MessageView.tsx': [
    [/>Copied</g, '>{t.copied}<'],
    [/>Copy</g, '>{t.copy}<'],
    [/title="Copy message"/g, 'title={t.copyMessage}'],
    [/title="Edit from here — branches within this session"/g, 'title={t.editFromHere}'],
    [/title=\{forking \? "Creating new session…" : "New session — creates an independent copy from here"\}/g, 'title={forking ? t.creatingNewSession : t.newSessionFork}'],
    [/title="预估 token 数（流式接收中）"/g, 'title={t.tokenCount}'],
    [/title=\{wrapLines \? "Disable word wrap" : "Enable word wrap"\}/g, 'title={wrapLines ? t.disableWrap : t.enableWrap}'],
    [/title=\{watching \? "Live sync active" : "Not watching"\}/g, 'title={watching ? t.liveSyncActive : t.notWatching}'],
    [/title="Close"/g, 'title={t.close}'],
  ],
  'ModelsConfig.tsx': [
    [/return \["Connected"/g, 'return [t.connected'],
    [/return \["Failed"/g, 'return [t.failed'],
    [/>Testing…</g, '>{t.testing}<'],
    [/>OK</g, '>{t.ok}<'],
    [/>Test</g, '>{t.test}<'],
    [/title="Test model connection"/g, 'title={t.testModelConnection}'],
    [/>Re-login</g, '>{t.reLogin}<'],
    [/>Login</g, '>{t.login}<'],
    [/>Disconnect</g, '>{t.disconnect}<'],
    [/placeholder="Search providers…"/g, 'placeholder={t.searchProviders}'],
    [/label="Provider name"/g, 'label={t.providerName}'],
    [/label="Base URL"/g, 'label={t.baseUrl}'],
    [/label="API Key"/g, 'label={t.apiKey}'],
    [/label="API"/g, 'label={t.api}'],
    [/label="API override"/g, 'label={t.apiOverride}'],
    [/label="Reasoning \/ thinking"/g, 'label={t.reasoning}'],
    [/label="Image input"/g, 'label={t.imageInput}'],
    [/label="DeepSeek thinking compat"/g, 'label={t.deepseekCompat}'],
    [/label="Context window \(tokens\)"/g, 'label={t.contextWindow}'],
    [/label="Max output tokens"/g, 'label={t.maxOutputTokens}'],
    [/>Display name</g, '>{t.displayName}<'],
    [/placeholder="Display name"/g, 'placeholder={t.displayName}'],
    [/>Model ID</g, '>{t.modelId}<'],
    [/placeholder="model-id"/g, 'placeholder={t.modelId}'],
    [/placeholder="https:\/\/api\.example\.com\/v1"/g, 'placeholder="https://api.example.com/v1"'],
    [/placeholder="ENV_VAR_NAME, !shell-command, or literal key"/g, 'placeholder={t.apiKeyEnvVar}'],
    [/placeholder="sk-…"/g, 'placeholder={t.enterApiKey}'],
    [/placeholder="Enter new key to replace…"/g, 'placeholder={t.enterNewKey}'],
    [/aria-label=\{visible \? "Hide API key" : "Show API key"\}/g, 'aria-label={visible ? t.hideApiKey : t.showApiKey}'],
    [/title=\{visible \? "Hide API key" : "Show API key"\}/g, 'title={visible ? t.hideApiKey : t.showApiKey}'],
    [/>Save</g, '>{t.save}<'],
    [/>Remove</g, '>{t.remove}<'],
    [/>Add provider</g, '>{t.addProvider}<'],
    [/"Already connected\. You can re-login or disconnect\."/g, '{t.alreadyConnected}'],
    [/\`Connect your \$\{provider\.name\} account\.\`/g, '{t.connectAccount(provider.name)}'],
    [/"Connection lost"/g, '{t.connectionLost}'],
    [/"Network error"/g, '{t.networkError}'],
    [/"Verifying…"/g, '{t.verifying}'],
    [/"Continuing…"/g, '{t.continuing}'],
    [/"No providers configured"/g, '{t.noProviders}'],
    [/"No models"/g, '{t.noModels}'],
    [/"Add an API key or log in to enable this provider\."/g, '{t.addKeyOrLogin}'],
    [/"Configured"/g, '{t.configured}'],
    [/"Not configured"/g, '{t.notConfigured}'],
    [/"Custom model"/g, '{t.customModel}'],
    [/>Headers</g, '>{t.headers}<'],
  ],
  'SkillsConfig.tsx': [
    [/>Install</g, '>{t.install}<'],
    [/placeholder="e\.g\. react, testing, deploy"/g, 'placeholder={t.searchSkills}'],
    [/>Add skill</g, '>{t.addSkill}<'],
    [/"No skills found"/g, '{t.noSkillsFound}'],
    [/"Manage skills for this project"/g, '{t.skillsDesc}'],
  ],
  'ToolPanel.tsx': [
    [/label: "Off"/g, 'label: t.off'],
    [/label: "Low"/g, 'label: t.low'],
    [/label: "High"/g, 'label: t.high'],
    [/desc: "No tools"/g, 'desc: t.noTools'],
    [/desc: "read · bash · edit · write"/g, 'desc: t.presetDefault'],
    [/desc: "read · bash · edit · write · grep · find · ls"/g, 'desc: t.presetFull'],
  ],
  'FileViewer.tsx': [
    [/title=\{wrapLines \? "Disable word wrap" : "Enable word wrap"\}/g, 'title={wrapLines ? t.disableWrap : t.enableWrap}'],
    [/title=\{watching \? "Live sync active" : "Not watching"\}/g, 'title={watching ? t.liveSyncActive : t.notWatching}'],
  ],
  'TabBar.tsx': [
    [/title="Close"/g, 'title={t.close}'],
  ],
  'BranchNavigator.tsx': [
    [/\{role === "user" \? "U" : "A"\}/g, '{role === "user" ? t.user : t.assistant}'],
  ],
};

for (const file of COMPONENTS) {
  const filePath = path.join(__dirname, "..", "components", file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skip ${file} (not found)`);
    continue;
  }
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Add import
  content = addImport(content);

  // Add hook for known function names
  const funcMatch = content.match(/export (function|const) (\w+)/);
  if (funcMatch) {
    content = addHook(content, funcMatch[2]);
  }

  // Apply replacements
  const reps = REPLACEMENTS[file];
  if (reps) {
    for (const [from, to] of reps) {
      content = content.replace(from, to);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${file}`);
  } else {
    console.log(`No changes ${file}`);
  }
}

// Also handle system prompt strings in AppShell.tsx
const appShellPath = path.join(__dirname, "..", "components", "AppShell.tsx");
if (fs.existsSync(appShellPath)) {
  let c = fs.readFileSync(appShellPath, "utf8");
  c = c.replace('System prompt is empty (tools are disabled)', '{t.systemPromptEmpty}');
  c = c.replace('Send a message to load the system prompt', '{t.sendMessageToLoadSystemPrompt}');
  fs.writeFileSync(appShellPath, c, "utf8");
}

// Update layout metadata
const layoutPath = path.join(__dirname, "..", "app", "layout.tsx");
if (fs.existsSync(layoutPath)) {
  let c = fs.readFileSync(layoutPath, "utf8");
  c = c.replace('lang="auto"', 'lang={typeof window !== "undefined" ? (localStorage.getItem("pi-lang") || navigator.language || "en") : "en"}');
  // Actually lang attribute can't be dynamic in SSR easily. Leave as auto or use script.
  fs.writeFileSync(layoutPath, c, "utf8");
}

console.log("Done.");
