# Couple Ledger（一起记）产品设计文档 v4.0

## 1. 产品定位

一起记是一款面向打工人情侣、家庭和个人的收入驱动型财务管理 + 记账 App。

核心目标：

- 记录收入：工资、副业、奖金、其他收入。
- 控制支出：固定支出、生活支出、可优化支出。
- 管理工资周期：围绕发薪日计算本周期预算、结余、剩余天数。
- 提升掌控感：打开 App 先知道还能花多少、每天能花多少、能不能撑到下次发薪。

## 2. 核心闭环

产品主线是：

发工资 → 开始周期 → 花钱 → 看剩多少 → 撑到下次发工资

因此首页不以“月报表”为核心，而以“本工资周期”作为默认时间口径。

## 3. 核心模块

- 首页：资产、工资周期、还能花、每日可花、预算进度、最近账单。
- 记账：支出、收入、转账，3 秒完成一笔。
- 账单：流水、搜索、筛选、成员、垫付、复制到家庭账本。
- 资产：账户资产、净资产、支出结构、周期趋势。
- 我的：工资配置、副业配置、目标存款、周期账单、快捷指令、设置。

## 4. 首页信息架构

- 主视觉卡：显示“还能花”，不是单纯余额。
- 周期信息：本周期日期范围，例如 04.10 - 05.09，距离发薪还有几天。
- 核心指标：每日可花、已花 / 预算、存钱率。
- 收入系统：本周期收入、工资、副业收入、副业占比。
- 预算系统：预算 = 收入 - 目标存款；展示已花、剩余、使用率。
- 资产分布：现金、投资、负债、净资产。
- 最近账单：最近流水，保留快速补记入口。

## 5. 记账数据模型

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

## 7. 预算逻辑

预算不是用户随手填一个数字，而是从收入反推：

收入 - 目标存款 = 可花预算

示例：

- 收入：20,000
- 目标存款：8,000
- 可花预算：12,000

预警：

- 70%：提醒。
- 90%：警告。
- 100%：超支。

## 8. 情侣 / 家庭系统

- 支持个人账本和家庭账本快速切换。
- 家庭账本有共同账户、共同收入、共同支出。
- 每笔家庭账单记录成员、payer、owner、isAdvance。
- 成员代付可标记为垫付，后续生成内部结算。
- 首页和统计均按当前账本空间隔离。

## 9. UI 风格

整体参考深色金融 App + 金色光感品牌系统：

- 主色：深空黑、深墨蓝、暖金、清新绿、活力橙。
- 情绪：共同目标、共同账户、共同成长。
- 首页视觉记忆点：深色资产卡 + 金色光感 + “还能花”大数字。
- 控件风格：8px 圆角、低透明玻璃层、细边框、金色状态反馈。
- 图表风格：自定义环形图、折线图、预算进度条，避免默认图表感。

## 10. 当前前端实现

- `index.html`：Couple Ledger 移动端信息架构。
- `src/static.css`：深色金色品牌视觉系统、响应式移动端布局。
- `src/static.js`：工资周期、收入/副业、目标存款、预算、个人/家庭账本隔离、账单 CRUD。
- `docs/IOS_SHORTCUTS.md`：iOS 快捷指令、Siri、OCR、分享菜单和自动化设计。

## 11. 版本规划

- v1：首页、记账、工资系统、工资周期、家庭账本。
- v2：OCR、自动分类、快捷方式、小组件。
- v3：投资增强、趋势洞察、长期目标。

产品灵魂：

不是帮你记账，是帮你看清你们的钱是怎么慢慢变多的。
