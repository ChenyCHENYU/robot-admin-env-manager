// ========================================
// src/index.js - 主入口文件
// ========================================
const {
  switchEnvironment,
  scanEnvironments,
  initProject,
} = require("./core/env-manager");

// 导出主要功能函数
module.exports = {
  // 主要功能
  switchEnv: switchEnvironment,
  scanEnvs: scanEnvironments,
  initProject,

  // 别名
  switch: switchEnvironment,
  scan: scanEnvironments,
  init: initProject,
};
