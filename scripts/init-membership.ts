import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const membershipLevels = [
  {
    level: 'BRONZE',
    name: '青铜会员',
    price: 29.9,
    yearlyPrice: 299,
    monthlyQuota: 50,
    maxResolution: '1024x1024',
    priority: 1,
    commercialUse: false,
    watermark: true,
    features: JSON.stringify([
      '每月50次生成额度',
      '1024x1024分辨率',
      '标准生成速度',
      '带水印图片'
    ]),
    sortOrder: 1
  },
  {
    level: 'SILVER',
    name: '白银会员',
    price: 59.9,
    yearlyPrice: 599,
    monthlyQuota: 150,
    maxResolution: '1024x1024',
    priority: 2,
    commercialUse: false,
    watermark: false,
    features: JSON.stringify([
      '每月150次生成额度',
      '1024x1024分辨率',
      '优先生成速度',
      '无水印图片',
      '历史记录永久保存'
    ]),
    sortOrder: 2
  },
  {
    level: 'GOLD',
    name: '黄金会员',
    price: 99.9,
    yearlyPrice: 999,
    monthlyQuota: 500,
    maxResolution: '2048x2048',
    priority: 3,
    commercialUse: true,
    watermark: false,
    features: JSON.stringify([
      '每月500次生成额度',
      '2048x2048高分辨率',
      '极速生成',
      '无水印图片',
      '商业使用授权',
      '专属客服支持'
    ]),
    sortOrder: 3
  },
  {
    level: 'PLATINUM',
    name: '铂金会员',
    price: 199.9,
    yearlyPrice: 1999,
    monthlyQuota: 2000,
    maxResolution: '2048x2048',
    priority: 4,
    commercialUse: true,
    watermark: false,
    features: JSON.stringify([
      '每月2000次生成额度',
      '2048x2048高分辨率',
      '极速生成',
      '无水印图片',
      '商业使用授权',
      '优先客服支持',
      'API接口访问'
    ]),
    sortOrder: 4
  },
  {
    level: 'DIAMOND',
    name: '钻石会员',
    price: 499.9,
    yearlyPrice: 4999,
    monthlyQuota: 10000,
    maxResolution: '4096x4096',
    priority: 5,
    commercialUse: true,
    watermark: false,
    features: JSON.stringify([
      '每月10000次生成额度',
      '4096x4096超高分辨率',
      '极速生成',
      '无水印图片',
      '商业使用授权',
      '专属客服经理',
      'API接口访问',
      '定制化服务'
    ]),
    sortOrder: 5
  }
]

async function initMembershipLevels() {
  console.log('初始化会员等级...')

  for (const level of membershipLevels) {
    await prisma.membershipLevel.upsert({
      where: { level: level.level },
      update: level,
      create: level
    })
    console.log(`✅ ${level.name} - ¥${level.price}/月`)
  }

  console.log('\n会员等级初始化完成！')
  console.log('\n价格体系：')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  membershipLevels.forEach(l => {
    console.log(`${l.name.padEnd(8)} ¥${l.price.toFixed(1)}/月  ¥${l.yearlyPrice}/年  ${l.monthlyQuota}次/月`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

initMembershipLevels()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
