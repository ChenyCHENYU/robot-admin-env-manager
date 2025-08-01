// src/env-manager.js - 重新设计的精致版本
const fs = require("fs");
const path = require("path");

// 🎨 精致的颜色系统
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",

  // 主题色
  primary: "\x1b[38;5;81m", // 亮青色
  secondary: "\x1b[38;5;141m", // 紫色
  accent: "\x1b[38;5;214m", // 橙色

  // 状态色
  success: "\x1b[38;5;82m", // 亮绿
  warning: "\x1b[38;5;220m", // 黄色
  error: "\x1b[38;5;196m", // 亮红
  info: "\x1b[38;5;117m", // 浅蓝

  // 中性色
  text: "\x1b[38;5;231m", // 白色
  textSecondary: "\x1b[38;5;250m", // 浅灰
  textMuted: "\x1b[38;5;243m", // 深灰
  border: "\x1b[38;5;240m", // 边框灰

  // 背景色
  bgPrimary: "\x1b[48;5;17m", // 深蓝背景
  bgSuccess: "\x1b[48;5;22m", // 深绿背景
};

// 🎭 现代化图标
const ICONS = {
  success: "✓",
  error: "✗",
  warning: "!",
  info: "i",
  rocket: "🚀",
  crown: "👑",
  heart: "❤️",
  star: "⭐",
  gear: "⚙️",
  folder: "📁",
  file: "📄",
  diamond: "◆",
  arrow: "→",
  dot: "•",
  check: "✓",
  sparkles: "✨",
};

const ENV_MAP = {
  dev: ".env.development",
  development: ".env.development",
  test: ".env.test",
  stage: ".env.staging",
  staging: ".env.staging",
  prod: ".env.production",
  production: ".env.production",
};

// 🎨 现代化样式工具
const style = {
  title: (text) => `${COLORS.bright}${COLORS.primary}${text}${COLORS.reset}`,
  subtitle: (text) => `${COLORS.textSecondary}${text}${COLORS.reset}`,
  success: (text) => `${COLORS.success}${text}${COLORS.reset}`,
  warning: (text) => `${COLORS.warning}${text}${COLORS.reset}`,
  error: (text) => `${COLORS.error}${text}${COLORS.reset}`,
  info: (text) => `${COLORS.info}${text}${COLORS.reset}`,
  accent: (text) => `${COLORS.accent}${text}${COLORS.reset}`,
  muted: (text) => `${COLORS.textMuted}${text}${COLORS.reset}`,
  bold: (text) => `${COLORS.bright}${COLORS.text}${text}${COLORS.reset}`,

  // 边框样式
  border: (text) => `${COLORS.border}${text}${COLORS.reset}`,

  // 组合样式
  badge: (icon, text, color = COLORS.primary) =>
    `${color}${icon}${COLORS.reset} ${COLORS.text}${text}${COLORS.reset}`,
};

// 🎨 精致的Banner设计
const createBanner = () => {
  const line1 = `${style.border("┌")}${style.border(
    "─".repeat(54)
  )}${style.border("┐")}`;
  const line2 = `${style.border("│")}${" ".repeat(54)}${style.border("│")}`;
  const line3 = `${style.border("│")}  ${style.title(
    "Robot Admin"
  )} ${style.muted("- 环境配置管理工具")} ${ICONS.sparkles}${" ".repeat(
    8
  )}${style.border("│")}`;
  const line4 = `${style.border("│")}  ${style.subtitle(
    "优雅的环境切换解决方案"
  )}${" ".repeat(20)}${style.border("│")}`;
  const line5 = `${style.border("└")}${style.border(
    "─".repeat(54)
  )}${style.border("┘")}`;

  return `\n${line1}\n${line2}\n${line3}\n${line4}\n${line2}\n${line5}`;
};

// 🎨 精致的消息框
const createMessageBox = (title, items, type = "info") => {
  const colors = {
    info: COLORS.info,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
  };

  const color = colors[type] || COLORS.info;
  const width = 50;

  let lines = [];
  lines.push(
    `${style.border("┌")}${style.border("─".repeat(width))}${style.border("┐")}`
  );
  lines.push(
    `${style.border("│")} ${color}${title}${COLORS.reset}${" ".repeat(
      width - title.length - 1
    )}${style.border("│")}`
  );
  lines.push(
    `${style.border("├")}${style.border("─".repeat(width))}${style.border("┤")}`
  );

  items.forEach((item) => {
    const cleanItem = item.replace(/\x1b\[[0-9;]*m/g, "");
    const padding = width - cleanItem.length - 1;
    lines.push(
      `${style.border("│")} ${item}${" ".repeat(
        Math.max(0, padding)
      )}${style.border("│")}`
    );
  });

  lines.push(
    `${style.border("└")}${style.border("─".repeat(width))}${style.border("┘")}`
  );

  return lines.join("\n");
};

// 🎨 精致的进度提示
const createProgressItem = (icon, text, status = "info") => {
  const statusColors = {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
    processing: COLORS.accent,
  };

  const color = statusColors[status] || COLORS.info;
  return `${color}${icon}${COLORS.reset} ${COLORS.textSecondary}│${COLORS.reset} ${COLORS.text}${text}${COLORS.reset}`;
};

// 🎨 现代化的成功卡片
const createSuccessCard = (envType, variableCount) => {
  const items = [
    `${style.badge(
      ICONS.check,
      `${envType.toUpperCase()} 环境`,
      COLORS.success
    )}`,
    `${style.badge(ICONS.gear, `${variableCount} 个环境变量`, COLORS.info)}`,
    `${style.badge(ICONS.sparkles, "配置已生效", COLORS.accent)}`,
  ];

  return createMessageBox("环境切换成功", items, "success");
};

// 📁 文件操作工具
const fileExists = (filePath) => fs.existsSync(filePath);
const readFile = (filePath) => fs.readFileSync(filePath, "utf8");
const writeFile = (filePath, content) =>
  fs.writeFileSync(filePath, content, "utf8");
const ensureDir = (dirPath) =>
  !fs.existsSync(dirPath) && fs.mkdirSync(dirPath, { recursive: true });

// 🔧 核心功能函数

const validateEnvType = (envType) => {
  const envFileName = ENV_MAP[envType];
  if (!envFileName) {
    throw new Error(
      `不支持的环境类型: ${envType}。支持: ${Object.keys(ENV_MAP).join(", ")}`
    );
  }
  return envFileName;
};

const mergeEnvContents = (
  baseContent = "",
  envContent = "",
  envType = "unknown"
) => {
  const header = [
    "# ✨ 自动生成的环境配置文件",
    `# 🚀 由 @robot-admin/env-manager 生成 (${envType} 环境)`,
    "# ⚠️  请勿手动编辑此文件",
    `# 📝 最后更新: ${new Date().toLocaleString("zh-CN")}`,
    "",
  ];

  const lines = [...header];
  const processedKeys = new Set();

  if (envContent.trim()) {
    lines.push("# ═══════════════ 环境特定配置 ═══════════════");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes("=") && !trimmed.startsWith("#")) {
        const [key] = trimmed.split("=");
        processedKeys.add(key.trim());
      }
      lines.push(line);
    });
    lines.push("");
  }

  if (baseContent.trim()) {
    lines.push("# ═══════════════ 通用配置 ═══════════════");
    baseContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes("=") && !trimmed.startsWith("#")) {
        const [key] = trimmed.split("=");
        if (processedKeys.has(key.trim())) {
          lines.push(`# ${line} # (被环境特定配置覆盖)`);
          return;
        }
      }
      lines.push(line);
    });
  }

  return lines.join("\n");
};

// 🎯 主要功能类
class EnvManager {
  constructor(options = {}) {
    this.config = {
      envsDir: options.envsDir || "envs",
      targetFile: options.targetFile || ".env",
      silent: options.silent || false,
      ...options,
    };
  }

  async switchEnvironment(envType) {
    return switchEnvironment(envType, this.config);
  }

  async scanEnvironmentFiles() {
    return scanEnvironments(this.config);
  }

  async initializeProject(options = {}) {
    return initProject({ ...this.config, ...options });
  }
}

// 🚀 核心功能实现

const switchEnvironment = async (envType, options = {}) => {
  const config = {
    envsDir: "envs",
    targetFile: ".env",
    silent: false,
    ...options,
  };

  if (!config.silent) {
    console.log(createBanner());
    console.log();
  }

  // 验证环境类型
  const envFileName = validateEnvType(envType);
  const envsDir = config.envsDir;
  const baseEnvFile = path.join(envsDir, ".env");
  const envSpecificFile = path.join(envsDir, envFileName);
  const targetFile = config.targetFile;

  // 检查文件
  if (!fileExists(envsDir)) {
    const error = `envs 目录不存在: ${envsDir}`;
    console.log(createProgressItem(ICONS.error, error, "error"));
    throw new Error(error);
  }

  if (!fileExists(envSpecificFile)) {
    const error = `环境配置文件不存在: ${envSpecificFile}`;
    console.log(createProgressItem(ICONS.error, error, "error"));
    throw new Error(error);
  }

  // 处理过程
  console.log(
    createProgressItem(
      ICONS.gear,
      `开始处理 ${style.accent(envType)} 环境`,
      "processing"
    )
  );

  let baseContent = "";
  if (fileExists(baseEnvFile)) {
    baseContent = readFile(baseEnvFile);
    console.log(createProgressItem(ICONS.check, "通用配置读取成功", "success"));
  }

  const envContent = readFile(envSpecificFile);
  console.log(createProgressItem(ICONS.check, "环境配置读取成功", "success"));

  console.log(createProgressItem(ICONS.gear, "合并配置文件", "processing"));
  const mergedContent = mergeEnvContents(baseContent, envContent, envType);

  console.log(createProgressItem(ICONS.gear, "写入环境文件", "processing"));
  writeFile(targetFile, mergedContent);

  const variableCount = (mergedContent.match(/^[^#\s].*=/gm) || []).length;

  console.log("\n" + createSuccessCard(envType, variableCount));
  console.log(
    `\n${style.success(ICONS.sparkles)} ${style.bold(
      "环境配置完成！"
    )} ${style.accent(ICONS.heart)}\n`
  );

  return { envType, targetFile, variableCount };
};

const scanEnvironments = (options = {}) => {
  const config = { envsDir: "envs", silent: false, ...options };

  if (!config.silent) {
    console.log(createBanner());
    console.log();
  }

  if (!fileExists(config.envsDir)) {
    const error = `envs 目录不存在: ${config.envsDir}`;
    console.log(createProgressItem(ICONS.error, error, "error"));
    return [];
  }

  const files = fs.readdirSync(config.envsDir);
  const envFiles = files.filter((file) => file.startsWith(".env"));

  if (envFiles.length === 0) {
    console.log(
      createProgressItem(ICONS.warning, "未找到任何环境文件", "warning")
    );
    return [];
  }

  const items = envFiles.map((file) => {
    const filePath = path.join(config.envsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    return `${style.badge(ICONS.file, file, COLORS.info)} ${style.muted(
      `(${sizeKB}KB)`
    )}`;
  });

  console.log(
    createMessageBox(`发现 ${envFiles.length} 个环境文件`, items, "info")
  );
  console.log();

  return envFiles.map((file) => ({
    name: file,
    path: path.join(config.envsDir, file),
    size: fs.statSync(path.join(config.envsDir, file)).size,
  }));
};

const initProject = (options = {}) => {
  const config = { envsDir: "envs", force: false, silent: false, ...options };

  if (!config.silent) {
    console.log(createBanner());
    console.log();
  }

  console.log(createProgressItem(ICONS.gear, "初始化环境配置", "processing"));

  ensureDir(config.envsDir);

  const templates = {
    ".env": "# 通用配置\nAPP_NAME=Robot Admin\nAPP_VERSION=1.0.0\n",
    ".env.development":
      "# 开发环境\nNODE_ENV=development\nAPI_URL=http://localhost:3000\nDEBUG=true\n",
    ".env.test":
      "# 测试环境\nNODE_ENV=test\nAPI_URL=http://test-api.example.com\nDEBUG=false\n",
    ".env.staging":
      "# 预发布环境\nNODE_ENV=staging\nAPI_URL=https://staging-api.example.com\nDEBUG=false\n",
    ".env.production":
      "# 生产环境\nNODE_ENV=production\nAPI_URL=https://api.example.com\nDEBUG=false\n",
  };

  const createdFiles = [];
  Object.entries(templates).forEach(([filename, content]) => {
    const filePath = path.join(config.envsDir, filename);

    if (!config.force && fileExists(filePath)) {
      console.log(
        createProgressItem(ICONS.warning, `文件已存在: ${filename}`, "warning")
      );
      return;
    }

    writeFile(filePath, content);
    console.log(
      createProgressItem(ICONS.check, `创建文件: ${filename}`, "success")
    );
    createdFiles.push(filename);
  });

  const usageItems = [
    `${style.accent("env-manager dev")}     ${style.muted("切换开发环境")}`,
    `${style.accent("env-manager prod")}    ${style.muted("切换生产环境")}`,
    `${style.accent("env-manager --scan")}  ${style.muted("扫描环境文件")}`,
  ];

  console.log("\n" + createMessageBox("使用说明", usageItems, "info"));
  console.log(
    `\n${style.success(ICONS.sparkles)} ${style.bold(
      "初始化完成！"
    )} ${style.accent(ICONS.heart)}\n`
  );

  return { envsDir: config.envsDir, filesCreated: createdFiles };
};

// 导出
module.exports = EnvManager;
module.exports.switchEnvironment = switchEnvironment;
module.exports.scanEnvironments = scanEnvironments;
module.exports.initProject = initProject;
module.exports.validateEnvType = validateEnvType;
module.exports.mergeEnvContents = mergeEnvContents;
