// src/env-manager.js - 现代化精致CLI版本
const fs = require('fs')
const path = require('path')

// 🎨 现代化颜色系统 (类似 Vercel CLI)
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // 主色调 - 现代蓝紫色系
  primary: '\x1b[38;2;79;172;254m',     // 现代蓝
  secondary: '\x1b[38;2;168;85;247m',   // 现代紫  
  accent: '\x1b[38;2;34;197;94m',       // 现代绿
  warning: '\x1b[38;2;251;191;36m',     // 现代黄
  error: '\x1b[38;2;239;68;68m',        // 现代红
  
  // 中性色
  white: '\x1b[38;2;255;255;255m',
  gray: '\x1b[38;2;156;163;175m',
  darkGray: '\x1b[38;2;75;85;99m',
  lightGray: '\x1b[38;2;229;231;235m',
  
  // 背景色
  bgDark: '\x1b[48;2;17;24;39m',
  bgLight: '\x1b[48;2;248;250;252m',
}

// 🎯 现代化图标 (简洁风格)
const icons = {
  // 状态图标
  success: '✓',
  error: '✕', 
  warning: '⚠',
  info: 'ℹ',
  
  // 功能图标
  rocket: '▲',      // 类似 Vercel
  folder: '📁',
  file: '📄',
  gear: '⚙',
  arrow: '→',
  dot: '•',
  
  // 装饰图标
  sparkle: '✨',
  heart: '♥',
  diamond: '◆',
  star: '★',
}

const ENV_MAP = {
  dev: '.env.development', development: '.env.development', test: '.env.test',
  stage: '.env.staging', staging: '.env.staging', prod: '.env.production',
  production: '.env.production'
}

// 🎨 现代化样式工具
const style = {
  // 文字样式
  title: (text) => `${colors.bold}${colors.white}${text}${colors.reset}`,
  subtitle: (text) => `${colors.gray}${text}${colors.reset}`,
  primary: (text) => `${colors.primary}${text}${colors.reset}`,
  success: (text) => `${colors.accent}${text}${colors.reset}`,
  warning: (text) => `${colors.warning}${text}${colors.reset}`,
  error: (text) => `${colors.error}${text}${colors.reset}`,
  muted: (text) => `${colors.darkGray}${text}${colors.reset}`,
  
  // 组合样式
  brand: (text) => `${colors.bold}${colors.primary}${text}${colors.reset}`,
  highlight: (text) => `${colors.bold}${colors.white}${text}${colors.reset}`,
  
  // 分隔线样式
  divider: (width = 60) => `${colors.darkGray}${'─'.repeat(width)}${colors.reset}`,
  topDivider: (width = 60) => `${colors.primary}${'─'.repeat(width)}${colors.reset}`,
  bottomDivider: (width = 60) => `${colors.primary}${'─'.repeat(width)}${colors.reset}`,
}

// 🎨 现代化Banner - 类似 Next.js CLI
const createModernBanner = () => {
  const line1 = `${style.brand('▲')} ${style.title('Robot Admin')} ${style.muted('—')} ${style.subtitle('环境配置管理工具')}`
  const line2 = `${style.muted('   优雅的环境切换解决方案')}`
  
  return `${line1}\n${line2}`
}

// 🎨 现代化状态行 - 类似 Vercel CLI
const createStatusLine = (icon, text, status = 'info', detail = '') => {
  const statusColors = {
    success: colors.accent,
    error: colors.error,
    warning: colors.warning,
    info: colors.primary,
    processing: colors.primary
  }
  
  const color = statusColors[status]
  const detailText = detail ? ` ${style.muted(detail)}` : ''
  
  return `${color}${icon}${colors.reset} ${colors.white}${text}${colors.reset}${detailText}`
}

// 🎨 现代化成功卡片 - 类似现代UI
const createSuccessCard = (envType, variableCount) => {
  const header = `${style.success('✓')} ${style.highlight('环境切换成功')}`
  const env = `   ${style.muted('环境:')} ${style.primary(envType.toUpperCase())}`
  const vars = `   ${style.muted('变量:')} ${style.highlight(variableCount + ' 个')}`
  const status = `   ${style.muted('状态:')} ${style.success('已生效')}`
  
  return `${header}\n${env}\n${vars}\n${status}`
}

// 🎨 现代化文件列表 - 类似 VS Code Terminal
const createFileList = (files) => {
  const header = `${style.highlight('环境文件')}`
  const items = files.map(file => {
    const filePath = file.path
    const stats = fs.statSync(filePath)
    const sizeKB = (stats.size / 1024).toFixed(1)
    return `   ${style.primary('•')} ${style.highlight(file.name)} ${style.muted(`(${sizeKB}KB)`)}`
  })
  
  return `${header}\n${items.join('\n')}`
}

// 🎨 现代化使用说明 - 类似 CLI 帮助文档
const createUsageGuide = () => {
  const header = `${style.highlight('快速开始')}`
  const commands = [
    `   ${style.primary('env-manager dev')}     ${style.muted('切换到开发环境')}`,
    `   ${style.primary('env-manager prod')}    ${style.muted('切换到生产环境')}`,
    `   ${style.primary('env-manager --scan')}  ${style.muted('扫描环境文件')}`
  ]
  
  return `${header}\n${commands.join('\n')}`
}

// 🎨 完整输出块包装器
const createOutputBlock = (content, title = '') => {
  const dividerWidth = 60
  const topLine = style.topDivider(dividerWidth)
  const bottomLine = style.bottomDivider(dividerWidth)
  
  let output = `\n${topLine}\n`
  
  if (title) {
    output += `${title}\n${style.divider(dividerWidth)}\n`
  }
  
  output += `${content}\n${bottomLine}\n`
  
  return output
}

// 📁 文件操作工具
const fileExists = (filePath) => fs.existsSync(filePath)
const readFile = (filePath) => fs.readFileSync(filePath, 'utf8')
const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf8')
const ensureDir = (dirPath) => !fs.existsSync(dirPath) && fs.mkdirSync(dirPath, { recursive: true })

// 🔧 核心功能函数
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

// 🎯 主要功能类
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

// 🚀 核心功能实现

const switchEnvironment = async (envType, options = {}) => {
  const config = { envsDir: 'envs', targetFile: '.env', silent: false, ...options }
  
  // 验证环境类型
  const envFileName = validateEnvType(envType)
  const envsDir = config.envsDir
  const baseEnvFile = path.join(envsDir, '.env')
  const envSpecificFile = path.join(envsDir, envFileName)
  const targetFile = config.targetFile

  // 构建输出内容
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

  // 现代化处理过程
  outputContent += `\n\n${createStatusLine(icons.gear, '开始处理', 'processing', `${envType} 环境`)}`

  let baseContent = ''
  if (fileExists(baseEnvFile)) {
    baseContent = readFile(baseEnvFile)
    outputContent += `\n${createStatusLine(icons.success, '通用配置', 'success', '读取成功')}`
  }

  const envContent = readFile(envSpecificFile)
  outputContent += `\n${createStatusLine(icons.success, '环境配置', 'success', '读取成功')}`

  outputContent += `\n${createStatusLine(icons.gear, '合并配置', 'processing')}`
  const mergedContent = mergeEnvContents(baseContent, envContent, envType)
  
  outputContent += `\n${createStatusLine(icons.gear, '写入文件', 'processing')}`
  writeFile(targetFile, mergedContent)

  const variableCount = (mergedContent.match(/^[^#\s].*=/gm) || []).length
  
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

// 导出
module.exports = EnvManager
module.exports.switchEnvironment = switchEnvironment
module.exports.scanEnvironments = scanEnvironments  
module.exports.initProject = initProject
module.exports.validateEnvType = validateEnvType
module.exports.mergeEnvContents = mergeEnvContents