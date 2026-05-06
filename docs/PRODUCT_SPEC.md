# Couple Wealth（一起攒）产品设计文档 v5.0

## 1. 产品定位

一起攒是一款面向打工人情侣、家庭和个人的资产管理优先 + 流水辅助记录 App。

核心目标：

- 记录收入：工资、副业、奖金、其他收入。
- 管理资产：现金、账户、投资、目标资金、负债和净资产。
- 控制现金流：固定流出、日常流出、可优化流出。
- 管理攒钱周期：围绕发薪日锁定目标存款、计算现金池和剩余天数。
- 提升掌控感：打开 App 先知道净资产多少、钱在哪、能撑多久、这周期能攒多少。

## 2. 核心闭环

产品主线是：

看净资产 → 管账户 → 锁定目标存款 → 控制现金流 → 补必要流水

因此首页不以“记账流水”为核心，而以“资产总览 + 本攒钱周期”作为默认视角。

## 3. 核心模块

- 总览：净资产、总资产、负债、可用现金、现金可支撑天数、最近流水。
- 资产：账户资产、净资产、资产结构、现金流趋势。
- 目标：旅行、装修、应急金等攒钱目标，按账户余额自动计算进度和本周期建议分配。
- 补流水：支出、收入、转账，3 秒完成一笔。
- 流水：搜索、筛选、成员、垫付、复制到共同资产池。
- 我的：工资配置、副业配置、目标存款、周期流水、快捷指令、设置。

## 4. 总览信息架构

- 主视觉卡：显示“净资产”，不是单纯流水余额。
- 周期信息：本周期日期范围，例如 04.10 - 05.09，距离发薪还有几天。
- 核心指标：可用现金、目标/投资、负债余额、现金可支撑天数。
- 收入系统：本周期收入、工资、副业收入、副业占比。
- 攒钱系统：现金池 = 收入 - 固定支出 - 目标存款；展示流出、剩余、使用率。
- 资产分布：现金、投资、负债、净资产。
- 核心操作：管理资产、看目标、补流水。
- 最近流水：保留快速补记入口。

## 5. 流水数据模型

```ts
type Transaction = {
  id: string
  amount: number
  type: 'expense' | 'income' | 'transfer'
  categoryId: string
  accountId: string
  bookId: 'personal' | 'family'
  member: string
  payer: string
  owner: string
  isAdvance: boolean
  date: string
  note?: string
  tags: string[]
  receiptUrl?: string
  createdAt: string
}
```

## 6. 工资周期模型

```ts
type IncomePlan = {
  payday: number
  salary: number
  sideTarget: number
  savingTarget: number
  sideNames: string[]
}

type CycleStats = {
  cycleStart: string
  cycleEnd: string
  nextPayday: string
  income: number
  sideIncome: number
  expense: number
  budget: number
  remaining: number
  savingRate: number
  sideRate: number
  dailyAllowance: number
  usageRate: number
}
```

## 7. 攒钱计划逻辑

现金池不是用户随手填一个数字，而是从收入反推：

收入 - 固定支出 - 目标存款 = 日常现金池

示例：

- 收入：20,000
- 目标存款：8,000
- 固定支出：3,000
- 日常现金池：9,000

预警：

- 70%：提醒。
- 90%：警告。
- 100%：超支。

## 8. 情侣 / 家庭系统

- 支持我的资产池和共同资产池快速切换。
- 共同资产池有共同账户、共同收入、共同流出。
- 每笔共同流水记录成员、payer、owner、isAdvance。
- 成员代付可标记为垫付，后续生成内部结算。
- 总览和统计均按当前资产池隔离。

## 9. UI 风格

整体参考深色金融 App + 资产绿/香槟金光感品牌系统：

- 主色：深空黑、资产绿、香槟金、现金流橙、低饱和蓝。
- 情绪：共同目标、共同账户、共同成长。
- 首页视觉记忆点：深色资产卡 + 资产绿光感 + “净资产”大数字。
- 控件风格：8px 圆角、低透明玻璃层、细边框、金色状态反馈。
- 图表风格：自定义环形图、折线图、现金流进度条，避免默认图表感。

## 10. 当前前端实现

- `index.html`：Couple Wealth 移动端信息架构。
- `src/static.css`：深色资产绿品牌视觉系统、响应式移动端布局。
- `src/static.js`：攒钱周期、收入/副业、目标存款、现金池、个人/共同资产池隔离、流水 CRUD。
- `src/data/*`：本机存储与 Supabase 运行时仓储 Adapter，隔离 UI 和后端实现。
- `supabase/schema.sql`：Postgres 表结构、索引、RLS policy 和成员权限边界。
- `docs/IOS_SHORTCUTS.md`：iOS 快捷指令、Siri、OCR、分享菜单和自动化设计。

## 11. 版本规划

- v1：总览、资产、目标、流水、工资系统、攒钱周期、共同资产池、本机模式、Supabase 基础云同步。
- v2：正式账号登录、OCR、自动分类、快捷方式、小组件。
- v3：投资增强、趋势洞察、长期目标、自建后端迁移选项。

产品灵魂：

不是帮你记账，是帮你看清你们的钱是怎么慢慢变多的。
