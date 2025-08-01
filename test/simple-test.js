// style-demo.mjs - ES模块版本的样式演示文件
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🎨 环境管理工具样式演示 (ES模块版本)");
console.log("=".repeat(50));

async function runStyleDemo() {
  try {
    // 检查 env-manager.js 是否存在
    const possiblePaths = [
      path.join(__dirname, "../src/env-manager.js"),
      path.join(__dirname, "./env-manager.js"), 
      path.join(__dirname, "env-manager.js"),
      path.join(__dirname, "../env-manager.js")
    ];

    let envManagerPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        envManagerPath = testPath;
        console.log(`✅ 找到环境管理器: ${testPath}`);
        break;
      }
    }

    if (!envManagerPath) {
      console.log("❌ 找不到 env-manager.js 文件");
      console.log("请确保文件存在于以下位置之一:");
      possiblePaths.forEach(p => console.log(`   - ${p}`));
      
      // 显示当前目录结构帮助调试
      console.log("\n📁 当前目录结构:");
      try {
        const files = fs.readdirSync(__dirname);
        files.forEach(file => {
          const filePath = path.join(__dirname, file);
          const isDir = fs.statSync(filePath).isDirectory();
          console.log(`   ${isDir ? '📁' : '📄'} ${file}`);
        });
      } catch (e) {
        console.log("   无法读取目录");
      }
      
      process.exit(1);
    }

    // 使用动态import加载CommonJS模块
    const EnvManager = await import(`file://${envManagerPath}`);
    console.log("✅ 环境管理器加载成功");

    // 创建临时测试目录
    const testDir = path.join(__dirname, "temp_demo_envs");
    
    console.log("\n" + "=".repeat(60));
    console.log("🚀 开始样式效果演示...");
    console.log("=".repeat(60));

    // 演示1: 初始化项目效果
    console.log("\n📋 演示1: 项目初始化效果");
    console.log("-".repeat(40));
    
    const { initProject } = EnvManager.default || EnvManager;
    await initProject({ 
      envsDir: testDir, 
      silent: false,  // 显示完整效果
      force: true 
    });

    // 等待用户观看效果
    console.log("\n⏳ 效果展示中，请观察上方的精美输出...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 演示2: 环境文件扫描效果
    console.log("\n📁 演示2: 环境文件扫描效果");
    console.log("-".repeat(40));
    
    const { scanEnvironments } = EnvManager.default || EnvManager;
    scanEnvironments({ 
      envsDir: testDir, 
      silent: false 
    });

    // 等待用户观看效果  
    console.log("\n⏳ 效果展示中，请观察上方的精美表格...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 演示3: 环境切换效果（模拟）
    console.log("\n🔄 演示3: 环境切换效果");
    console.log("-".repeat(40));
    
    try {
      const { switchEnvironment } = EnvManager.default || EnvManager;
      await switchEnvironment('dev', { 
        envsDir: testDir, 
        targetFile: path.join(testDir, '.env.demo'), 
        silent: false 
      });
    } catch (error) {
      console.log("💡 环境切换演示完成（演示模式下的正常行为）");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎨 样式演示完成！");
    console.log("=".repeat(60));

    // 展示优化特点总结
    console.log("\n✨ 样式优化亮点：");
    console.log("   🎨 精美的Unicode边框和分隔线");
    console.log("   🌈 丰富的颜色层次和对比度"); 
    console.log("   📏 合适的文字大小和间距");
    console.log("   ❤️  红色心形图标（告别绿心）");
    console.log("   📋 专业的表格式信息展示");
    console.log("   🔧 清晰的处理步骤指示");
    console.log("   ⚡ 优雅的成功/错误状态提示");

    // 清理测试文件
    if (fs.existsSync(testDir)) {
      try {
        fs.rmSync(testDir, { recursive: true, force: true });
        console.log("\n🧹 清理演示文件完成");
      } catch (cleanupError) {
        console.log("\n⚠️  清理文件时出现小问题（可忽略）");
      }
    }

    console.log("\n🎉 演示结束！现在你可以在实际项目中享受这些精美的样式了！");

  } catch (error) {
    console.error("\n❌ 演示过程中出现错误:", error.message);
    console.log("\n💡 请检查:");
    console.log("   1. env-manager.js 文件是否存在");
    console.log("   2. 文件路径是否正确"); 
    console.log("   3. Node.js 版本是否支持 ES模块");
    process.exit(1);
  }
}

// 运行演示
runStyleDemo();