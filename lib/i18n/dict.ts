export type Lang = "zh" | "en";

export interface Dict {
  // AppShell
  models: string;
  skills: string;
  hideSidebar: string;
  showSidebar: string;
  switchToLightMode: string;
  switchToDarkMode: string;
  system: string;
  getStarted: string;
  selectSessionFromSidebar: string;
  selectProjectDir: string;
  addModelsViaButton: string;
  noFileOpen: string;
  hideFilePanel: string;
  showFilePanel: string;

  // ChatInput
  agentIsRunning: string;
  messagePlaceholder: string;
  send: string;
  steer: string;
  steerDesc: string;
  followUp: string;
  followUpDesc: string;
  stop: string;
  attachImage: string;
  retrying: (attempt: number, maxAttempts: number) => string;
  retryError: string;
  compacting: string;
  compact: string;
  compactDesc: string;
  abortCompactDesc: string;
  soundOnDesc: string;
  soundOffDesc: string;
  modelSelector: string;
  thinkingLevel: string;
  toolPreset: string;

  // ChatWindow
  loadingSession: string;
  runningTool: (names: string[]) => string;
  waitingForModel: string;
  thinking: string;

  // SessionSidebar
  new: string;
  newSessionIn: (cwd: string) => string;
  selectProjectFirst: string;
  refresh: string;
  refreshDone: string;
  selectProject: string;
  useDefaultDir: string;
  customPath: string;
  pathPlaceholder: string;
  open: string;
  cancel: string;
  loading: string;
  loadingFiles: string;
  empty: string;
  noSessionsFound: string;
  explorer: string;
  refreshExplorer: string;
  delete: string;
  rename: string;
  expandForks: string;
  collapseForks: string;
  deleteConfirm: (title: string) => string;
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
  msgs: (n: number) => string;
  forkedFrom: string;

  // MessageView
  copied: string;
  copy: string;
  copyMessage: string;
  creating: string;
  newSession: string;
  htmlPreview: string;
  editFromHere: string;
  creatingNewSession: string;
  newSessionFork: string;
  tokenCount: string;
  liveSyncActive: string;
  notWatching: string;
  disableWrap: string;
  enableWrap: string;
  close: string;
  failedToLoadImage: string;
  failedToLoadAudio: string;

  // ModelsConfig
  connected: string;
  failed: string;
  testing: string;
  ok: string;
  test: string;
  testModelConnection: string;
  testConnection: string;
  reLogin: string;
  login: string;
  disconnect: string;
  addProvider: string;
  searchProviders: string;
  saved: string;
  saving: string;
  removing: string;
  openingBrowser: string;
  searching: string;
  displayName: string;
  apiKey: string;
  hideApiKey: string;
  showApiKey: string;
  providerName: string;
  baseUrl: string;
  api: string;
  reasoning: string;
  imageInput: string;
  deepseekCompat: string;
  contextWindow: string;
  maxOutputTokens: string;
  costInput: string;
  costOutput: string;
  costCacheRead: string;
  costCacheWrite: string;
  alreadyConnected: string;
  connectAccount: (name: string) => string;
  verifying: string;
  connectionLost: string;
  networkError: string;
  continuing: string;
  customModel: string;
  noProviders: string;
  noModels: string;
  addKeyOrLogin: string;
  configured: string;
  notConfigured: string;
  enterApiKey: string;
  enterNewKey: string;
  save: string;
  remove: string;
  modelId: string;
  apiOverride: string;
  headers: string;
  apiKeyEnvVar: string;

  // SkillsConfig
  install: string;
  addSkill: string;
  searchSkills: string;
  noSkillsFound: string;
  installSkill: string;
  installing: string;
  installed: string;
  skillsDesc: string;
  visibleInPrompt: string;
  hiddenFromPrompt: string;

  // ToolPanel
  off: string;
  low: string;
  high: string;
  noTools: string;
  presetDefault: string;
  presetFull: string;

  // System prompt
  systemPromptEmpty: string;
  sendMessageToLoadSystemPrompt: string;

  // Thinking levels
  thinkingAuto: string;
  thinkingOff: string;
  thinkingMinimal: string;
  thinkingLow: string;
  thinkingMedium: string;
  thinkingHigh: string;
  thinkingXHigh: string;

  // Tool presets
  toolPresetOff: string;
  toolPresetDefault: string;
  toolPresetFull: string;

  // BranchNavigator
  user: string;
  assistant: string;
  noActiveSession: string;
  noBranches: string;

  // Typewriter phrases
  readyWhenYouAre: string;
  askMeAnything: string;
  letsBuildSomethingCool: string;
  exploreYourCodebase: string;
  draftAnEmail: string;
  summarizeThatPaper: string;
  planYourWeekend: string;
  explainItLikeImFive: string;
  pairProgramWithMe: string;
  fixThatPeskyBug: string;
  translateToChinese: string;
  writeAHaiku: string;
  brainstormIdeas: string;
  reviewMyPullRequest: string;
  whatShouldWeCookTonight: string;
  shipIt: string;
  makeItPretty: string;
  rubberDuckWithMe: string;

  // Typewriter phrases array (ordered)
  typewriterPhrases: string[];

  // App metadata
  appTitle: string;
  appDescription: string;
}

const en: Dict = {
  models: "Models",
  skills: "Skills",
  hideSidebar: "Hide sidebar",
  showSidebar: "Show sidebar",
  switchToLightMode: "Switch to light mode",
  switchToDarkMode: "Switch to dark mode",
  system: "System",
  getStarted: "Get Started",
  selectSessionFromSidebar: "Select a session from the sidebar",
  selectProjectDir: "Select a project directory from the sidebar",
  addModelsViaButton: "Add models via the Models button at the bottom",
  noFileOpen: "No file open",
  hideFilePanel: "Hide file panel",
  showFilePanel: "Show file panel",

  agentIsRunning: "Agent is running…",
  messagePlaceholder: "Message…",
  send: "Send",
  steer: "Steer",
  steerDesc: "Interrupt Agent and inject message immediately",
  followUp: "Follow-up",
  followUpDesc: "Queue message to send after Agent finishes",
  stop: "Stop",
  attachImage: "Attach image",
  retrying: (a, m) => `Retrying (${a}/${m})…`,
  retryError: "—",
  compacting: "Compacting…",
  compact: "Compact",
  compactDesc: "Compact context",
  abortCompactDesc: "Stop compacting",
  soundOnDesc: "Turn on completion sound",
  soundOffDesc: "Turn off completion sound",
  modelSelector: "Model selector",
  thinkingLevel: "Thinking level",
  toolPreset: "Tool preset",

  loadingSession: "Loading session…",
  runningTool: (names) => {
    if (names.length === 0) return "Running tool…";
    if (names.length === 1) return `Running ${names[0]}…`;
    if (names.length <= 3) return `Running ${names.join(", ")}…`;
    return `Running ${names.slice(0, 2).join(", ")} (+${names.length - 2})…`;
  },
  waitingForModel: "Waiting for model…",
  thinking: "Thinking…",

  new: "New",
  newSessionIn: (cwd) => `New session in ${cwd}`,
  selectProjectFirst: "Select a project first",
  refresh: "Refresh",
  refreshDone: "Refreshed",
  selectProject: "Select project…",
  useDefaultDir: "Use default directory",
  customPath: "Custom path…",
  pathPlaceholder: "/path/to/project",
  open: "Open",
  cancel: "Cancel",
  loading: "Loading…",
  loadingFiles: "Loading files…",
  empty: "empty",
  noSessionsFound: "No sessions found",
  explorer: "Explorer",
  refreshExplorer: "Refresh explorer",
  delete: "Delete",
  rename: "Rename",
  expandForks: "Expand forks",
  collapseForks: "Collapse forks",
  deleteConfirm: (title) => `Delete "${title.slice(0, 22)}${title.length > 22 ? "…" : ""}"?`,
  justNow: "just now",
  minutesAgo: (n) => `${n}m ago`,
  hoursAgo: (n) => `${n}h ago`,
  daysAgo: (n) => `${n}d ago`,
  msgs: (n) => `${n} msgs`,
  forkedFrom: "forked from",

  copied: "Copied",
  copy: "Copy",
  copyMessage: "Copy message",
  creating: "Creating…",
  newSession: "New session",
  htmlPreview: "HTML preview",
  editFromHere: "Edit from here — branches within this session",
  creatingNewSession: "Creating new session…",
  newSessionFork: "New session — creates an independent copy from here",
  tokenCount: "Token count (streaming)",
  liveSyncActive: "Live sync active",
  notWatching: "Not watching",
  disableWrap: "Disable word wrap",
  enableWrap: "Enable word wrap",
  close: "Close",
  failedToLoadImage: "Failed to load image",
  failedToLoadAudio: "Failed to load audio",

  connected: "Connected",
  failed: "Failed",
  testing: "Testing…",
  ok: "OK",
  test: "Test",
  testModelConnection: "Test model connection",
  testConnection: "Test connection",
  reLogin: "Re-login",
  login: "Login",
  disconnect: "Disconnect",
  addProvider: "Add provider",
  searchProviders: "Search providers…",
  saved: "Saved",
  saving: "Saving…",
  removing: "Removing…",
  openingBrowser: "Opening browser…",
  searching: "Searching…",
  displayName: "Display name",
  apiKey: "API Key",
  hideApiKey: "Hide API key",
  showApiKey: "Show API key",
  providerName: "Provider name",
  baseUrl: "Base URL",
  api: "API",
  reasoning: "Reasoning / thinking",
  imageInput: "Image input",
  deepseekCompat: "DeepSeek thinking compat",
  contextWindow: "Context window (tokens)",
  maxOutputTokens: "Max output tokens",
  costInput: "Input",
  costOutput: "Output",
  costCacheRead: "Cache read",
  costCacheWrite: "Cache write",
  alreadyConnected: "Already connected. You can re-login or disconnect.",
  connectAccount: (name) => `Connect your ${name} account.`,
  verifying: "Verifying…",
  connectionLost: "Connection lost",
  networkError: "Network error",
  continuing: "Continuing…",
  customModel: "Custom model",
  noProviders: "No providers configured",
  noModels: "No models",
  addKeyOrLogin: "Add an API key or log in to enable this provider.",
  configured: "Configured",
  notConfigured: "Not configured",
  enterApiKey: "sk-…",
  enterNewKey: "Enter new key to replace…",
  save: "Save",
  remove: "Remove",
  modelId: "Model ID",
  apiOverride: "API override",
  headers: "Headers",
  apiKeyEnvVar: "ENV_VAR_NAME, !shell-command, or literal key",

  install: "Install",
  addSkill: "Add skill",
  searchSkills: "Search skills…",
  noSkillsFound: "No skills found",
  installSkill: "Install skill",
  installing: "Installing…",
  installed: "Installed",
  skillsDesc: "Manage skills for this project",
  visibleInPrompt: "Visible in model prompt — click to disable",
  hiddenFromPrompt: "Hidden from model prompt — click to enable",

  off: "Off",
  low: "Low",
  high: "High",
  noTools: "No tools",
  presetDefault: "read · bash · edit · write",
  presetFull: "read · bash · edit · write · grep · find · ls",

  systemPromptEmpty: "System prompt is empty (tools are disabled)",
  sendMessageToLoadSystemPrompt: "Send a message to load the system prompt",

  thinkingAuto: "auto",
  thinkingOff: "off",
  thinkingMinimal: "minimal",
  thinkingLow: "low",
  thinkingMedium: "medium",
  thinkingHigh: "high",
  thinkingXHigh: "xhigh",

  toolPresetOff: "No tools, chat only",
  toolPresetDefault: "4 built-in tools",
  toolPresetFull: "All built-in tools",

  user: "U",
  assistant: "A",
  noActiveSession: "No active session",
  noBranches: "This session has no branches",

  readyWhenYouAre: "ready when you are.",
  askMeAnything: "ask me anything.",
  letsBuildSomethingCool: "let's build something cool.",
  exploreYourCodebase: "explore your codebase.",
  draftAnEmail: "draft an email.",
  summarizeThatPaper: "summarize that paper.",
  planYourWeekend: "plan your weekend.",
  explainItLikeImFive: "explain it like I'm five.",
  pairProgramWithMe: "pair-program with me.",
  fixThatPeskyBug: "fix that pesky bug.",
  translateToChinese: "translate to 中文.",
  writeAHaiku: "write a haiku.",
  brainstormIdeas: "brainstorm ideas.",
  reviewMyPullRequest: "review my pull request.",
  whatShouldWeCookTonight: "what should we cook tonight?",
  shipIt: "ship it.",
  makeItPretty: "make it pretty.",
  rubberDuckWithMe: "rubber-duck with me.",

  typewriterPhrases: [
    "ready when you are.",
    "ask me anything.",
    "let's build something cool.",
    "explore your codebase.",
    "draft an email.",
    "summarize that paper.",
    "plan your weekend.",
    "explain it like I'm five.",
    "pair-program with me.",
    "fix that pesky bug.",
    "translate to 中文.",
    "write a haiku.",
    "brainstorm ideas.",
    "review my pull request.",
    "what should we cook tonight?",
    "ship it.",
    "make it pretty.",
    "rubber-duck with me.",
  ],

  appTitle: "Pi Agent Web",
  appDescription: "Pi Coding Agent Web Interface",
};

const zh: Dict = {
  models: "模型",
  skills: "技能",
  hideSidebar: "隐藏侧边栏",
  showSidebar: "显示侧边栏",
  switchToLightMode: "切换浅色模式",
  switchToDarkMode: "切换深色模式",
  system: "系统",
  getStarted: "开始使用",
  selectSessionFromSidebar: "从侧边栏选择一个会话",
  selectProjectDir: "从侧边栏选择一个项目目录",
  addModelsViaButton: "通过底部的「模型」按钮添加模型",
  noFileOpen: "未打开文件",
  hideFilePanel: "隐藏文件面板",
  showFilePanel: "显示文件面板",

  agentIsRunning: "Agent 运行中…",
  messagePlaceholder: "输入消息…",
  send: "发送",
  steer: "介入",
  steerDesc: "打断 Agent 当前运行，立即注入消息",
  followUp: "跟进",
  followUpDesc: "在 Agent 完成后排队发送",
  stop: "停止",
  attachImage: "附加图片",
  retrying: (a, m) => `重试中 (${a}/${m})…`,
  retryError: "—",
  compacting: "压缩中…",
  compact: "压缩",
  compactDesc: "压缩上下文",
  abortCompactDesc: "停止压缩",
  soundOnDesc: "开启完成提示音",
  soundOffDesc: "关闭完成提示音",
  modelSelector: "模型选择",
  thinkingLevel: "推理强度",
  toolPreset: "工具预设",

  loadingSession: "加载会话中…",
  runningTool: (names) => {
    if (names.length === 0) return "运行工具中…";
    if (names.length === 1) return `运行 ${names[0]} 中…`;
    if (names.length <= 3) return `运行 ${names.join("、")} 中…`;
    return `运行 ${names.slice(0, 2).join("、")} (+${names.length - 2}) 中…`;
  },
  waitingForModel: "等待模型响应…",
  thinking: "思考中…",

  new: "新建",
  newSessionIn: (cwd) => `在 ${cwd} 新建会话`,
  selectProjectFirst: "请先选择项目",
  refresh: "刷新",
  refreshDone: "已刷新",
  selectProject: "选择项目…",
  useDefaultDir: "使用默认目录",
  customPath: "自定义路径…",
  pathPlaceholder: "/path/to/project",
  open: "打开",
  cancel: "取消",
  loading: "加载中…",
  loadingFiles: "加载文件中…",
  empty: "空",
  noSessionsFound: "未找到会话",
  explorer: "资源管理器",
  refreshExplorer: "刷新资源管理器",
  delete: "删除",
  rename: "重命名",
  expandForks: "展开分支",
  collapseForks: "折叠分支",
  deleteConfirm: (title) => `删除「${title.slice(0, 22)}${title.length > 22 ? "…" : ""}」？`,
  justNow: "刚刚",
  minutesAgo: (n) => `${n} 分钟前`,
  hoursAgo: (n) => `${n} 小时前`,
  daysAgo: (n) => `${n} 天前`,
  msgs: (n) => `${n} 条消息`,
  forkedFrom: "派生自",

  copied: "已复制",
  copy: "复制",
  copyMessage: "复制消息",
  creating: "创建中…",
  newSession: "新建会话",
  htmlPreview: "HTML 预览",
  editFromHere: "从此处编辑 — 在当前会话内创建分支",
  creatingNewSession: "创建新会话中…",
  newSessionFork: "新建会话 — 从此处创建独立副本",
  tokenCount: "预估 token 数（流式接收中）",
  liveSyncActive: "实时同步已启用",
  notWatching: "未启用实时同步",
  disableWrap: "禁用自动换行",
  enableWrap: "启用自动换行",
  close: "关闭",
  failedToLoadImage: "加载图片失败",
  failedToLoadAudio: "加载音频失败",

  connected: "已连接",
  failed: "失败",
  testing: "测试中…",
  ok: "确定",
  test: "测试",
  testModelConnection: "测试模型连接",
  testConnection: "测试连接",
  reLogin: "重新登录",
  login: "登录",
  disconnect: "断开连接",
  addProvider: "添加提供商",
  searchProviders: "搜索提供商…",
  saved: "已保存",
  saving: "保存中…",
  removing: "移除中…",
  openingBrowser: "正在打开浏览器…",
  searching: "搜索中…",
  displayName: "显示名称",
  apiKey: "API 密钥",
  hideApiKey: "隐藏 API 密钥",
  showApiKey: "显示 API 密钥",
  providerName: "提供商名称",
  baseUrl: "基础 URL",
  api: "API",
  reasoning: "推理 / 思考",
  imageInput: "图片输入",
  deepseekCompat: "DeepSeek 思考兼容",
  contextWindow: "上下文窗口（tokens）",
  maxOutputTokens: "最大输出 tokens",
  costInput: "输入",
  costOutput: "输出",
  costCacheRead: "缓存读取",
  costCacheWrite: "缓存写入",
  alreadyConnected: "已连接。你可以重新登录或断开连接。",
  connectAccount: (name) => `连接你的 ${name} 账户。`,
  verifying: "验证中…",
  connectionLost: "连接丢失",
  networkError: "网络错误",
  continuing: "继续中…",
  customModel: "自定义模型",
  noProviders: "未配置提供商",
  noModels: "无模型",
  addKeyOrLogin: "添加 API 密钥或登录以启用此提供商。",
  configured: "已配置",
  notConfigured: "未配置",
  enterApiKey: "sk-…",
  enterNewKey: "输入新密钥以替换…",
  save: "保存",
  remove: "移除",
  modelId: "模型 ID",
  apiOverride: "API 覆盖",
  headers: "请求头",
  apiKeyEnvVar: "ENV_VAR_NAME, !shell-command, 或字面密钥",

  install: "安装",
  addSkill: "添加技能",
  searchSkills: "搜索技能…",
  noSkillsFound: "未找到技能",
  installSkill: "安装技能",
  installing: "安装中…",
  installed: "已安装",
  skillsDesc: "管理此项目的技能",
  visibleInPrompt: "在模型提示中可见 — 点击禁用",
  hiddenFromPrompt: "在模型提示中隐藏 — 点击启用",

  off: "关闭",
  low: "低",
  high: "高",
  noTools: "无工具",
  presetDefault: "read · bash · edit · write",
  presetFull: "read · bash · edit · write · grep · find · ls",

  systemPromptEmpty: "系统提示为空（工具已禁用）",
  sendMessageToLoadSystemPrompt: "发送一条消息以加载系统提示",

  thinkingAuto: "自动",
  thinkingOff: "关闭",
  thinkingMinimal: "最少",
  thinkingLow: "低",
  thinkingMedium: "中",
  thinkingHigh: "高",
  thinkingXHigh: "最高",

  toolPresetOff: "无工具，纯聊天",
  toolPresetDefault: "4 项内置工具",
  toolPresetFull: "全部内置工具",

  user: "用户",
  assistant: "助手",
  noActiveSession: "无活动会话",
  noBranches: "此会话没有分支",

  readyWhenYouAre: "随时待命。",
  askMeAnything: "随便问。",
  letsBuildSomethingCool: "一起做点酷的东西。",
  exploreYourCodebase: "探索你的代码库。",
  draftAnEmail: "起草一封邮件。",
  summarizeThatPaper: "总结那篇论文。",
  planYourWeekend: "规划你的周末。",
  explainItLikeImFive: "用简单的方式解释。",
  pairProgramWithMe: "和我一起结对编程。",
  fixThatPeskyBug: "修复那个烦人的 Bug。",
  translateToChinese: "翻译成中文。",
  writeAHaiku: "写一首俳句。",
  brainstormIdeas: "头脑风暴。",
  reviewMyPullRequest: "审查我的 Pull Request。",
  whatShouldWeCookTonight: "今晚吃什么？",
  shipIt: "发布它。",
  makeItPretty: "让它更美观。",
  rubberDuckWithMe: "和我一起橡皮鸭调试。",

  typewriterPhrases: [
    "随时待命。",
    "随便问。",
    "一起做点酷的东西。",
    "探索你的代码库。",
    "起草一封邮件。",
    "总结那篇论文。",
    "规划你的周末。",
    "用简单的方式解释。",
    "和我一起结对编程。",
    "修复那个烦人的 Bug。",
    "翻译成中文。",
    "写一首俳句。",
    "头脑风暴。",
    "审查我的 Pull Request。",
    "今晚吃什么？",
    "发布它。",
    "让它更美观。",
    "和我一起橡皮鸭调试。",
  ],

  appTitle: "Pi Agent Web",
  appDescription: "Pi 编码助手 Web 界面",
};

export const dictionaries: Record<Lang, Dict> = { en, zh };

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || "en";
  return lang.startsWith("zh") ? "zh" : "en";
}
