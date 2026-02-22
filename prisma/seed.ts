import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始导入种子数据...\n')

  // 创建默认姿势数据
  const poses = [
    { name: '正面站姿', nameEn: 'Front Standing', category: 'STANDING', description: '标准正面站姿，适合展示整体穿搭效果', prompt: 'standing pose, front view, full body, professional fashion photography' },
    { name: '侧面站姿', nameEn: 'Side Standing', category: 'STANDING', description: '侧面站姿，展示服装侧面线条', prompt: 'standing pose, side view, full body, professional fashion photography' },
    { name: '45度站姿', nameEn: '45 Degree Standing', category: 'STANDING', description: '45度角站姿，经典时尚摄影角度', prompt: 'standing pose, 45 degree angle, full body, professional fashion photography' },
    { name: '叉腰站姿', nameEn: 'Hands on Hips', category: 'STANDING', description: '双手叉腰，展现自信姿态', prompt: 'standing pose, hands on hips, confident, professional fashion photography' },
    { name: '正面坐姿', nameEn: 'Front Sitting', category: 'SITTING', description: '优雅的正面坐姿', prompt: 'sitting pose, front view, elegant, professional fashion photography' },
    { name: '侧面坐姿', nameEn: 'Side Sitting', category: 'SITTING', description: '侧面坐姿，展示服装垂坠感', prompt: 'sitting pose, side view, elegant, professional fashion photography' },
    { name: '盘腿坐姿', nameEn: 'Cross-legged Sitting', category: 'SITTING', description: '盘腿坐姿，休闲自然', prompt: 'sitting pose, cross-legged, relaxed, casual fashion photography' },
    { name: '走秀步态', nameEn: 'Catwalk', category: 'WALKING', description: '模特走秀动态姿势', prompt: 'walking pose, catwalk, dynamic, professional fashion photography' },
    { name: '转身动作', nameEn: 'Turning', category: 'WALKING', description: '转身瞬间，展现动态美', prompt: 'turning pose, dynamic movement, professional fashion photography' },
    { name: '休闲靠姿', nameEn: 'Casual Leaning', category: 'CASUAL', description: '休闲自然的靠姿', prompt: 'casual leaning pose, relaxed, natural, professional fashion photography' },
    { name: '单手插兜', nameEn: 'One Hand in Pocket', category: 'CASUAL', description: '单手插兜，随性自然', prompt: 'casual pose, one hand in pocket, relaxed, street fashion photography' },
    { name: '专业展示', nameEn: 'Professional Display', category: 'PROFESSIONAL', description: '专业模特展示姿势', prompt: 'professional model pose, display, high fashion photography' },
  ]

  let poseCount = 0
  for (const pose of poses) {
    await prisma.pose.upsert({
      where: { name: pose.name },
      update: {},
      create: pose,
    })
    poseCount++
  }
  console.log(`✅ 已导入 ${poseCount} 个姿势数据`)

  // 创建默认穿搭模板
  const outfits = [
    { name: '夏日清新风', category: 'SUMMER', season: 'SUMMER', style: '清新', description: '轻盈透气的夏日穿搭，适合日常休闲', imageUrl: 'https://example.com/outfit1.jpg', tags: JSON.stringify(['夏日', '清新', '休闲', '日常']) },
    { name: '商务正装', category: 'FORMAL', season: 'ALL_YEAR', style: '正式', description: '专业商务场合穿搭，展现职业形象', imageUrl: 'https://example.com/outfit2.jpg', tags: JSON.stringify(['商务', '正式', '职业', '办公室']) },
    { name: '运动休闲', category: 'SPORT', season: 'ALL_YEAR', style: '运动', description: '舒适的运动风格，活力满满', imageUrl: 'https://example.com/outfit3.jpg', tags: JSON.stringify(['运动', '休闲', '舒适', '健身']) },
    { name: '冬季保暖', category: 'WINTER', season: 'WINTER', style: '保暖', description: '温暖时尚的冬季穿搭，既保暖又时尚', imageUrl: 'https://example.com/outfit4.jpg', tags: JSON.stringify(['冬季', '保暖', '时尚', '外套']) },
    { name: '派对晚装', category: 'PARTY', season: 'ALL_YEAR', style: '华丽', description: '适合派对的华丽穿搭，成为焦点', imageUrl: 'https://example.com/outfit5.jpg', tags: JSON.stringify(['派对', '晚装', '华丽', '聚会']) },
    { name: '春日田园', category: 'CASUAL', season: 'SPRING', style: '田园', description: '清新自然的春日穿搭，适合郊游', imageUrl: 'https://example.com/outfit6.jpg', tags: JSON.stringify(['春季', '田园', '清新', '郊游']) },
    { name: '秋季优雅', category: 'FORMAL', season: 'AUTUMN', style: '优雅', description: '优雅知性的秋季穿搭，适合多种场合', imageUrl: 'https://example.com/outfit7.jpg', tags: JSON.stringify(['秋季', '优雅', '知性', '通勤']) },
  ]

  let outfitCount = 0
  for (const outfit of outfits) {
    await prisma.outfit.upsert({
      where: { name: outfit.name },
      update: {},
      create: outfit,
    })
    outfitCount++
  }
  console.log(`✅ 已导入 ${outfitCount} 个穿搭模板`)

  // 创建系统配置
  const configs = [
    { key: 'max_free_generations', value: '5', description: '免费用户最大生成次数' },
    { key: 'monthly_plan_price', value: '49', description: '月卡价格(元)' },
    { key: 'quarterly_plan_price', value: '129', description: '季卡价格(元)' },
    { key: 'yearly_plan_price', value: '399', description: '年卡价格(元)' },
    { key: 'max_batch_generate', value: '4', description: '单次最大生成数量' },
    { key: 'site_name', value: 'ImageAI', description: '网站名称' },
  ]

  let configCount = 0
  for (const config of configs) {
    await prisma.config.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
    configCount++
  }
  console.log(`✅ 已导入 ${configCount} 个系统配置`)

  console.log('\n🎉 种子数据导入完成！')
  console.log('📊 数据库已就绪，可以开始开发了\n')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据导入失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
