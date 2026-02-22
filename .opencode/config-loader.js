// 统一配置加载器
// 位置：.opencode/config-loader.js

const fs = require('fs');
const path = require('path');

class ConfigLoader {
  constructor() {
    this.configPath = this.findConfig();
    this.config = this.load();
  }

  findConfig() {
    // 查找项目根目录的配置文件
    let dir = process.cwd();
    const maxDepth = 10;
    let depth = 0;

    while (depth < maxDepth) {
      // 优先查找 .opencode/config.json
      const configPath = path.join(dir, '.opencode', 'config.json');
      if (fs.existsSync(configPath)) {
        return configPath;
      }
      dir = path.dirname(dir);
      depth++;
    }

    return null;
  }

  load() {
    if (!this.configPath) {
      return this.getDefaultConfig();
    }

    try {
      return JSON.parse(fs.readFileSync(this.configPath));
    } catch (e) {
      console.warn('⚠️ 配置加载失败，使用默认配置');
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      developer: {
        mode: 'personal',
        git: {
          commit: {
            autoPush: false,
            language: 'zh-CN',
            conventionalCommits: true
          }
        }
      },
      automation: {
        do: {
          enabled: true,
          skipUIForSimpleProjects: true,
          simpleProjectThreshold: 3,
          autoDeployOnSuccess: false,
          confirmBeforeDeploy: true
        }
      },
      quality: {
        test: { mode: 'quick' },
        review: { mode: 'simple' },
        security: {
          enabled: true,
          failOn: 'high'
        }
      }
    };
  }

  // 获取配置
  get(key, defaultValue) {
    const keys = key.split('.');
    let value = this.config;
    for (const k of keys) {
      value = value?.[k];
    }
    return value !== undefined ? value : defaultValue;
  }

  // 便捷方法
  getDeveloperMode() {
    return this.get('developer.mode', 'personal');
  }

  getGitCommitAutoPush() {
    return this.get('developer.git.commit.autoPush', false);
  }

  getGitCommitLanguage() {
    return this.get('developer.git.commit.language', 'zh-CN');
  }

  getAutoDeploy() {
    return this.get('automation.do.autoDeployOnSuccess', false);
  }

  getConfirmBeforeDeploy() {
    return this.get('automation.do.confirmBeforeDeploy', true);
  }

  getTestMode() {
    return this.get('quality.test.mode', 'quick');
  }

  getReviewMode() {
    return this.get('quality.review.mode', 'simple');
  }

  getSecurityFailOn() {
    return this.get('quality.security.failOn', 'high');
  }

  // 检查配置是否存在
  hasConfig() {
    return this.configPath !== null;
  }

  getConfigPath() {
    return this.configPath;
  }
}

module.exports = ConfigLoader;
