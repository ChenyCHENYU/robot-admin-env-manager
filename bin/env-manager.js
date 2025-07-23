#!/usr/bin/env node

const EnvManager = require("../src/env-manager");

// 纯函数：解析命令行参数
const parseArgs = (argv) => {
  const args = argv.slice(2);
  const env = args[0];
  const flags = args.filter((arg) => arg.startsWith("--"));
  return { env, flags, hasHelp: !env || env === "--help" || env === "-h" };
};

// 纯函数：创建帮助信息
const createHelpText = () => `
🚀 Robot Admin 环境配置管理工具

📖 使用方法:
  env-manager <environment>    切换环境
  env-manager --scan          扫描环境文件  
  env-manager --init          初始化项目
  env-manager --help          显示帮助
  env-manager --version       显示版本

🎯 支持的环境:
  dev, development    → 开发环境
  test               → 测试环境  
  staging, stage     → 预发布环境
  prod, production   → 生产环境

💡 示例:
  env-manager dev            # 切换到开发环境
  env-manager production     # 切换到生产环境
  env-manager --scan         # 扫描可用的环境文件

🔗 更多信息: https://github.com/robot-admin/env-manager
`;

// 主函数：处理CLI命令
const main = async () => {
  const { env, flags, hasHelp } = parseArgs(process.argv);

  try {
    // 显示帮助
    if (hasHelp) {
      console.log(createHelpText());
      return;
    }

    // 显示版本
    if (env === "--version" || env === "-v") {
      const pkg = require("../package.json");
      console.log(pkg.version);
      return;
    }

    // 扫描环境文件
    if (env === "--scan" || env === "scan") {
      // 使用函数式接口
      await EnvManager.scanEnvironments();
      return;
    }

    // 初始化项目
    if (env === "--init" || env === "init") {
      const force = flags.includes("--force");
      await EnvManager.initProject({ force });
      return;
    }

    // 切换环境
    await EnvManager.switchEnvironment(env);
  } catch (error) {
    console.error("❌", error.message);
    process.exit(1);
  }
};

// 错误处理
process.on("uncaughtException", (error) => {
  console.error("💥 未捕获的异常:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("💥 未处理的 Promise 拒绝:", reason);
  process.exit(1);
});

// 启动程序
main().catch((error) => {
  console.error("💥 程序执行失败:", error.message);
  process.exit(1);
});
