# ImageAI 数据库设置脚本
# 使用方法: .\scripts\db-setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ImageAI 数据库设置脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查环境变量
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  未找到 DATABASE_URL 环境变量" -ForegroundColor Yellow
    Write-Host "正在从 .env.local 文件加载..." -ForegroundColor Yellow
    
    if (Test-Path .\.env.local) {
        $envContent = Get-Content .\.env.local
        foreach ($line in $envContent) {
            if ($line -match '^DATABASE_URL="(.+)"$') {
                $env:DATABASE_URL = $matches[1]
                Write-Host "✅ 已加载 DATABASE_URL" -ForegroundColor Green
                break
            }
        }
    }
}

if (-not $env:DATABASE_URL) {
    Write-Host "❌ 错误: 无法获取 DATABASE_URL" -ForegroundColor Red
    Write-Host "请确保 .env.local 文件中包含 DATABASE_URL 配置" -ForegroundColor Red
    exit 1
}

Write-Host "数据库连接: $env:DATABASE_URL" -ForegroundColor Gray
Write-Host ""

# 步骤 1: 生成 Prisma Client
Write-Host "步骤 1/3: 生成 Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma Client 生成失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client 生成成功" -ForegroundColor Green
Write-Host ""

# 步骤 2: 执行数据库迁移
Write-Host "步骤 2/3: 执行数据库迁移..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 数据库迁移失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 数据库迁移成功" -ForegroundColor Green
Write-Host ""

# 步骤 3: 种子数据
Write-Host "步骤 3/3: 导入种子数据..." -ForegroundColor Cyan

# 创建种子数据脚本
$seedScript = @'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始导入种子数据...')

  // 创建默认姿势数据
  const poses = [
    { name: '正面站姿', nameEn: 'Front Standing', category: 'STANDING', description: '标准正面站姿，适合展示整体穿搭效果', prompt: 'standing pose, front view, full body, professional fashion photography' },
    { name: '侧面站姿', nameEn: 'Side Standing', category: 'STANDING', description: '侧面站姿，展示服装侧面线条', prompt: 'standing pose, side view, full body, professional fashion photography' },
    { name: '45度站姿', nameEn: '45 Degree Standing', category: 'STANDING', description: '45度角站姿，经典时尚摄影角度', prompt: 'standing pose, 45 degree angle, full body, professional fashion photography' },
    { name: '正面坐姿', nameEn: 'Front Sitting', category: 'SITTING', description: '优雅的正面坐姿', prompt: 'sitting pose, front view, elegant, professional fashion photography' },
    { name: '侧面坐姿', nameEn: 'Side Sitting', category: 'SITTING', description: '侧面坐姿，展示服装垂坠感', prompt: 'sitting pose, side view, elegant, professional fashion photography' },
    { name: '走秀步态', nameEn: 'Catwalk', category: 'WALKING', description: '模特走秀动态姿势', prompt: 'walking pose, catwalk, dynamic, professional fashion photography' },
    { name: '休闲靠姿', nameEn: 'Casual Leaning', category: 'CASUAL', description: '休闲自然的靠姿', prompt: 'casual leaning pose, relaxed, natural, professional fashion photography' },
    { name: '专业展示', nameEn: 'Professional Display', category: 'PROFESSIONAL', description: '专业模特展示姿势', prompt: 'professional model pose, display, high fashion photography' },
  ]

  for (const pose of poses) {
    await prisma.pose.upsert({
      where: { name: pose.name },
      update: {},
      create: pose,
    })
  }
  console.log(`✅ 已导入 ${poses.length} 个姿势数据`)

  // 创建默认穿搭模板
  const outfits = [
    { name: '夏日清新风', category: 'SUMMER', season: 'SUMMER', style: '清新', description: '轻盈透气的夏日穿搭', tags: ['夏日', '清新', '休闲'] },
    { name: '商务正装', category: 'FORMAL', season: 'ALL_YEAR', style: '正式', description: '专业商务场合穿搭', tags: ['商务', '正式', '职业'] },
    { name: '运动休闲', category: 'SPORT', season: 'ALL_YEAR', style: '运动', description: '舒适的运动风格', tags: ['运动', '休闲', '舒适'] },
    { name: '冬季保暖', category: 'WINTER', season: 'WINTER', style: '保暖', description: '温暖时尚的冬季穿搭', tags: ['冬季', '保暖', '时尚'] },
    { name: '派对晚装', category: 'PARTY', season: 'ALL_YEAR', style: '华丽', description: '适合派对的华丽穿搭', tags: ['派对', '晚装', '华丽'] },
  ]

  for (const outfit of outfits) {
    await prisma.outfit.upsert({
      where: { name: outfit.name },
      update: {},
      create: outfit,
    })
  }
  console.log(`✅ 已导入 ${outfits.length} 个穿搭模板`)

  // 创建系统配置
  const configs = [
    { key: 'max_free_generations', value: '5', description: '免费用户最大生成次数' },
    { key: 'monthly_plan_price', value: '49', description: '月卡价格(元)' },
    { key: 'quarterly_plan_price', value: '129', description: '季卡价格(元)' },
    { key: 'yearly_plan_price', value: '399', description: '年卡价格(元)' },
  ]

  for (const config of configs) {
    await prisma.config.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }
  console.log(`✅ 已导入 ${configs.length} 个系统配置`)

  console.log('种子数据导入完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
"@

$seedScript | Out-File -FilePath ".\prisma\seed.ts" -Encoding UTF8

# 执行种子脚本
npx ts-node prisma\seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  种子数据导入失败，但数据库迁移已完成" -ForegroundColor Yellow
} else {
    Write-Host "✅ 种子数据导入成功" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  数据库设置完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "您可以运行以下命令查看数据库:" -ForegroundColor Gray
Write-Host "  npx prisma studio" -ForegroundColor Yellow
Write-Host ""
