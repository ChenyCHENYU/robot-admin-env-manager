// src/env-manager.js - 现代化精致CLI版本
const fs = require('fs')
const path = require('path')

// 🎨 现代化颜色系统 (更精致的色彩搭配)
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // 主色调 - 现代蓝紫色系 (更饱和)
  primary: '\x1b[38;2;56;139;253m',     // 现代蓝
  secondary: '\x1b[38;2;139;92;246m',   // 现代紫  
  accent: '\x1b[38;2;16;185;129m',      // 现代绿
  warning: '\x1b[38;2;245;158;11m',     // 现代黄
  error: '\x1b[38;2;244;63;94m',        // 现代红
  
  // 中性色 (更细腻的层次)
  white: '\x1b[38;2;248;250;252m',
  gray: '\x1b[38;2;148;163;184m',
  darkGray: '\x1b[38;2;71;85;105m',
  lightGray: '\x1b[38;2;203;213;225m',
  muted: '\x1b[38;2;100;116;139m',
  
  // 背景色
  bgDark: '\x1b[48;2;15;23;42m',
  bgLight: '\x1b[48;2;248;250;252m',
}

// 🎯 现代化图标 (精美的 Unicode 符号)
const icons = {
  // 状态图标 - 使用不同的精美符号
  success: '✓',     // 优雅的对勾
  error: '✕',       // 简洁的叉号
  warning: '⚠',     // 警告三角
  info: '◉',        // 实心圆点
  
  // 功能图标
  rocket: '▲',      
  folder: '📁',
  file: '📄',
  gear: '⚙',        // 更清晰的齿轮
  arrow: '→',       // 简洁箭头
  dot: '•',
  process: '◐',     // 处理中的半圆
  
  // 装饰图标
  sparkle: '✨',
  diamond: '◆',
  star: '★',
  brand: '◆',       // 品牌标识
}

const ENV_MAP = {
  dev: '.env.development', development: '.env.development', test: '.env.test',
  stage: '.env.staging', staging: '.env.staging', prod: '.env.production',
  production: '.env.production'
}

// 🎨 现代化样式工具 (更精致的排版)
const style = {
  // 文字样式
  title: (text) => `${colors.bold}${colors.white}${text}${colors.reset}`,
  subtitle: (text) => `${colors.muted}${text}${colors.reset}`,
  primary: (text) => `${colors.primary}${text}${colors.reset}`,
  success: (text) => `${colors.accent}${text}${colors.reset}`,
  warning: (text) => `${colors.warning}${text}${colors.reset}`,
  error: (text) => `${colors.error}${text}${colors.reset}`,
  muted: (text) => `${colors.muted}${text}${colors.reset}`,
  
  // 组合样式
  brand: (text) => `${colors.bold}${colors.primary}${text}${colors.reset}`,
  highlight: (text) => `${colors.bold}${colors.white}${text}${colors.reset}`,
  
  // 分隔线样式 - 更优雅的渐变效果
  divider: (width = 60) => `${colors.lightGray}${'─'.repeat(width)}${colors.reset}`,
  topDivider: (width = 60) => `${colors.lightGray}${'─'.repeat(width)}${colors.reset}`,
  bottomDivider: (width = 60) => `${colors.lightGray}${'─'.repeat(width)}${colors.reset}`,
}

// 🎨 现代化Banner - 精美的品牌展示
const createModernBanner = () => {
  // 获取真实版本号
  let version = 'v1.0.0'
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    version = `v${packageJson.version}`
  } catch {
    // 如果读取失败，使用默认版本
  }
  
  return `${style.brand('◆')} ${style.title('Robot Admin')} ${style.muted('— 环境配置管理工具')} ${style.primary(version)}`
}

// 🎨 现代化状态行 - 精美的状态指示 (优化对齐)
const createStatusLine = (icon, text, status = 'info', detail = '') => {
  const statusColors = {
    success: colors.accent,
    error: colors.error,
    warning: colors.warning,
    info: colors.primary,
    processing: colors.secondary
  }
  
  const color = statusColors[status]
  // 优化对齐：统一使用固定宽度
  const paddedText = text.padEnd(8, ' ')  // 确保文本对齐
  const detailText = detail ? ` ${style.muted(`→ ${detail}`)}` : ''
  
  return `   ${color}${icon}${colors.reset} ${colors.white}${paddedText}${colors.reset}${detailText}`
}

// 🎨 现代化成功卡片 - 精美的单行展示
const createSuccessCard = (envType, variableCount) => {
  const envDisplay = `${style.primary(envType.toUpperCase())}`
  const countDisplay = `${style.highlight(variableCount + ' 个变量')}`
  const statusDisplay = `${style.success('已生效')}`
  
  return `${style.success('✓')} ${style.highlight('环境切换成功')} ${style.muted('→')} ${envDisplay} ${style.muted('•')} ${countDisplay} ${style.muted('•')} ${statusDisplay}`
}

// 🎨 现代化文件列表 - 精美的文件展示 (优化对齐)
const createFileList = (files) => {
  const header = `${style.highlight('发现环境文件:')}`
  const items = files.map(file => {
    const stats = fs.statSync(file.path)
    const sizeKB = (stats.size / 1024).toFixed(1)
    const paddedName = file.name.padEnd(20, ' ')  // 文件名对齐
    return `   ${style.primary('◉')} ${style.highlight(paddedName)} ${style.muted(`→ ${sizeKB}KB`)}`
  })
  
  return `${header}\n${items.join('\n')}`
}

// 🎨 现代化使用说明 - 更简洁的帮助 (优化对齐)
const createUsageGuide = () => {
  const header = `${style.highlight('快速使用:')}`
  const commands = [
    `   ${style.primary('env-manager dev')}       ${style.muted('→ 开发环境')}`,
    `   ${style.primary('env-manager prod')}      ${style.muted('→ 生产环境')}`,
    `   ${style.primary('env-manager --scan')}    ${style.muted('→ 扫描文件')}`
  ]
  
  return `${header}\n${commands.join('\n')}`
}

// 🎨 精致的输出块包装器 - 更优雅的边框
const createOutputBlock = (content, title = '') => {
  const dividerWidth = 56
  const topLine = style.topDivider(dividerWidth)
  const bottomLine = style.bottomDivider(dividerWidth)
  
  let output = `\n${topLine}\n`
  
  if (title) {
    output += `${title}\n\n`
  }
  
  output += `${content}\n${bottomLine}\n`
  
  return output
}

// 📁 文件操作工具 (保持不变)
const fileExists = (filePath) => fs.existsSync(filePath)
const readFile = (filePath) => fs.readFileSync(filePath, 'utf8')
const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf8')
const ensureDir = (dirPath) => !fs.existsSync(dirPath) && fs.mkdirSync(dirPath, { recursive: true })

// 🔧 核心功能函数 (保持不变)
const validateEnvType = (envType) => {
  const envFileName = ENV_MAP[envType]
  if (!envFileName) {
    throw new Error(`不支持的环境类型: ${envType}。支持: ${Object.keys(ENV_MAP).join(', ')}`)
  }
  return envFileName
}

const mergeEnvContents = (baseContent = '', envContent = '', envType = 'unknown') => {
  const header = [
    '# ✨ 自动生成的环境配置文件',
    `# 🚀 由 @robot-admin/env-manager 生成 (${envType} 环境)`,
    '# ⚠️  请勿手动编辑此文件',
    `# 📝 最后更新: ${new Date().toLocaleString('zh-CN')}`,
    ''
  ]

  const lines = [...header]
  const processedKeys = new Set()

  if (envContent.trim()) {
    lines.push('# ═══════════════ 环境特定配置 ═══════════════')
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && trimmed.includes('=') && !trimmed.startsWith('#')) {
        const [key] = trimmed.split('=')
        processedKeys.add(key.trim())
      }
      lines.push(line)
    })
    lines.push('')
  }

  if (baseContent.trim()) {
    lines.push('# ═══════════════ 通用配置 ═══════════════')
    baseContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && trimmed.includes('=') && !trimmed.startsWith('#')) {
        const [key] = trimmed.split('=')
        if (processedKeys.has(key.trim())) {
          lines.push(`# ${line} # (被环境特定配置覆盖)`)
          return
        }
      }
      lines.push(line)
    })
  }

  return lines.join('\n')
}

// 🎯 主要功能类 (保持不变)
class EnvManager {
  constructor(options = {}) {
    this.config = {
      envsDir: options.envsDir || 'envs',
      targetFile: options.targetFile || '.env',
      silent: options.silent || false,
      ...options
    }
  }

  async switchEnvironment(envType) {
    return switchEnvironment(envType, this.config)
  }

  async scanEnvironmentFiles() {
    return scanEnvironments(this.config)
  }

  async initializeProject(options = {}) {
    return initProject({ ...this.config, ...options })
  }
}

// 🚀 核心功能实现 (只调整输出样式)

const switchEnvironment = async (envType, options = {}) => {
  const config = { envsDir: 'envs', targetFile: '.env', silent: false, ...options }
  
  // 验证环境类型
  const envFileName = validateEnvType(envType)
  const envsDir = config.envsDir
  const baseEnvFile = path.join(envsDir, '.env')
  const envSpecificFile = path.join(envsDir, envFileName)
  const targetFile = config.targetFile

  // 构建输出内容 - 更精致的布局
  let outputContent = createModernBanner()

  // 检查文件
  if (!fileExists(envsDir)) {
    const error = `envs 目录不存在: ${envsDir}`
    outputContent += `\n\n${createStatusLine(icons.error, error, 'error')}`
    
    if (!config.silent) {
      console.log(createOutputBlock(outputContent))
    }
    throw new Error(error)
  }

  if (!fileExists(envSpecificFile)) {
    const error = `环境配置文件不存在: ${envSpecificFile}`
    outputContent += `\n\n${createStatusLine(icons.error, error, 'error')}`
    
    if (!config.silent) {
      console.log(createOutputBlock(outputContent))
    }
    throw new Error(error)
  }

  // 精致的处理过程显示
  outputContent += `\n\n${createStatusLine(icons.process, '开始处理', 'processing', `${envType} 环境`)}`

  let baseContent = ''
  if (fileExists(baseEnvFile)) {
    baseContent = readFile(baseEnvFile)
    outputContent += `\n${createStatusLine(icons.success, '通用配置', 'success', '读取成功')}`
  }

  const envContent = readFile(envSpecificFile)
  outputContent += `\n${createStatusLine(icons.success, '环境配置', 'success', '读取成功')}`

  outputContent += `\n${createStatusLine(icons.gear, '合并配置', 'processing', '已完成')}`
  const mergedContent = mergeEnvContents(baseContent, envContent, envType)
  
  outputContent += `\n${createStatusLine(icons.gear, '写入文件', 'processing', '已完成')}`
  writeFile(targetFile, mergedContent)

  const variableCount = (mergedContent.match(/^[^#\s].*=/gm) || []).length
  
  // 精致的单行成功展示
  outputContent += `\n\n${createSuccessCard(envType, variableCount)}`

  if (!config.silent) {
    console.log(createOutputBlock(outputContent))
  }

  return { envType, targetFile, variableCount }
}

const scanEnvironments = (options = {}) => {
  const config = { envsDir: 'envs', silent: false, ...options }
  
  let outputContent = createModernBanner()

  if (!fileExists(config.envsDir)) {
    const error = `envs 目录不存在: ${config.envsDir}`
    outputContent += `\n\n${createStatusLine(icons.error, error, 'error')}`
    
    if (!config.silent) {
      console.log(createOutputBlock(outputContent))
    }
    return []
  }

  const files = fs.readdirSync(config.envsDir)
  const envFiles = files.filter(file => file.startsWith('.env'))

  if (envFiles.length === 0) {
    outputContent += `\n\n${createStatusLine(icons.warning, '未找到环境文件', 'warning')}`
    
    if (!config.silent) {
      console.log(createOutputBlock(outputContent))
    }
    return []
  }

  const fileObjects = envFiles.map(file => ({
    name: file,
    path: path.join(config.envsDir, file),
    size: fs.statSync(path.join(config.envsDir, file)).size
  }))

  outputContent += `\n\n${createFileList(fileObjects)}`

  if (!config.silent) {
    console.log(createOutputBlock(outputContent))
  }

  return fileObjects
}

const initProject = (options = {}) => {
  const config = { envsDir: 'envs', force: false, silent: false, ...options }
  
  let outputContent = createModernBanner()
  outputContent += `\n\n${createStatusLine(icons.gear, '初始化项目', 'processing')}`

  ensureDir(config.envsDir)

  const templates = {
    '.env': '# 通用配置\nAPP_NAME=Robot Admin\nAPP_VERSION=1.0.0\n',
    '.env.development': '# 开发环境\nNODE_ENV=development\nAPI_URL=http://localhost:3000\nDEBUG=true\n',
    '.env.test': '# 测试环境\nNODE_ENV=test\nAPI_URL=http://test-api.example.com\nDEBUG=false\n',
    '.env.staging': '# 预发布环境\nNODE_ENV=staging\nAPI_URL=https://staging-api.example.com\nDEBUG=false\n',
    '.env.production': '# 生产环境\nNODE_ENV=production\nAPI_URL=https://api.example.com\nDEBUG=false\n'
  }

  const createdFiles = []
  Object.entries(templates).forEach(([filename, content]) => {
    const filePath = path.join(config.envsDir, filename)

    if (!config.force && fileExists(filePath)) {
      outputContent += `\n${createStatusLine(icons.warning, `${filename} 已存在`, 'warning', '跳过')}`
      return
    }

    writeFile(filePath, content)
    outputContent += `\n${createStatusLine(icons.success, `${filename}`, 'success', '创建成功')}`
    createdFiles.push(filename)
  })

  outputContent += `\n\n${createUsageGuide()}`

  if (!config.silent) {
    console.log(createOutputBlock(outputContent))
  }

  return { envsDir: config.envsDir, filesCreated: createdFiles }
}

// 导出 (保持不变)
module.exports = EnvManager
module.exports.switchEnvironment = switchEnvironment
module.exports.scanEnvironments = scanEnvironments  
module.exports.initProject = initProject
module.exports.validateEnvType = validateEnvType
module.exports.mergeEnvContents = mergeEnvContents