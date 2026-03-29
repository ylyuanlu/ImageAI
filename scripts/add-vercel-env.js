/**
 * 添加环境变量到 Vercel（避免 PowerShell 换行符问题）
 */
const { execSync } = require('child_process');

const key = 'TONGYI_API_KEY';
const value = 'sk-777a9155d80a4703aa169c7f41947dcd';
const environment = 'production';

try {
    // 先删除已存在的环境变量
    try {
        execSync(`vercel env rm ${key} ${environment} -y`, { stdio: 'inherit' });
    } catch (e) {
        // 忽略删除错误（可能不存在）
    }
    
    // 使用 printf 避免换行符问题
    const command = `printf '%s' '${value}' | vercel env add ${key} ${environment}`;
    execSync(command, { stdio: 'inherit', shell: '/bin/bash' });
    
    console.log(`✅ 成功添加 ${key} 到 ${environment} 环境`);
} catch (error) {
    console.error('❌ 添加失败:', error.message);
    process.exit(1);
}
