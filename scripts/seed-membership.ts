import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始导入会员等级数据...\n')

  // 创建会员等级数据（4个等级：1个免费 + 3个付费）
  // 定价策略：保证60%+毛利，年付7折
  const membershipLevels = [
    {
      level: 'FREE',
      name: '免费版',
      price: 0,
      yearlyPrice: 0,
      monthlyQuota: 5,
      maxResolution: '512x512',
      priority: 0,
      commercialUse: false,
      watermark: true,
      features: JSON.stringify([
        '每月5次免费生成',
        '512x512基础分辨率',
        '标准生成速度',
        '基础姿势库',
        '基础穿搭模板',
        '历史记录保留7天',
        '带水印下载'
      ]),
      sortOrder: 0,
      isActive: true
    },
    {
      level: 'BASIC',
      name: '基础版',
      price: 39,
      yearlyPrice: 327, // 7折：39 * 12 * 0.7 = 327.6 ≈ 327
      monthlyQuota: 50,
      maxResolution: '1024x1024',
      priority: 1,
      commercialUse: false,
      watermark: false,
      features: JSON.stringify([
        '每月50次生成额度',
        '1024x1024高清分辨率',
        '优先生成队列',
        '全部姿势库',
        '全部穿搭模板',
        '历史记录永久保留',
        '无水印高清下载',
        'JPG/PNG格式导出'
      ]),
      sortOrder: 1,
      isActive: true
    },
    {
      level: 'PRO',
      name: '专业版',
      price: 99,
      yearlyPrice: 831, // 7折：99 * 12 * 0.7 = 831.6 ≈ 831
      monthlyQuota: 200,
      maxResolution: '1536x1536',
      priority: 2,
      commercialUse: true,
      watermark: false,
      features: JSON.stringify([
        '每月200次生成额度',
        '1536x1536超清分辨率',
        'VIP优先队列',
        '全部姿势库',
        '全部穿搭模板',
        '批量生成(最多4张)',
        '历史记录永久保留',
        '无水印超清下载',
        '全格式导出',
        '商业使用授权'
      ]),
      sortOrder: 2,
      isActive: true
    },
    {
      level: 'ENTERPRISE',
      name: '企业版',
      price: 299,
      yearlyPrice: 2511, // 7折：299 * 12 * 0.7 = 2511.6 ≈ 2511
      monthlyQuota: 800,
      maxResolution: '2048x2048',
      priority: 3,
      commercialUse: true,
      watermark: false,
      features: JSON.stringify([
        '每月800次生成额度',
        '2048x2048顶级分辨率',
        '最高优先级队列',
        '全部姿势库',
        '全部穿搭模板',
        '批量生成(最多16张)',
        '历史记录永久保留',
        '无水印顶级画质下载',
        '全格式导出',
        '商业使用授权',
        '专属客服支持',
        'API接口访问'
      ]),
      sortOrder: 3,
      isActive: true
    }
  ]

  // 将旧的会员等级标记为不活跃
  const oldLevels = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']
  for (const level of oldLevels) {
    await prisma.membershipLevel.updateMany({
      where: { level },
      data: { isActive: false }
    })
  }
  console.log('✅ 已停用旧版会员等级')

  let count = 0
  for (const level of membershipLevels) {
    await prisma.membershipLevel.upsert({
      where: { level: level.level },
      update: {
        name: level.name,
        price: level.price,
        yearlyPrice: level.yearlyPrice,
        monthlyQuota: level.monthlyQuota,
        maxResolution: level.maxResolution,
        priority: level.priority,
        commercialUse: level.commercialUse,
        watermark: level.watermark,
        features: level.features,
        sortOrder: level.sortOrder,
        isActive: level.isActive
      },
      create: level,
    })
    count++
    console.log(`✅ ${level.name} - 月付¥${level.price} / 年付¥${level.yearlyPrice}`)
  }

  console.log(`\n🎉 成功导入 ${count} 个会员等级`)
  console.log('\n📊 会员等级概览:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('免费版      每月5次    512x512    ¥0/月')
  console.log('基础版      每月50次   1024x1024  ¥39/月   年付¥327(省30%)')
  console.log('专业版      每月200次  1536x1536  ¥99/月   年付¥831(省30%)')
  console.log('企业版      每月800次  2048x2048  ¥299/月  年付¥2511(省30%)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('💡 额度充值：1元 = 1次（¥1.00/张）')
  console.log('💰 毛利估算：基础版60%+，专业版60%+，企业版60%+\n')
}

main()
  .catch((e) => {
    console.error('❌ 导入失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
