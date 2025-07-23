// src/env-manager.js - 兼容性导出文件
// 这个文件保持向后兼容，同时使用函数式设计

const fs = require('fs')
const path = require('path')

// 🎨 常量和工具定义
const COLORS = {
  reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', gray: '\x1b[90m',
  brightRed: '\x1b[91m', brightGreen: '\x1b[92m', brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m', brightCyan: '\x1b[96m'
}

const ICONS = {
  success: '✨', error: '❌', warning: '⚠️', info: 'ℹ️', step: '🔧',
  rocket: '🚀', file: '📄', crown: '👑', sparkles: '✨', heart: '💚'
}

const ENV_MAP = {
  dev: '.env.development', development: '.env.development', test: '.env.test',
  stage: '.env.staging', staging: '.env.staging', prod: '.env.production',
  production: '.env.production'
}

// 🛠️ 工具函数
const colorize = (color, text) => `${color}${text}${COLORS.reset}`
const createLogMessage = (icon, color, message) => `${colorize(color, icon)} ${message}`

const log = {
  error: (msg) => console.error(createLogMessage(ICONS.error, COLORS.brightRed, msg)),
  success: (msg) => console.log(createLogMessage(ICONS.success, COLORS.brightGreen, msg)),
  warning: (msg) => console.log(createLogMessage(ICONS.warning, COLORS.brightYellow, msg)),
  info: (msg) => console.log(createLogMessage(ICONS.info, COLORS.brightBlue, msg)),
  step: (msg) => console.log(createLogMessage(ICONS.step, COLORS.brightCyan, msg))
}

const createBanner = () => `
${COLORS.brightCyan}${COLORS.bright}
    ╭──────────────────────────────────────────────────────────────╮
    │                                                              │
    │  ${ICONS.crown}  ${COLORS.brightYellow}Robot Admin${COLORS.brightCyan} - 环境配置管理工具 ${ICONS.sparkles}              │
    │                                                              │
    ╰──────────────────────────────────────────────────────────────╯
${COLORS.reset}`

const showBanner = (silent = false) => {
  if (!silent) console.log(createBanner())
}

// 📁 文件操作工具
const fileExists = (filePath) => fs.existsSync(filePath)
const readFile = (filePath) => fs.readFileSync(filePath, 'utf8')
const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf8')
const ensureDir = (dirPath) => !fs.existsSync(dirPath) && fs.mkdirSync(dirPath, { recursive: true })

// 🔧 核心功能函数

// 验证环境类型
const validateEnvType = (envType) => {
  const envFileName = ENV_MAP[envType]
  if (!envFileName) {
    throw new Error(`不支持的环境类型: ${envType}。支持: ${Object.keys(ENV_MAP).join(', ')}`)
  }
  return envFileName
}

// 合并环境文件内容
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

  // 环境特定配置（优先级更高）
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

  // 通用配置
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

// 🎯 主要功能类（保持兼容性）
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

// 🚀 核心功能函数（函数式实现）

// 切换环境
const switchEnvironment = async (envType, options = {}) => {
  const config = { envsDir: 'envs', targetFile: '.env', silent: false, ...options }
  
  showBanner(config.silent)
  log.step(`开始处理 ${envType} 环境...`)

  // 验证环境类型
  const envFileName = validateEnvType(envType)

  // 构建文件路径
  const envsDir = config.envsDir
  const baseEnvFile = path.join(envsDir, '.env')
  const envSpecificFile = path.join(envsDir, envFileName)
  const targetFile = config.targetFile

  // 检查目录和文件
  if (!fileExists(envsDir)) {
    log.error(`envs 目录不存在: ${envsDir}`)
    throw new Error(`envs 目录不存在: ${envsDir}`)
  }

  if (!fileExists(envSpecificFile)) {
    log.error(`环境配置文件不存在: ${envSpecificFile}`)
    log.info('请先运行: env-manager --init')
    throw new Error(`环境配置文件不存在: ${envSpecificFile}`)
  }

  // 读取文件内容
  let baseContent = ''
  if (fileExists(baseEnvFile)) {
    baseContent = readFile(baseEnvFile)
    log.success('通用配置读取成功')
  } else {
    log.warning('通用配置文件不存在，跳过')
  }

  const envContent = readFile(envSpecificFile)
  log.success('环境配置读取成功')

  // 合并并写入
  log.step('合并配置文件...')
  const mergedContent = mergeEnvContents(baseContent, envContent, envType)
  
  log.step('写入环境文件...')
  writeFile(targetFile, mergedContent)

  log.success(`成功切换到 ${envType} 环境`)
  
  // 显示结果
  const variableCount = (mergedContent.match(/^[^#\s].*=/gm) || []).length
  console.log(`\n╭${'─'.repeat(40)}╮`)
  console.log(`│ 🎯 ${envType.toUpperCase()} 环境已激活${' '.repeat(40 - envType.length - 11)}│`)
  console.log(`│ 🔑 环境变量: ${variableCount} 个${' '.repeat(40 - 12 - variableCount.toString().length)}│`)
  console.log(`╰${'─'.repeat(40)}╯`)
  console.log(`\n${ICONS.sparkles} 环境配置完成！${ICONS.heart}\n`)

  return { envType, targetFile, variableCount }
}

// 扫描环境文件
const scanEnvironments = (options = {}) => {
  const config = { envsDir: 'envs', silent: false, ...options }
  
  showBanner(config.silent)
  log.info('扫描环境文件...')

  if (!fileExists(config.envsDir)) {
    log.error(`envs 目录不存在: ${config.envsDir}`)
    log.info('请先运行: env-manager --init')
    return []
  }

  const files = fs.readdirSync(config.envsDir)
  const envFiles = files.filter(file => file.startsWith('.env'))

  if (envFiles.length === 0) {
    log.warning('未找到任何环境文件')
    log.info('请先运行: env-manager --init')
    return []
  }

  console.log(`\n找到 ${envFiles.length} 个环境文件:\n`)
  
  envFiles.forEach(file => {
    const filePath = path.join(config.envsDir, file)
    const stats = fs.statSync(filePath)
    const sizeKB = (stats.size / 1024).toFixed(2)
    console.log(`  ${ICONS.file} ${file.padEnd(20)} (${sizeKB}KB)`)
  })
  console.log('')

  return envFiles.map(file => ({
    name: file,
    path: path.join(config.envsDir, file),
    size: fs.statSync(path.join(config.envsDir, file)).size
  }))
}

// 初始化项目
const initProject = (options = {}) => {
  const config = { envsDir: 'envs', force: false, silent: false, ...options }
  
  showBanner(config.silent)
  log.step('初始化环境配置...')

  // 创建目录
  ensureDir(config.envsDir)

  // 模板文件
  const templates = {
    '.env': '# 通用配置\nAPP_NAME=Robot Admin\nAPP_VERSION=1.0.0\n',
    '.env.development': '# 开发环境\nNODE_ENV=development\nAPI_URL=http://localhost:3000\nDEBUG=true\n',
    '.env.test': '# 测试环境\nNODE_ENV=test\nAPI_URL=http://test-api.example.com\nDEBUG=false\n',
    '.env.staging': '# 预发布环境\nNODE_ENV=staging\nAPI_URL=https://staging-api.example.com\nDEBUG=false\n',
    '.env.production': '# 生产环境\nNODE_ENV=production\nAPI_URL=https://api.example.com\nDEBUG=false\n'
  }

  // 创建文件
  Object.entries(templates).forEach(([filename, content]) => {
    const filePath = path.join(config.envsDir, filename)

    if (!config.force && fileExists(filePath)) {
      log.warning(`文件已存在，跳过: ${filename}`)
      return
    }

    writeFile(filePath, content)
    log.success(`创建文件: ${filename}`)
  })

  log.success('环境配置初始化完成！')
  console.log(`\n使用示例:`)
  console.log(`  env-manager dev      # 切换到开发环境`)
  console.log(`  env-manager prod     # 切换到生产环境`)
  console.log(`  env-manager --scan   # 扫描环境文件\n`)

  return { envsDir: config.envsDir, filesCreated: Object.keys(templates) }
}

// 导出兼容接口
module.exports = EnvManager

// 同时导出函数式接口
module.exports.switchEnvironment = switchEnvironment
module.exports.scanEnvironments = scanEnvironments  
module.exports.initProject = initProject
module.exports.validateEnvType = validateEnvType
module.exports.mergeEnvContents = mergeEnvContents