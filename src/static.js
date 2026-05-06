import { createLocalWealthStore, isSupabaseConfigured, loadBackendConfig, saveBackendConfig } from './data/wealth-store.js'

const wealthStore = createLocalWealthStore()

const categories = [
  { id: 'food', name: '餐饮', icon: '食', color: '#ebc08a', type: 'expense', budget: 4200 },
  { id: 'transport', name: '交通', icon: '行', color: '#c2d59b', type: 'expense', budget: 1200 },
  { id: 'shopping', name: '购物', icon: '购', color: '#ff8a3d', type: 'expense', budget: 2800 },
  { id: 'home', name: '居住', icon: '住', color: '#7f9b72', type: 'expense', budget: 6500 },
  { id: 'health', name: '医疗', icon: '医', color: '#8ea0a6', type: 'expense', budget: 900 },
  { id: 'education', name: '学习', icon: '学', color: '#bc8a58', type: 'expense', budget: 1500 },
  { id: 'travel', name: '旅行', icon: '旅', color: '#8ea0a6', type: 'expense', budget: 2200 },
  { id: 'digital', name: '数码', icon: '数', color: '#a68b79', type: 'expense', budget: 1800 },
  { id: 'salary', name: '工资', icon: '薪', color: '#47d17a', type: 'income', budget: 0 },
  { id: 'side', name: '副业', icon: '副', color: '#ebc08a', type: 'income', budget: 0 },
  { id: 'bonus', name: '奖金', icon: '奖', color: '#ff8a3d', type: 'income', budget: 0 },
  { id: 'transfer', name: '转账', icon: '转', color: '#8ea0a6', type: 'transfer', budget: 0 },
]

applyStoredCategorySettings()

const iconPaths = {
  home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" />',
  ledger: '<path d="M7 4h10a2 2 0 0 1 2 2v14l-3-1.5-3 1.5-3-1.5L7 20V4Z" /><path d="M10 8h4M10 12h5M10 16h3" />',
  edit: '<path d="M5 19h14" /><path d="M7 15.5V18h2.5L18 9.5 15.5 7 7 15.5Z" /><path d="m14.5 8 1.5 1.5" />',
  pie: '<path d="M12 3v9h9" /><path d="M19.1 15A8 8 0 1 1 9 4.3" />',
  calendar: '<path d="M7 4v3M17 4v3" /><path d="M5 8h14v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8Z" /><path d="M8.5 12h.1M15.5 12h.1" />',
  user: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M5 21a7 7 0 0 1 14 0" />',
  income: '<path d="M5 18 18 5" /><path d="M9 5h9v9" />',
  expense: '<path d="M19 6 6 19" /><path d="M15 19H6v-9" />',
  transfer: '<path d="M7 7h12l-4-4" /><path d="M17 17H5l4 4" />',
  budget: '<circle cx="12" cy="12" r="7" /><path d="M12 7v5l3 2" />',
  goal: '<circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /><path d="m16 8 3-3M19 5v4M19 5h-4" />',
  time: '<circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" />',
  wallet: '<path d="M5 8h13a2 2 0 0 1 2 2v8H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11v3" /><path d="M16 13h4" />',
  briefcase: '<path d="M8 7V5h8v2" /><path d="M5 7h14v11H5V7Z" /><path d="M9 12h6" />',
  bus: '<path d="M6 6h12v10H6V6Z" /><path d="M8 16v2M16 16v2M8 10h8M9 13h.1M15 13h.1" />',
  cloche: '<path d="M5 16h14" /><path d="M7 16a5 5 0 0 1 10 0" /><path d="M12 8V6" /><path d="M8 20h8" />',
  cart: '<path d="M4 5h2l2 10h9l2-7H8" /><circle cx="10" cy="19" r="1" /><circle cx="17" cy="19" r="1" />',
  plus: '<path d="M12 5v14M5 12h14" />',
  book: '<path d="M5 5h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H5V5Z" /><path d="M19 5h-5a3 3 0 0 0-3 3" />',
  suitcase: '<path d="M8 7V5h8v2" /><path d="M5 8h14v11H5V8Z" />',
  gift: '<path d="M5 10h14v10H5V10Z" /><path d="M12 10v10M4 10h16M8.5 6.5C8.5 5.1 10.8 5 12 10c1.2-5 3.5-4.9 3.5-3.5S13.2 9 12 10c-1.2-1-3.5-2.1-3.5-3.5Z" />',
  tag: '<path d="M4 12V5h7l9 9-7 7-9-9Z" /><circle cx="8" cy="8" r="1" />',
  lock: '<path d="M6 10h12v10H6V10Z" /><path d="M8 10V8a4 4 0 0 1 8 0v2" />',
  shield: '<path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" />',
  upload: '<path d="M12 16V5" /><path d="m8 9 4-4 4 4" /><path d="M5 17v2h14v-2" />',
  download: '<path d="M12 5v11" /><path d="m8 12 4 4 4-4" /><path d="M5 19h14" />',
  more: '<circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" />',
}

const ledgerSpaces = [
  {
    id: 'personal',
    name: '我的资产池',
    shortName: '个人',
    eyebrow: 'Personal Wealth Space',
    hero: '个人资产池',
    description: '个人资产、负债、报销、借入借出和现金流记录都在这里闭环。',
    color: '#ebc08a',
    defaultAccountId: 'wechat',
    members: ['我'],
  },
  {
    id: 'family',
    name: '共同资产池',
    shortName: '共同',
    eyebrow: 'Shared Wealth Space',
    hero: '共同资产池',
    description: '共同账户、成员协作、攒钱目标和垫付结算统一管理。',
    color: '#ffb45e',
    defaultAccountId: 'family-card',
    members: ['我', '老婆', '父母'],
  },
]

applyStoredLedgerSpaces()

const incomePlans = {
  personal: {
    payday: 10,
    salary: 18500,
    sideTarget: 3500,
    savingTarget: 8000,
    sideNames: ['小红书', '接私活'],
  },
  family: {
    payday: 10,
    salary: 35000,
    sideTarget: 4600,
    savingTarget: 16800,
    sideNames: ['小红书', '咨询项目'],
  },
}

applyStoredIncomePlans()

const defaultAccounts = [
  { id: 'cash', name: '个人现金', scope: 'personal', type: 'asset', icon: '现', balance: 1280, color: '#46c7a5' },
  { id: 'cmb', name: '个人银行卡', scope: 'personal', type: 'asset', icon: '卡', balance: 48620, color: '#5d7cff' },
  { id: 'wechat', name: '微信钱包', scope: 'personal', type: 'asset', icon: '微', balance: 3240, color: '#22c55e' },
  { id: 'alipay', name: '支付宝', scope: 'personal', type: 'asset', icon: '支', balance: 8960, color: '#1677ff' },
  { id: 'credit', name: '个人信用卡', scope: 'personal', type: 'liability', icon: '信', balance: -5820, color: '#ee5f8c', dueDay: 18, limit: 50000 },
  { id: 'huabei', name: '花呗', scope: 'personal', type: 'liability', icon: '花', balance: -1320, color: '#2f9ed8', dueDay: 10, limit: 18000 },
  { id: 'investment', name: '投资账户', scope: 'personal', type: 'asset', icon: '投', balance: 72600, color: '#0f9f7f' },
  { id: 'family-cash', name: '家庭现金', scope: 'family', type: 'asset', icon: '现', balance: 2600, color: '#46c7a5' },
  { id: 'family-card', name: '家庭银行卡', scope: 'family', type: 'asset', icon: '家', balance: 68520, color: '#101827' },
  { id: 'family-fund', name: '家庭基金', scope: 'family', type: 'asset', icon: '基', balance: 128000, color: '#8972ff' },
  { id: 'renovation-fund', name: '装修账户', scope: 'family', type: 'asset', icon: '装', balance: 42000, color: '#e7a43b' },
  { id: 'travel-fund', name: '旅行账户', scope: 'family', type: 'asset', icon: '旅', balance: 13600, color: '#ef8f6a' },
  { id: 'family-credit', name: '家庭信用卡', scope: 'family', type: 'liability', icon: '信', balance: -9200, color: '#ee5f8c', dueDay: 20, limit: 80000 },
  { id: 'loan', name: '房贷', scope: 'family', type: 'liability', icon: '贷', balance: -880000, color: '#8972ff' },
]

let accounts = loadAccounts()

const books = [
  { id: 'personal', name: '我的资产池', members: '仅自己可见', role: '默认资产池', color: '#4967ff', template: 'personal' },
  { id: 'family', name: '共同资产池', members: '我、老婆', role: '管理员', color: '#101827' },
  { id: 'travel', name: '旅行目标', members: '2 位成员', role: '成员', color: '#5d7cff' },
  { id: 'renovation', name: '装修目标', members: '只读成员 1 位', role: '管理员', color: '#46c7a5' },
  { id: 'love', name: '恋爱基金', members: '情侣模板', role: '模板', color: '#ee5f8c' },
]

const defaultRecurringBills = [
  { id: 'r1', bookId: 'family', title: '房租', categoryId: 'home', amount: 5800, cycle: '每月 1 日', next: '2026-06-01' },
  { id: 'r2', bookId: 'personal', title: 'Netflix 会员', categoryId: 'digital', amount: 68, cycle: '每月 12 日', next: '2026-05-12' },
  { id: 'r3', bookId: 'personal', title: '工资', categoryId: 'salary', amount: 18500, cycle: '每月 30 日', next: '2026-05-30' },
  { id: 'r4', bookId: 'family', title: '房贷还款', categoryId: 'home', amount: 7200, cycle: '每月 20 日', next: '2026-05-20' },
]

let recurringBills = loadRecurringBills()

const savingGoals = {
  personal: [
    { id: 'personal-buffer', title: '个人应急金', target: 80000, accountIds: ['cash', 'cmb', 'wechat', 'alipay'], due: '长期', icon: 'shield' },
    { id: 'personal-invest', title: '长期投资', target: 120000, accountIds: ['investment'], due: '2026 Q4', icon: 'pie' },
  ],
  family: [
    { id: 'family-buffer', title: '家庭备用金', target: 120000, accountIds: ['family-cash', 'family-card'], due: '长期', icon: 'shield' },
    { id: 'renovation-goal', title: '装修基金', target: 80000, accountIds: ['renovation-fund'], due: '2026.10', icon: 'home' },
    { id: 'travel-goal', title: '旅行基金', target: 30000, accountIds: ['travel-fund'], due: '2026.08', icon: 'suitcase' },
  ],
}

const templates = [
  { title: '早餐', scope: 'personal', amount: 28, categoryId: 'food', accountId: 'wechat', note: '早餐', tags: '日常' },
  { title: '咖啡', scope: 'personal', amount: 32, categoryId: 'food', accountId: 'alipay', note: '咖啡', tags: '工作' },
  { title: '打车', scope: 'personal', amount: 46, categoryId: 'transport', accountId: 'wechat', note: '通勤打车', tags: '通勤' },
  { title: '超市购物', scope: 'family', amount: 128, categoryId: 'food', accountId: 'family-card', note: '家庭超市购物', tags: '家庭' },
  { title: '房租', scope: 'family', amount: 5800, categoryId: 'home', accountId: 'family-card', note: '房租', tags: '固定支出' },
  { title: '水电费', scope: 'family', amount: 300, categoryId: 'home', accountId: 'family-card', note: '水电物业', tags: '家庭' },
]

const shortcutActions = [
  {
    id: 'quick-add',
    icon: '记',
    title: '补一笔流水',
    detail: '金额、分类、账户、成员、标签',
    params: 'shortcut=add&type=expense&book=personal&amount=35&note=早餐&category=food&account=wechat&member=我&tags=快捷指令',
  },
  {
    id: 'voice',
    icon: '声',
    title: 'Siri 补流水',
    detail: '自然语言解析，低置信度二次确认',
    params: 'shortcut=voice&text=共同资产池补一笔买菜86元',
  },
  {
    id: 'receipt',
    icon: '扫',
    title: '截图识别',
    detail: 'OCR 提取金额、商户、时间、支付方式',
    params: 'shortcut=receipt&merchant=星巴克&amount=20&account=wechat&confidence=0.92',
  },
  {
    id: 'family',
    icon: '家',
    title: '共同资产入口',
    detail: '直接向共同账户补流水',
    params: 'shortcut=add&type=expense&book=family&amount=128&note=超市购物&category=food&account=family-card&member=我&tags=家庭',
  },
]

const automationRecipes = [
  { title: '每天 22:00 补流水提醒', detail: 'Shortcut: 打开一起攒补流水面板', status: '建议开启' },
  { title: '每月 1 日自动生成工资', detail: 'App Intent: GenerateRecurringBillIntent', status: '可自动' },
  { title: '截图后检测支付凭证', detail: '分享菜单 / 照片输入 OCR 后确认', status: '需确认' },
  { title: '到达公司提醒通勤流出', detail: '位置自动化 + 补流水 Action', status: '场景化' },
]

const seedTransactions = [
  tx('income', '双人工资入账', 35000, 'salary', 'family-card', '我', '2026-04-10', '本周期工资', ['工资'], 'family', '全家'),
  tx('income', '咨询项目副业', 3600, 'side', 'family-card', '老婆', '2026-04-18', '家庭副业收入', ['副业'], 'family', '全家'),
  tx('income', '小红书合作', 1000, 'side', 'family-card', '我', '2026-05-03', '内容合作', ['副业'], 'family', '全家'),
  tx('expense', '周末超市采购', 426.8, 'food', 'family-card', '老婆', '2026-05-04', '水果、牛奶、调味料', ['家庭'], 'family', '全家'),
  tx('expense', '儿童绘本', 168, 'education', 'family-card', '我', '2026-05-02', '绘本套装', ['孩子'], 'family', '孩子'),
  tx('expense', '家政服务', 320, 'home', 'family-cash', '老婆', '2026-05-03', '深度清洁', ['家庭'], 'family', '全家'),
  tx('expense', '周五晚餐', 298, 'food', 'family-card', '老婆', '2026-05-01', '家庭聚餐', ['约会'], 'family', '我、老婆'),
  tx('expense', '周边短途游', 1260, 'travel', 'travel-fund', '老婆', '2026-04-27', '酒店与门票', ['旅行'], 'family', '全家'),
  tx('expense', '信用卡还款', 2200, 'home', 'family-card', '我', '2026-05-02', '自动还款', ['周期'], 'family', '全家'),
  tx('transfer', '转入家庭备用金', 3000, 'transfer', 'family-card', '我', '2026-04-26', '家庭备用金', ['家庭'], 'family', '全家'),
  tx('expense', '停车与地铁', 78, 'transport', 'alipay', '我', '2026-05-04', '通勤', ['通勤'], 'personal'),
  tx('expense', '咖啡和早餐', 62, 'food', 'wechat', '我', '2026-05-04', '拿铁、三明治', ['工作'], 'personal'),
  tx('income', '工资入账', 18500, 'salary', 'cmb', '我', '2026-04-10', '本周期工资', ['固定收入'], 'personal'),
  tx('income', '接私活尾款', 2600, 'side', 'cmb', '我', '2026-04-24', '设计私活', ['副业'], 'personal'),
  tx('income', '小红书合作', 900, 'side', 'alipay', '我', '2026-05-03', '内容合作', ['副业'], 'personal'),
  tx('expense', '运动康复', 188, 'health', 'alipay', '我', '2026-04-30', '肩颈理疗', ['健康'], 'personal'),
  tx('expense', '蓝牙耳机', 699, 'digital', 'credit', '我', '2026-04-29', '通勤耳机', ['数码'], 'personal'),
  tx('expense', '课程报销垫付', 899, 'education', 'credit', '我', '2026-04-28', '待公司报销', ['报销'], 'personal'),
]

const trendData = [520, 680, 460, 760, 920, 610, 993]
const monthlyCompare = [
  { label: '12月', value: 12800 },
  { label: '1月', value: 14300 },
  { label: '2月', value: 11600 },
  { label: '3月', value: 15100 },
  { label: '4月', value: 13700 },
  { label: '5月', value: 9930 },
]

const monthlyComparePersonal = [
  { label: '12月', value: 5200 },
  { label: '1月', value: 6100 },
  { label: '2月', value: 4860 },
  { label: '3月', value: 7300 },
  { label: '4月', value: 6900 },
  { label: '5月', value: 1926 },
]

const defaultHouseholdId = 'FAMILY-520'
let users = loadUsers()
let authMode = 'login'
let appleScriptPromise = null

const state = {
  screen: 'home',
  range: 'month',
  billFilter: 'all',
  dayFilter: '',
  addType: 'expense',
  selectedCategory: 'food',
  activeBook: wealthStore.loadActiveSpace('family'),
  pendingBook: wealthStore.loadActiveSpace('family'),
  pendingMember: currentUser()?.name || '我',
  editingId: '',
  transactions: loadTransactions(),
  currentUserId: wealthStore.loadSessionUserId(),
}

const money = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
})

const preciseMoney = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 2,
})

const elements = {
  userMenu: qs('#userMenu'),
  userAvatar: qs('#userAvatar'),
  userName: qs('#userName'),
  bookSwitcher: qs('#bookSwitcher'),
  heroContext: qs('#heroContext'),
  heroBalance: qs('#heroBalance'),
  monthExpense: qs('#monthExpense'),
  monthIncome: qs('#monthIncome'),
  budgetLeft: qs('#budgetLeft'),
  healthPill: qs('#healthPill'),
  heroTrend: qs('#heroTrend'),
  homeTotalAssets: qs('#homeTotalAssets'),
  homeAssetDelta: qs('#homeAssetDelta'),
  homeNetAssets: qs('#homeNetAssets'),
  homeLiabilities: qs('#homeLiabilities'),
  homeCycleSurplus: qs('#homeCycleSurplus'),
  homeCycleIncome: qs('#homeCycleIncome'),
  homeBudgetStatus: qs('#homeBudgetStatus'),
  homeBudget: qs('#homeBudget'),
  homeSpent: qs('#homeSpent'),
  homeRemaining: qs('#homeRemaining'),
  homeBudgetProgress: qs('#homeBudgetProgress'),
  homeAssetMix: qs('#homeAssetMix'),
  homeAssetMixTag: qs('#homeAssetMixTag'),
  paydayForecastTag: qs('#paydayForecastTag'),
  paydayForecastText: qs('#paydayForecastText'),
  spendPace: qs('#spendPace'),
  projectedBalance: qs('#projectedBalance'),
  sideGrowthTag: qs('#sideGrowthTag'),
  sideIncomeAmount: qs('#sideIncomeAmount'),
  sideIncomeGrowth: qs('#sideIncomeGrowth'),
  sideIncomeShare: qs('#sideIncomeShare'),
  sideIncomeCoverage: qs('#sideIncomeCoverage'),
  cycleSummaryTag: qs('#cycleSummaryTag'),
  cycleSummaryText: qs('#cycleSummaryText'),
  quickTextInput: qs('#quickTextInput'),
  quickTextSave: qs('#quickTextSave'),
  dailyInsight: qs('#dailyInsight'),
  insightCopy: qs('#insightCopy'),
  templateRow: qs('#templateRow'),
  recentList: qs('#recentList'),
  billSearch: qs('#billSearch'),
  filterStrip: qs('#filterStrip'),
  calendarStrip: qs('#calendarStrip'),
  groupedLedger: qs('#groupedLedger'),
  donutChart: qs('#donutChart'),
  topCategory: qs('#topCategory'),
  categoryRank: qs('#categoryRank'),
  lineChart: qs('#lineChart'),
  trendNote: qs('#trendNote'),
  barChart: qs('#barChart'),
  goalProgressAmount: qs('#goalProgressAmount'),
  goalProgressMeta: qs('#goalProgressMeta'),
  goalCountTag: qs('#goalCountTag'),
  goalGrid: qs('#goalGrid'),
  manageGoals: qs('#manageGoals'),
  goalAdvice: qs('#goalAdvice'),
  goalSavingTag: qs('#goalSavingTag'),
  goalAllocation: qs('#goalAllocation'),
  assetScreenNet: qs('#assetScreenNet'),
  assetScreenMeta: qs('#assetScreenMeta'),
  assetAccountCount: qs('#assetAccountCount'),
  assetAccountList: qs('#assetAccountList'),
  manageAssetAccounts: qs('#manageAssetAccounts'),
  netWorth: qs('#netWorth'),
  assetSummary: qs('#assetSummary'),
  profileAvatar: qs('#profileAvatar'),
  profileName: qs('#profileName'),
  profileMeta: qs('#profileMeta'),
  manageAuth: qs('#manageAuth'),
  accountList: qs('#accountList'),
  budgetList: qs('#budgetList'),
  budgetAdvice: qs('#budgetAdvice'),
  bookGrid: qs('#bookGrid'),
  recurringList: qs('#recurringList'),
  shortcutGrid: qs('#shortcutGrid'),
  automationList: qs('#automationList'),
  contextPanel: qs('#contextPanel'),
  sheetBackdrop: qs('#sheetBackdrop'),
  addSheet: qs('#addSheet'),
  closeSheet: qs('#closeSheet'),
  entryType: qs('#entryType'),
  amountInput: qs('#amountInput'),
  categoryGrid: qs('#categoryGrid'),
  bookSelect: qs('#bookSelect'),
  memberSelect: qs('#memberSelect'),
  accountSelect: qs('#accountSelect'),
  dateInput: qs('#dateInput'),
  noteInput: qs('#noteInput'),
  tagInput: qs('#tagInput'),
  saveEntry: qs('#saveEntry'),
  manageAccounts: qs('#manageAccounts'),
  manageRecurring: qs('#manageRecurring'),
  managerPanel: qs('#managerPanel'),
  closeManager: qs('#closeManager'),
  managerEyebrow: qs('#managerEyebrow'),
  managerTitle: qs('#managerTitle'),
  managerBody: qs('#managerBody'),
  authPanel: qs('#authPanel'),
  authTitle: qs('#authTitle'),
  authCopy: qs('#authCopy'),
  authForm: qs('#authForm'),
  authAccount: qs('#authAccount'),
  authPassword: qs('#authPassword'),
  authNameField: qs('#authNameField'),
  authDisplayName: qs('#authDisplayName'),
  authInviteField: qs('#authInviteField'),
  authInviteCode: qs('#authInviteCode'),
  authError: qs('#authError'),
  authSubmit: qs('#authSubmit'),
  authModeToggle: qs('#authModeToggle'),
  appleLoginButton: qs('#appleLoginButton'),
  appleConfigButton: qs('#appleConfigButton'),
}

function tx(type, title, amount, categoryId, accountId, member, date, note, tags, bookId = 'family', beneficiary = '') {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    bookId,
    type,
    title,
    amount,
    categoryId,
    accountId,
    member,
    userId: '',
    userName: member,
    payer: member,
    owner: beneficiary || member,
    isAdvance: tags.includes('我垫付'),
    beneficiary,
    settlement: '',
    date,
    note,
    tags,
    receiptUrl: '',
    createdAt: `${date}T09:00:00.000Z`,
  }
}

function qs(selector) {
  return document.querySelector(selector)
}

function encodePassword(value) {
  return btoa(unescape(encodeURIComponent(String(value))))
}

function normalizeAccountId(value) {
  return String(value || '').trim().toLowerCase()
}

function loadUsers() {
  return wealthStore.loadUsers()
}

function persistUsers() {
  wealthStore.saveUsers(users)
}

function loadAppleConfig() {
  const stored = localStorage.getItem('hezang-apple-config')
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored)
    return parsed?.clientId && parsed?.redirectURI ? parsed : null
  } catch {
    return null
  }
}

function persistAppleConfig(config) {
  localStorage.setItem('hezang-apple-config', JSON.stringify(config))
}

function loadAppleScript() {
  if (window.AppleID?.auth) return Promise.resolve()
  if (appleScriptPromise) return appleScriptPromise
  appleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-appleid-js]')
    const script = existing || document.createElement('script')
    const timer = window.setTimeout(() => {
      appleScriptPromise = null
      reject(new Error('Apple 登录脚本加载超时，请检查网络或先用本机 Apple 登录体验。'))
    }, 9000)
    script.onload = () => {
      window.clearTimeout(timer)
      resolve()
    }
    script.onerror = () => {
      window.clearTimeout(timer)
      appleScriptPromise = null
      reject(new Error('Apple 登录脚本加载失败，请稍后重试。'))
    }
    if (!existing) {
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/zh_CN/appleid.auth.js'
      script.async = true
      script.dataset.appleidJs = 'true'
      document.head.appendChild(script)
    }
  })
  return appleScriptPromise
}

function decodeJwtPayload(token) {
  const [, payload] = String(token || '').split('.')
  if (!payload) return {}
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(decodeURIComponent(escape(atob(padded))))
  } catch {
    return {}
  }
}

function currentUser() {
  const sessionUserId = wealthStore.loadSessionUserId()
  return users.find((item) => item.id === sessionUserId) || null
}

function ensureLocalExperienceSession() {
  const existing = currentUser()
  if (existing) {
    syncUserIntoFamily(existing)
    state.currentUserId = existing.id
    state.pendingMember = existing.name || state.pendingMember || '我'
    return existing
  }

  const inviteCode = new URLSearchParams(window.location.search).get('join')?.trim().toUpperCase() || defaultHouseholdId
  const mockId = 'mock-couple-ledger-user'
  let user = users.find((item) => item.id === mockId || item.account === 'mock:体验账号')
  if (!user) {
    user = {
      id: mockId,
      account: 'mock:体验账号',
      name: '我',
      passwordHash: '',
      householdId: inviteCode,
      role: 'admin',
      provider: 'mock',
      createdAt: new Date().toISOString(),
    }
    users.push(user)
  } else {
    user = {
      ...user,
      name: user.name || '我',
      householdId: user.householdId || inviteCode,
      provider: 'mock',
    }
    users = users.map((item) => (item.id === user.id ? user : item))
  }
  persistUsers()
  wealthStore.saveSessionUserId(user.id)
  syncUserIntoFamily(user)
  state.currentUserId = user.id
  state.pendingMember = user.name
  return user
}

function requireUser() {
  const user = currentUser()
  if (user) return user
  return ensureLocalExperienceSession()
}

function userInitial(name) {
  return String(name || '我').trim().slice(0, 1).toUpperCase() || '我'
}

function syncUserIntoFamily(user) {
  if (!user) return
  const family = ledgerSpaces.find((item) => item.id === 'family')
  const personal = ledgerSpaces.find((item) => item.id === 'personal')
  if (family && user.householdId) family.members = Array.from(new Set([...(family.members || []), user.name]))
  if (personal) personal.members = [user.name]
  persistLedgerSpaces()
}

function loginWithAppleProfile(profile) {
  const provider = profile.provider || 'apple'
  const stableId = String(profile.sub || profile.email || profile.account || '').trim()
  if (!stableId) {
    elements.authError.textContent = 'Apple 登录没有返回可识别的用户 ID，请检查配置。'
    return
  }
  const account = provider === 'apple' ? `apple:${stableId}` : `apple-dev:${stableId}`
  let user = users.find((item) => item.appleSub === stableId || item.account === account)
  if (!user) {
    user = {
      id: uid('user'),
      account,
      name: profile.name || 'Apple 用户',
      passwordHash: '',
      householdId: defaultHouseholdId,
      role: users.length ? 'member' : 'admin',
      provider,
      appleSub: stableId,
      email: profile.email || '',
      createdAt: new Date().toISOString(),
    }
    users.push(user)
  } else {
    user.provider = user.provider || provider
    user.appleSub = user.appleSub || stableId
    user.email = user.email || profile.email || ''
    if (profile.name && user.name === 'Apple 用户') user.name = profile.name
    users = users.map((item) => (item.id === user.id ? user : item))
  }
  persistUsers()
  wealthStore.saveSessionUserId(user.id)
  syncUserIntoFamily(user)
  state.currentUserId = user.id
  state.pendingMember = user.name
  closeManager()
  closeAuthPanel()
  renderApp()
}

function loginWithMockAccount() {
  ensureLocalExperienceSession()
  closeManager()
  closeAuthPanel()
  renderApp()
}

async function signInWithApple() {
  elements.authError.textContent = ''
  const config = loadAppleConfig()
  if (!config) {
    openAppleConfigManager()
    return
  }
  elements.appleLoginButton.disabled = true
  elements.appleLoginButton.dataset.loading = 'true'
  elements.appleLoginButton.innerHTML = '<span></span>正在连接 Apple...'
  try {
    await loadAppleScript()
    const nonce = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    window.AppleID.auth.init({
      clientId: config.clientId,
      scope: 'name email',
      redirectURI: config.redirectURI,
      state: nonce,
      nonce,
      usePopup: true,
    })
    const response = await window.AppleID.auth.signIn()
    const payload = decodeJwtPayload(response?.authorization?.id_token)
    const fullName = response?.user?.name
      ? [response.user.name.firstName, response.user.name.lastName].filter(Boolean).join('')
      : ''
    loginWithAppleProfile({
      provider: 'apple',
      sub: payload.sub,
      email: payload.email,
      name: fullName || payload.email?.split('@')[0] || 'Apple 用户',
    })
  } catch (error) {
    elements.authError.textContent = error?.error || error?.message || 'Apple 登录已取消或配置未通过。'
  } finally {
    elements.appleLoginButton.disabled = false
    elements.appleLoginButton.dataset.loading = 'false'
    elements.appleLoginButton.innerHTML = '<span></span>使用 Apple 登录'
  }
}

function renderAuthState() {
  const user = currentUser()
  const name = user?.name || '未登录'
  const avatar = userInitial(user?.name || '我')
  const accountLabel = user?.provider === 'apple'
    ? 'Apple 登录'
    : user?.provider === 'apple-dev'
      ? '本机 Apple 体验账号'
      : user?.provider === 'mock'
        ? '体验账号'
        : user?.account
  elements.userAvatar.textContent = avatar
  elements.userName.textContent = name
  elements.profileAvatar.textContent = avatar
  elements.profileName.textContent = name
  elements.profileMeta.textContent = user
    ? `${accountLabel} · ${user.householdId ? `家庭 ${user.householdId}` : '未加入家庭'}`
    : '进入后可管理成员、共同资产池'
}

function openAuthPanel(mode = 'login') {
  authMode = mode
  const isRegister = authMode === 'register'
  elements.authTitle.textContent = isRegister ? '创建本机账号' : '体验一起攒'
  elements.authCopy.textContent = isRegister
    ? '真实账号系统先放一放；本机账号仍保留给后续测试。'
    : '账号登录先 mock 掉，点“体验账号进入”即可直接检查共同资产、现金流和补流水流程。'
  elements.authSubmit.textContent = isRegister ? '创建账号' : '登录'
  elements.authModeToggle.textContent = isRegister ? '返回体验登录' : '使用本机账号登录 / 注册'
  elements.authForm.hidden = !isRegister
  elements.authNameField.hidden = !isRegister
  elements.authInviteField.hidden = !isRegister
  if (isRegister) {
    elements.authInviteCode.value = new URLSearchParams(window.location.search).get('join') || elements.authInviteCode.value || defaultHouseholdId
  }
  elements.authError.textContent = ''
  elements.authPanel.hidden = false
  elements.sheetBackdrop.hidden = false
  if (isRegister) window.setTimeout(() => elements.authAccount.focus(), 60)
}

function closeAuthPanel() {
  elements.authPanel.hidden = true
  if (elements.addSheet.hidden && elements.managerPanel.hidden) elements.sheetBackdrop.hidden = true
}

function handleAuthSubmit() {
  const account = normalizeAccountId(elements.authAccount.value)
  const password = elements.authPassword.value
  const passwordHash = encodePassword(password)
  if (!account || password.length < 6) {
    elements.authError.textContent = '账号不能为空，密码至少 6 位。'
    return
  }
  if (authMode === 'register') {
    if (users.some((item) => item.account === account)) {
      elements.authError.textContent = '这个账号已经存在，直接登录就好。'
      return
    }
    const name = elements.authDisplayName.value.trim() || '我'
    const inviteCode = elements.authInviteCode.value.trim().toUpperCase() || defaultHouseholdId
    const user = {
      id: uid('user'),
      account,
      name,
      passwordHash,
      householdId: inviteCode,
      role: users.length ? 'member' : 'admin',
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    persistUsers()
    wealthStore.saveSessionUserId(user.id)
    syncUserIntoFamily(user)
    state.currentUserId = user.id
    state.pendingMember = user.name
    closeAuthPanel()
    renderApp()
    return
  }
  const user = users.find((item) => item.account === account && item.passwordHash === passwordHash)
  if (!user) {
    elements.authError.textContent = '账号或密码不对。'
    return
  }
  wealthStore.saveSessionUserId(user.id)
  syncUserIntoFamily(user)
  state.currentUserId = user.id
  state.pendingMember = user.name
  closeAuthPanel()
  renderApp()
}

function logout() {
  wealthStore.clearSessionUserId()
  state.currentUserId = ''
  state.pendingMember = '我'
  renderApp()
}

function loadTransactions() {
  return wealthStore.loadTransactions(seedTransactions, withSeedBackfill)
}

function loadAccounts() {
  return wealthStore.loadAccounts(defaultAccounts)
}

function persistAccounts() {
  wealthStore.saveAccounts(accounts)
}

function loadRecurringBills() {
  return wealthStore.loadRecurringRules(defaultRecurringBills)
}

function persistRecurringBills() {
  wealthStore.saveRecurringRules(recurringBills)
}

function applyStoredCategorySettings() {
  wealthStore.applyCategorySettings(categories)
}

function persistCategorySettings() {
  wealthStore.saveCategorySettings(categories)
}

function applyStoredIncomePlans() {
  wealthStore.applyIncomePlans(incomePlans)
}

function persistIncomePlans() {
  wealthStore.saveIncomePlans(incomePlans)
}

function applyStoredLedgerSpaces() {
  wealthStore.applyLedgerSpaces(ledgerSpaces)
}

function persistLedgerSpaces() {
  wealthStore.saveLedgerSpaces(ledgerSpaces)
}

function persist() {
  wealthStore.saveTransactions(state.transactions)
}

function normalizeTransactions(items) {
  return items.map((item) => ({
    ...item,
    bookId: item.bookId || 'family',
    member: item.member || '我',
    userId: item.userId || '',
    userName: item.userName || item.member || '我',
    payer: item.payer || item.member || '我',
    owner: item.owner || item.beneficiary || item.member || '我',
    isAdvance: Boolean(item.isAdvance || item.tags?.includes?.('我垫付') || item.settlement === 'advance'),
    beneficiary: item.beneficiary || '',
    settlement: item.settlement || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
  }))
}

function transactionKey(item) {
  return `${item.bookId || 'family'}|${item.type}|${item.title}|${item.amount}|${item.date}`
}

function withSeedBackfill(items) {
  const normalized = normalizeTransactions(items)
  const existing = new Set(normalized.map(transactionKey))
  const missingSeeds = seedTransactions.filter((item) => !existing.has(transactionKey(item)))
  return normalizeTransactions([...missingSeeds, ...normalized])
}

function categoryById(id) {
  return categories.find((item) => item.id === id) || categories[0]
}

function accountById(id) {
  return accounts.find((item) => item.id === id) || accounts[0]
}

function applyAccountDelta(item, direction = 1) {
  const account = accounts.find((entry) => entry.id === item.accountId)
  if (!account) return
  if (item.type === 'income') account.balance += item.amount * direction
  if (item.type === 'expense') {
    account.balance += account.type === 'liability' ? -item.amount * direction : item.amount * -direction
  }
  persistAccounts()
}

function iconSvg(name) {
  return `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.more}</svg>`
}

function categoryIconId(id) {
  return {
    food: 'cloche',
    transport: 'bus',
    shopping: 'cart',
    home: 'home',
    health: 'plus',
    education: 'book',
    travel: 'suitcase',
    digital: 'more',
    salary: 'briefcase',
    side: 'briefcase',
    bonus: 'gift',
    transfer: 'transfer',
  }[id] || 'more'
}

function accountIconId(account) {
  if (account.type === 'liability') return 'wallet'
  if (account.id.includes('fund') || account.id === 'investment') return 'pie'
  if (account.id.includes('travel')) return 'suitcase'
  if (account.id.includes('family')) return 'home'
  return 'wallet'
}

function shortcutIconId(id) {
  return {
    'quick-add': 'edit',
    voice: 'user',
    receipt: 'ledger',
    family: 'home',
  }[id] || 'more'
}

function currentBook() {
  return ledgerSpaces.find((item) => item.id === state.activeBook) || ledgerSpaces[1]
}

function currentDraftBook() {
  return ledgerSpaces.find((item) => item.id === state.pendingBook) || currentBook()
}

function accountsForBook(bookId = state.activeBook) {
  return accounts.filter((item) => item.scope === bookId || item.scope === 'both')
}

function assetStatsForBook(bookId = state.activeBook) {
  const activeAccounts = accountsForBook(bookId)
  const assets = activeAccounts.filter((item) => item.type === 'asset').reduce((sum, item) => sum + item.balance, 0)
  const liabilities = Math.abs(activeAccounts.filter((item) => item.type === 'liability').reduce((sum, item) => sum + item.balance, 0))
  const cash = activeAccounts
    .filter((item) => item.type === 'asset' && !item.id.includes('fund') && item.id !== 'investment')
    .reduce((sum, item) => sum + item.balance, 0)
  const investment = activeAccounts
    .filter((item) => item.id.includes('fund') || item.id === 'investment')
    .reduce((sum, item) => sum + item.balance, 0)
  const totalForMix = Math.max(1, assets + liabilities)
  return {
    accounts: activeAccounts,
    assets,
    liabilities,
    net: assets - liabilities,
    cash,
    investment,
    liabilityShare: liabilities,
    mix: [
      { id: 'cash', label: '现金', value: cash, color: '#22C55E' },
      { id: 'investment', label: '投资', value: investment, color: '#E8C08A' },
      { id: 'liability', label: '负债', value: liabilities, color: '#FF8A3D' },
    ].map((item) => ({ ...item, percent: Math.round((item.value / totalForMix) * 100) })),
  }
}

function goalsForBook(bookId = state.activeBook) {
  return (savingGoals[bookId] || savingGoals.family).map((goal) => {
    const current = goal.accountIds
      .map((accountId) => accounts.find((item) => item.id === accountId))
      .filter(Boolean)
      .reduce((sum, account) => sum + Math.max(0, account.balance), 0)
    const percent = goal.target ? Math.min(100, Math.round((current / goal.target) * 100)) : 0
    return {
      ...goal,
      current,
      percent,
      remaining: Math.max(0, goal.target - current),
      primaryAccountId: goal.accountIds[0] || '',
    }
  })
}

function goalStatsForBook(bookId = state.activeBook) {
  const goals = goalsForBook(bookId)
  const target = goals.reduce((sum, goal) => sum + goal.target, 0)
  const current = goals.reduce((sum, goal) => sum + Math.min(goal.current, goal.target), 0)
  const remaining = goals.reduce((sum, goal) => sum + goal.remaining, 0)
  return {
    goals,
    target,
    current,
    remaining,
    percent: target ? Math.min(100, Math.round((current / target) * 100)) : 0,
  }
}

function transactionsForBook(bookId = state.activeBook) {
  return state.transactions.filter((item) => (item.bookId || 'family') === bookId)
}

function incomePlanForBook(bookId = state.activeBook) {
  return incomePlans[bookId] || incomePlans.family
}

function dateAtNoon(value) {
  return new Date(`${value}T12:00:00`)
}

function pad2(value) {
  return String(value).padStart(2, '0')
}

function formatShortDate(date) {
  return `${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, date.getDate(), 12, 0, 0)
}

function salaryCycleForBook(bookId = state.activeBook) {
  const payday = incomePlanForBook(bookId).payday
  const today = dateAtNoon(todayValue())
  const currentPayday = new Date(today.getFullYear(), today.getMonth(), payday, 12, 0, 0)
  const start = today.getDate() >= payday ? currentPayday : addMonths(currentPayday, -1)
  const nextPayday = today.getDate() >= payday ? addMonths(currentPayday, 1) : currentPayday
  const end = new Date(nextPayday)
  end.setDate(end.getDate() - 1)
  const dayMs = 24 * 60 * 60 * 1000
  const totalDays = Math.max(1, Math.round((end - start) / dayMs) + 1)
  const elapsedDays = Math.min(totalDays, Math.max(1, Math.round((today - start) / dayMs) + 1))
  const daysRemaining = Math.max(0, Math.ceil((nextPayday - today) / dayMs))
  return {
    start,
    end,
    nextPayday,
    startKey: dateKey(start),
    endKey: dateKey(end),
    label: `${formatShortDate(start)} - ${formatShortDate(end)}`,
    daysRemaining,
    totalDays,
    elapsedDays,
    progress: Math.min(100, Math.round((elapsedDays / totalDays) * 100)),
  }
}

function cycleItemsForBook(bookId = state.activeBook) {
  const cycle = salaryCycleForBook(bookId)
  return transactionsForBook(bookId).filter((item) => item.date >= cycle.startKey && item.date <= cycle.endKey)
}

function previousSalaryCycleForBook(bookId = state.activeBook) {
  const current = salaryCycleForBook(bookId)
  const previousEnd = new Date(current.start)
  previousEnd.setDate(previousEnd.getDate() - 1)
  const previousStart = addMonths(current.start, -1)
  const dayMs = 24 * 60 * 60 * 1000
  const totalDays = Math.max(1, Math.round((previousEnd - previousStart) / dayMs) + 1)
  return {
    start: previousStart,
    end: previousEnd,
    startKey: dateKey(previousStart),
    endKey: dateKey(previousEnd),
    label: `${formatShortDate(previousStart)} - ${formatShortDate(previousEnd)}`,
    totalDays,
  }
}

function previousCycleItemsForBook(bookId = state.activeBook) {
  const cycle = previousSalaryCycleForBook(bookId)
  return transactionsForBook(bookId).filter((item) => item.date >= cycle.startKey && item.date <= cycle.endKey)
}

function isFixedExpenseBill(item) {
  const text = `${item.title || ''} ${categoryById(item.categoryId).name} ${item.cycle || ''} ${(item.tags || []).join(' ')}`
  return item.type !== 'income' && /房租|房贷|通勤|订阅|水电|保险|物业|还款|会员|固定/.test(text)
}

function fixedReservedForBook(bookId = state.activeBook) {
  return recurringBills
    .filter((item) => item.bookId === bookId && categoryById(item.categoryId).type !== 'income' && isFixedExpenseBill(item))
    .reduce((sum, item) => sum + item.amount, 0)
}

function todayExpenseForBook(bookId = state.activeBook) {
  return transactionsForBook(bookId)
    .filter((item) => item.type === 'expense' && item.date === todayValue())
    .reduce((sum, item) => sum + item.amount, 0)
}

function sideIncomeForItems(items) {
  return items
    .filter((item) => item.type === 'income' && (item.categoryId === 'side' || item.tags.includes('副业')))
    .reduce((sum, item) => sum + item.amount, 0)
}

function categoryExpenseBreakdown(items) {
  const expense = items.filter((item) => item.type === 'expense')
  const total = expense.reduce((sum, item) => sum + item.amount, 0)
  return categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const amount = expense.filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.amount, 0)
      return { ...category, amount, percent: total ? amount / total : 0 }
    })
    .sort((a, b) => b.amount - a.amount)
}

function consumptionInsightForBook(bookId = state.activeBook, stats = cycleStatsForBook(bookId)) {
  const breakdown = categoryExpenseBreakdown(cycleItemsForBook(bookId))
  const top = breakdown[0]
  const previous = previousCycleItemsForBook(bookId)
  const entertainmentNow = cycleItemsForBook(bookId)
    .filter((item) => item.type === 'expense' && ['travel', 'digital'].includes(item.categoryId))
    .reduce((sum, item) => sum + item.amount, 0)
  const entertainmentPrev = previous
    .filter((item) => item.type === 'expense' && ['travel', 'digital'].includes(item.categoryId))
    .reduce((sum, item) => sum + item.amount, 0)
  if (stats.fixedReserved > stats.income * 0.38) return '本周期固定流出偏高，已经提前预留，日常现金流可以轻一点。'
  if (top?.id === 'food' && top.percent >= 0.34) return `餐饮流出占比 ${Math.round(top.percent * 100)}%，略高，稍微收一收就很好。`
  if (entertainmentNow - entertainmentPrev > 500) return `娱乐和数码流出比上周期增加 ${money.format(entertainmentNow - entertainmentPrev)}，可以留意一下节奏。`
  if (stats.usageRate < 65) return '本周期现金流节奏健康，按现在的速度能比较安心撑到下次发薪。'
  return `${top?.name || '日常'}是本周期主要流出去向，整体还在可控范围内。`
}

function forecastForStats(stats) {
  const pace = stats.variableExpense / Math.max(1, stats.elapsedDays)
  const projectedVariable = pace * stats.totalDays
  const projectedBalance = stats.realBudget - projectedVariable
  const text = projectedBalance >= 0
    ? `按当前节奏，到下次发薪预计剩 ${money.format(projectedBalance)}。`
    : `按当前节奏，可能会超支 ${money.format(Math.abs(projectedBalance))}。`
  return {
    pace,
    projectedBalance,
    text: stats.usageRate < 70 && projectedBalance >= 0 ? `${text} 本周期现金流节奏健康。` : text,
    status: projectedBalance < 0 ? '有超支风险' : stats.usageRate >= 85 ? '注意节奏' : '健康',
  }
}

function cycleSummaryCopy(stats) {
  const saved = stats.income - stats.expense
  const deltaSaved = saved - stats.previousSavings
  const topCategories = categoryExpenseBreakdown(cycleItemsForBook()).slice(0, 2).map((item) => item.name).join('和') || '日常'
  const fixedCopy = stats.fixedReserved ? `固定支出已预留 ${money.format(stats.fixedReserved)}，` : ''
  const optimized = categoryExpenseBreakdown(cycleItemsForBook())
    .filter((item) => ['food', 'shopping', 'digital', 'travel'].includes(item.id))
    .reduce((sum, item) => sum + item.amount, 0)
  return `本周期${currentBook().id === 'family' ? '你们' : '你'}共收入 ${money.format(stats.income)}，目标存款 ${money.format(stats.plan.savingTarget)}，流出 ${money.format(stats.expense)}，${fixedCopy}可优化流出 ${money.format(optimized)}，目前新增资产 ${money.format(saved)}。${deltaSaved >= 0 ? `比上周期多攒 ${money.format(deltaSaved)}` : `比上周期少攒 ${money.format(Math.abs(deltaSaved))}`}。${topCategories}是主要流出去向，整体是在慢慢变厚。`
}

function suggestedDailyAllowance(stats, bookId = state.activeBook) {
  const base = stats.basicDailyAllowance
  const recent = trendValuesForBook(bookId).filter((value) => value > 0)
  const recentAvg = recent.length ? recent.reduce((sum, value) => sum + value, 0) / recent.length : base
  const today = dateAtNoon(todayValue())
  const isWeekend = today.getDay() === 0 || today.getDay() === 6
  const weekendFactor = isWeekend ? 1.12 : 0.9
  const habitFactor = recentAvg > base * 1.15 ? 0.88 : recentAvg < base * 0.65 ? 1.04 : 1
  const fixedCaution = stats.fixedReserved > stats.income * 0.35 ? 0.92 : 1
  return Math.max(0, Math.min(stats.remaining, base * weekendFactor * habitFactor * fixedCaution))
}

function cycleStatsForBook(bookId = state.activeBook) {
  const plan = incomePlanForBook(bookId)
  const cycle = salaryCycleForBook(bookId)
  const cycleItems = cycleItemsForBook(bookId)
  const income = cycleItems.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const sideIncome = sideIncomeForItems(cycleItems)
  const expense = cycleItems.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const fixedReserved = fixedReservedForBook(bookId)
  const fixedActual = cycleItems.filter((item) => item.type === 'expense' && isFixedExpenseBill(item)).reduce((sum, item) => sum + item.amount, 0)
  const variableExpense = Math.max(0, expense - fixedActual)
  const expectedIncome = plan.salary + plan.sideTarget
  const totalIncome = income || expectedIncome
  const realBudget = Math.max(0, totalIncome - fixedReserved - plan.savingTarget)
  const budget = realBudget
  const remaining = Math.max(0, realBudget - variableExpense)
  const savingRate = totalIncome ? Math.max(0, (totalIncome - expense) / totalIncome) : 0
  const sideRate = totalIncome ? sideIncome / totalIncome : 0
  const basicDailyAllowance = remaining / Math.max(1, cycle.daysRemaining || 1)
  const usageRate = budget ? Math.min(100, Math.round((variableExpense / budget) * 100)) : 0
  const previousItems = previousCycleItemsForBook(bookId)
  const previousSideIncome = sideIncomeForItems(previousItems)
  const previousExpense = previousItems.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const previousIncome = previousItems.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0) || totalIncome
  const previousSavings = previousIncome - previousExpense
  const sideGrowthRate = previousSideIncome ? (sideIncome - previousSideIncome) / previousSideIncome : sideIncome ? 1 : 0
  const dailyAllowance = suggestedDailyAllowance({ ...cycle, income: totalIncome, fixedReserved, realBudget, remaining, variableExpense, basicDailyAllowance, usageRate }, bookId)
  const todaySpent = todayExpenseForBook(bookId)
  const todayRemaining = Math.max(0, dailyAllowance - todaySpent)
  return {
    ...cycle,
    plan,
    income: totalIncome,
    actualIncome: income,
    sideIncome,
    previousSideIncome,
    sideGrowthRate,
    expense,
    fixedReserved,
    fixedActual,
    variableExpense,
    realBudget,
    budget,
    remaining,
    savingRate,
    sideRate,
    basicDailyAllowance,
    dailyAllowance,
    todaySpent,
    todayRemaining,
    usageRate,
    previousExpense,
    previousSavings,
  }
}

function trendValuesForBook(bookId = state.activeBook) {
  const days = ['2026-04-28', '2026-04-29', '2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04']
  const values = days.map((date) =>
    transactionsForBook(bookId)
      .filter((item) => item.type === 'expense' && item.date === date)
      .reduce((sum, item) => sum + item.amount, 0),
  )
  return values.some((value) => value > 0) ? values : trendData
}

function monthlyCompareForBook() {
  const source = state.activeBook === 'personal' ? monthlyComparePersonal : monthlyCompare
  return source.map((item) => {
    const month = item.label.replace('月', '').padStart(2, '0')
    const actual = transactionsForBook()
      .filter((txItem) => txItem.type === 'expense' && txItem.date.slice(5, 7) === month)
      .reduce((sum, txItem) => sum + txItem.amount, 0)
    return { ...item, value: actual || item.value }
  })
}

function todayValue() {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}

function expenseTransactions() {
  return transactionsForBook().filter((item) => item.type === 'expense')
}

function monthlyTotals() {
  return transactionsForBook().reduce(
    (totals, item) => {
      if (item.type === 'income') totals.income += item.amount
      if (item.type === 'expense') totals.expense += item.amount
      return totals
    },
    { income: 0, expense: 0 },
  )
}

function renderApp() {
  renderAuthState()
  renderBookSwitcher()
  renderDashboard()
  renderBills()
  renderReports()
  renderGoals()
  renderProfile()
  renderAddSheet()
}

function renderBookSwitcher() {
  elements.bookSwitcher.innerHTML = ledgerSpaces
    .map((book) => {
      const assetStats = assetStatsForBook(book.id)
      const active = state.activeBook === book.id
      return `
        <button class="book-switch ${active ? 'is-active' : ''}" type="button" data-book="${book.id}">
          <span style="background:${book.color}">${book.shortName}</span>
          <strong>${book.name}</strong>
          <em>净资产 ${money.format(assetStats.net)}</em>
        </button>
      `
    })
    .join('')
}

function renderDashboard() {
  const book = currentBook()
  const stats = cycleStatsForBook()
  const assetStats = assetStatsForBook()
  const forecast = forecastForStats(stats)
  const insight = consumptionInsightForBook(state.activeBook, stats)
  const netIncrease = stats.income - stats.expense
  const dailyOutflow = Math.max(1, forecast.pace || stats.dailyAllowance || stats.basicDailyAllowance)
  const runwayDays = Math.floor(assetStats.cash / dailyOutflow)

  elements.heroContext.textContent = `资产总览 · ${book.name}`
  elements.heroBalance.textContent = money.format(assetStats.net)
  elements.monthExpense.textContent = money.format(assetStats.cash)
  elements.monthIncome.textContent = money.format(assetStats.investment)
  elements.budgetLeft.textContent = money.format(assetStats.liabilities)
  elements.healthPill.textContent = `现金可撑 ${runwayDays} 天`
  elements.homeTotalAssets.textContent = money.format(assetStats.assets)
  elements.homeAssetDelta.textContent = `账户 ${assetStats.accounts.length} 个 · 净资产 ${money.format(assetStats.net)}`
  elements.homeNetAssets.textContent = money.format(stats.plan.savingTarget)
  elements.homeLiabilities.textContent = `固定支出预留 ${money.format(stats.fixedReserved)}`
  elements.homeCycleSurplus.textContent = money.format(netIncrease)
  elements.homeCycleIncome.textContent = `收入 ${money.format(stats.income)} · 副业 ${money.format(stats.sideIncome)}`
  elements.homeBudgetStatus.textContent = netIncrease >= stats.plan.savingTarget ? '按计划攒' : stats.usageRate >= 90 ? '收紧现金流' : '可继续攒'
  elements.homeBudget.textContent = money.format(stats.realBudget)
  elements.homeSpent.textContent = money.format(stats.variableExpense)
  elements.homeRemaining.textContent = money.format(stats.remaining)
  elements.homeBudgetProgress.style.width = `${stats.usageRate}%`
  elements.paydayForecastTag.textContent = forecast.status
  elements.paydayForecastText.textContent = forecast.text
  elements.spendPace.textContent = `${money.format(forecast.pace)}/天`
  elements.projectedBalance.textContent = money.format(forecast.projectedBalance)
  elements.sideGrowthTag.textContent = stats.sideGrowthRate >= 0 ? '在增长' : '略回落'
  elements.sideIncomeAmount.textContent = money.format(stats.sideIncome)
  elements.sideIncomeGrowth.textContent = `${stats.sideGrowthRate >= 0 ? '+' : ''}${Math.round(stats.sideGrowthRate * 100)}%`
  elements.sideIncomeShare.textContent = `${Math.round(stats.sideRate * 100)}%`
  elements.sideIncomeCoverage.textContent = `副业收入已覆盖 ${Math.round((stats.sideIncome / Math.max(1, stats.expense)) * 100)}% 的本周期流出，可直接进入目标资金。`
  elements.homeAssetMixTag.textContent = `净资产 ${money.format(assetStats.net)}`
  elements.homeAssetMix.innerHTML = assetStats.mix
    .filter((item) => item.value > 0)
    .map((item) => `
      <div class="asset-mix-row">
        <span><i style="background:${item.color}"></i>${item.label}</span>
        <div><b style="width:${Math.max(4, item.percent)}%; background:${item.color}"></b></div>
        <strong>${money.format(item.value)}</strong>
      </div>
    `)
    .join('')
  elements.cycleSummaryTag.textContent = stats.progress >= 96 ? '本周期总结' : `进度 ${stats.progress}%`
  elements.cycleSummaryText.textContent = cycleSummaryCopy(stats)

  elements.dailyInsight.textContent = assetStats.net >= 0 ? `净资产 ${money.format(assetStats.net)}` : `负债缺口 ${money.format(Math.abs(assetStats.net))}`
  elements.insightCopy.textContent = `可用现金 ${money.format(assetStats.cash)}，按当前日均流出可支撑 ${runwayDays} 天。${forecast.text} ${insight}`

  const activeTrend = trendValuesForBook()
  const maxTrend = Math.max(...activeTrend, 1)
  elements.heroTrend.innerHTML = activeTrend
    .map((value) => `<span style="height:${Math.max(18, Math.round((value / maxTrend) * 54))}px"></span>`)
    .join('')

  elements.templateRow.innerHTML = templates
    .filter((item) => item.scope === state.activeBook)
    .map((item) => {
      const category = categoryById(item.categoryId)
      return `
        <button class="template-chip" type="button" data-template="${item.title}">
          <span>${iconSvg(categoryIconId(category.id))}</span>
          <strong>${item.title}</strong>
          <em>${money.format(item.amount)}</em>
        </button>
      `
    })
    .join('')

  elements.recentList.innerHTML = sortedTransactions()
    .slice(0, 4)
    .map((item) => billRow(item, false))
    .join('')

  renderContextPanel()
}

function renderContextPanel() {
  const book = currentBook()
  const items = transactionsForBook()
  const activeAccounts = accountsForBook()
  const stats = cycleStatsForBook()
  const net = activeAccounts.reduce((sum, item) => sum + item.balance, 0)

  if (book.id === 'personal') {
    const reimbursement = items
      .filter((item) => item.tags.includes('报销') || item.tags.includes('退款'))
      .reduce((sum, item) => sum + item.amount, 0)
    elements.contextPanel.innerHTML = `
      <div class="section-title">
        <div>
          <h3>个人攒钱周期</h3>
          <p>发薪日 ${stats.plan.payday} 号先锁定目标存款，再用现金流护栏管理日常流水。</p>
        </div>
        <span class="soft-tag">副业占比 ${Math.round(stats.sideRate * 100)}%</span>
      </div>
      <div class="space-grid">
        <div class="space-tile"><span>本周期收入</span><strong>${money.format(stats.income)}</strong><em>工资 ${money.format(stats.plan.salary)} · 副业 ${money.format(stats.sideIncome)}</em></div>
        <div class="space-tile"><span>目标存款</span><strong>${money.format(stats.plan.savingTarget)}</strong><em>先攒下，再决定能花多少</em></div>
        <div class="space-tile"><span>个人净资产</span><strong>${money.format(net)}</strong><em>现金、银行卡、信用卡、花呗、投资</em></div>
        <div class="space-tile"><span>待报销 / 退款</span><strong>${money.format(reimbursement)}</strong><em>报销、退款、借入借出、分期预留</em></div>
      </div>
      <div class="cycle-progress">
        <header><span>现金流使用</span><strong>${stats.usageRate}%</strong></header>
        <div class="progress-track"><div class="progress-fill" style="width:${stats.usageRate}%"></div></div>
        <p>日常流出 ${money.format(stats.variableExpense)}，现金池剩余 ${money.format(stats.remaining)}，今天建议上限 ${money.format(stats.dailyAllowance)}。</p>
      </div>
      <div class="capability-row">
        ${['账户资产', '目标存款', '副业记录', '截图识别', '快捷补流水'].map((item) => `<span>${item}</span>`).join('')}
      </div>
      <div class="spend-layer">
        <span>固定支出：房租 / 通勤 / 订阅</span>
        <span>日常流水：餐饮 / 日用 / 购物</span>
        <span>可优化：外卖 / 冲动购物 / 娱乐过度</span>
      </div>
    `
    return
  }

  const familyExpenses = items.filter((item) => item.type === 'expense')
  const totalFamilyExpense = familyExpenses.reduce((sum, item) => sum + item.amount, 0)
  const members = book.members.map((name) => {
    const amount = familyExpenses.filter((item) => item.member === name).reduce((sum, item) => sum + item.amount, 0)
    return { name, amount, percent: totalFamilyExpense ? Math.round((amount / totalFamilyExpense) * 100) : 0 }
  })
  const advance = familyExpenses
    .filter((item) => item.tags.includes('我垫付'))
    .reduce((sum, item) => sum + item.amount, 0)

  elements.contextPanel.innerHTML = `
    <div class="section-title">
      <div>
        <h3>共同攒钱周期</h3>
        <p>两个人一起看净资产、共同账户、目标资金和现金流；流水只是辅助校准。</p>
      </div>
      <span class="soft-tag">存钱率 ${Math.round(stats.savingRate * 100)}%</span>
    </div>
    <div class="space-grid">
      <div class="space-tile"><span>共同收入</span><strong>${money.format(stats.income)}</strong><em>工资 ${money.format(stats.plan.salary)} · 副业 ${money.format(stats.sideIncome)}</em></div>
      <div class="space-tile"><span>目标存款</span><strong>${money.format(stats.plan.savingTarget)}</strong><em>固定支出 ${money.format(stats.fixedReserved)} · 日常现金池 ${money.format(stats.realBudget)}</em></div>
      <div class="space-tile"><span>共同净资产</span><strong>${money.format(net)}</strong><em>家庭现金、银行卡、基金、装修、旅行账户</em></div>
      <div class="space-tile"><span>我垫付待结算</span><strong>${money.format(advance)}</strong><em>标记 is_advance 后生成内部结算</em></div>
    </div>
    <div class="cycle-progress">
      <header><span>撑到下次发薪</span><strong>${stats.daysRemaining} 天</strong></header>
      <div class="progress-track"><div class="progress-fill" style="width:${stats.usageRate}%"></div></div>
      <p>日常流出 ${money.format(stats.variableExpense)} / 现金池 ${money.format(stats.realBudget)}，今天建议上限 ${money.format(stats.dailyAllowance)}。</p>
    </div>
    <div class="member-meter">
      ${members.map((item) => `
        <div class="member-row">
          <span>${item.name}</span>
          <div><i style="width:${Math.max(4, item.percent)}%"></i></div>
          <strong>${item.percent}%</strong>
        </div>
      `).join('')}
    </div>
    <div class="permission-row">
      <span>管理员：管理成员、共同账户、计划、分类</span>
      <span>成员：补流水、查看统计</span>
      <span>只读：仅查看</span>
    </div>
    <div class="spend-layer">
      <span>固定支出：房租 / 房贷 / 水电</span>
      <span>日常流水：餐饮 / 日用 / 育儿</span>
      <span>可优化：外卖 / 冲动购物 / 娱乐过度</span>
    </div>
  `
}

function renderBills() {
  const filters = [
    { id: 'all', name: '全部' },
    { id: 'expense', name: '支出' },
    { id: 'income', name: '收入' },
    { id: 'transfer', name: '转账' },
    { id: 'me', name: '我记的' },
    ...(state.activeBook === 'family' ? [{ id: 'wife', name: '老婆记的' }, { id: 'advance', name: '我垫付' }] : [{ id: 'refund', name: '报销退款' }]),
  ]
  if (!filters.some((item) => item.id === state.billFilter)) state.billFilter = 'all'
  elements.filterStrip.innerHTML = filters
    .map((item) => `<button class="filter-chip ${state.billFilter === item.id ? 'is-active' : ''}" data-filter="${item.id}" type="button">${item.name}</button>`)
    .join('')

  const days = [
    { week: '一', day: '29' },
    { week: '二', day: '30' },
    { week: '三', day: '01' },
    { week: '四', day: '02' },
    { week: '五', day: '03' },
    { week: '六', day: '04' },
  ]
  elements.calendarStrip.innerHTML = days
    .map((item) => {
      const date = `2026-05-${item.day}`
      const active = state.dayFilter ? state.dayFilter === date : item.day === '04'
      return `<button class="day-chip ${active ? 'is-active' : ''}" type="button" data-day="${date}">${item.week}<strong>${item.day}</strong></button>`
    })
    .join('')

  const query = elements.billSearch.value.trim().toLowerCase()
  const filtered = sortedTransactions().filter((item) => {
    const category = categoryById(item.categoryId)
    const account = accountById(item.accountId)
    const haystack = `${item.title} ${category.name} ${account.name} ${item.member} ${item.note} ${item.tags.join(' ')}`.toLowerCase()
    const matchesQuery = !query || haystack.includes(query)
    const matchesDay = !state.dayFilter || item.date === state.dayFilter
    const matchesFilter =
      state.billFilter === 'all' ||
      item.type === state.billFilter ||
      (state.billFilter === 'wife' && item.member === '老婆') ||
      (state.billFilter === 'me' && item.member === '我') ||
      (state.billFilter === 'advance' && item.tags.includes('我垫付')) ||
      (state.billFilter === 'refund' && (item.tags.includes('报销') || item.tags.includes('退款')))
    return matchesQuery && matchesFilter && matchesDay
  })

  const groups = groupByDate(filtered)
  elements.groupedLedger.innerHTML = Object.entries(groups)
    .map(([date, items]) => {
      const dayExpense = items.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
      return `
        <section class="ledger-group">
          <h3><span>${formatDate(date)}</span><span>流出 ${money.format(dayExpense)}</span></h3>
          <div class="compact-list">${items.map((item) => billRow(item, true)).join('')}</div>
        </section>
      `
    })
    .join('') || emptyState('没有找到匹配流水', '换个关键词或筛选条件试试。')
}

function renderReports() {
  const book = currentBook()
  const assetStats = assetStatsForBook()
  elements.assetScreenNet.textContent = money.format(assetStats.net)
  elements.assetScreenMeta.textContent = `${book.name} · 资产 ${money.format(assetStats.assets)} · 负债 ${money.format(assetStats.liabilities)}`
  elements.assetAccountCount.textContent = `${assetStats.accounts.length} 个账户`
  elements.assetAccountList.innerHTML = assetStats.accounts
    .map((item) => `
      <button class="account-row account-action" type="button" data-account="${item.id}">
        <span class="account-icon">${iconSvg(accountIconId(item))}</span>
        <div class="account-main">
          <strong>${item.name}</strong>
          <span>${item.type === 'liability' ? `负债账户 · 还款日 ${item.dueDay || '-'}` : item.id.includes('fund') || item.id === 'investment' ? '投资 / 目标资金' : '现金流账户'}</span>
        </div>
        <strong class="account-balance ${item.balance >= 0 ? 'positive' : ''}">${money.format(item.balance)}</strong>
      </button>
    `)
    .join('')

  const byCategory = categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const amount = expenseTransactions()
        .filter((item) => item.categoryId === category.id)
        .reduce((sum, item) => sum + item.amount, 0)
      return { ...category, amount }
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const total = byCategory.reduce((sum, item) => sum + item.amount, 0)
  let acc = 0
  const gradient = byCategory
    .map((item) => {
      const start = acc
      const size = (item.amount / total) * 100
      acc += size
      return `${item.color} ${start}% ${acc}%`
    })
    .join(', ')
  elements.donutChart.style.background = `conic-gradient(${gradient || '#d8dee8 0 100%'})`
  elements.topCategory.textContent = byCategory[0]?.name || '暂无'
  elements.categoryRank.innerHTML = byCategory
    .slice(0, 5)
    .map((item) => {
      const percent = Math.round((item.amount / total) * 100)
      return `
        <div class="rank-row">
          <span class="bill-icon">${iconSvg(categoryIconId(item.id))}</span>
          <div class="rank-main"><strong>${item.name}</strong><span>${percent}% · ${money.format(item.amount)}</span></div>
          <strong>${percent}%</strong>
        </div>
      `
    })
    .join('')

  renderLineChart()
  renderBarChart()
}

function renderGoals() {
  const stats = cycleStatsForBook()
  const goalStats = goalStatsForBook()
  const goals = goalStats.goals
  const totalRemaining = Math.max(1, goalStats.remaining)
  elements.goalProgressAmount.textContent = `${goalStats.percent}%`
  elements.goalProgressMeta.textContent = `${money.format(goalStats.current)} / ${money.format(goalStats.target)} · 剩余 ${money.format(goalStats.remaining)}`
  elements.goalCountTag.textContent = `${goals.length} 个目标`
  elements.goalSavingTag.textContent = money.format(stats.plan.savingTarget)
  elements.goalAdvice.textContent = goalStats.remaining
    ? `本周期目标存款 ${money.format(stats.plan.savingTarget)}，按目标缺口自动建议分配。`
    : '当前资产池目标已经全部达成，可以新增更长期目标。'

  elements.goalGrid.innerHTML = goals
    .map((goal) => `
      <button class="goal-card" type="button" data-goal-account="${escapeHtml(goal.primaryAccountId)}">
        <span class="goal-icon">${iconSvg(goal.icon)}</span>
        <div class="goal-main">
          <strong>${escapeHtml(goal.title)}</strong>
          <em>${money.format(goal.current)} / ${money.format(goal.target)} · ${goal.due}</em>
          <div class="goal-progress"><i style="width:${goal.percent}%"></i></div>
        </div>
        <b>${goal.percent}%</b>
      </button>
    `)
    .join('')

  elements.goalAllocation.innerHTML = goals
    .filter((goal) => goal.remaining > 0)
    .map((goal) => {
      const amount = Math.round(stats.plan.savingTarget * (goal.remaining / totalRemaining))
      return `
        <div class="allocation-row">
          <span>${escapeHtml(goal.title)}</span>
          <strong>${money.format(amount)}</strong>
          <em>还差 ${money.format(goal.remaining)}</em>
        </div>
      `
    })
    .join('') || '<div class="allocation-row"><span>目标已达成</span><strong>继续新增</strong><em>当前目标资金都已经满额，可以把本周期目标存款转入新的长期目标。</em></div>'
}

function renderLineChart() {
  const width = 340
  const height = 150
  const padding = 18
  const values = trendValuesForBook()
  const max = Math.max(...values, 1)
  const min = Math.min(...values)
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1)
    const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2)
    return [x, y]
  })
  const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const area = `${d} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`
  elements.lineChart.innerHTML = `
    <defs>
      <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#ebc08a" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#c2d59b" stop-opacity="0.04" />
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#lineFill)"></path>
    <path d="${d}" fill="none" stroke="#ebc08a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
    ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#0b1214" stroke="#ebc08a" stroke-width="3"></circle>`).join('')}
  `
  elements.trendNote.textContent = `近 7 天最高单日流出 ${money.format(max)}，最低 ${money.format(min)}，整体仍在现金流护栏内。`
}

function renderBarChart() {
  const values = monthlyCompareForBook()
  const max = Math.max(...values.map((item) => item.value), 1)
  elements.barChart.innerHTML = monthlyCompare
    .map((item, index) => values[index] || item)
    .map((item) => {
      const height = Math.max(18, Math.round((item.value / max) * 138))
      return `<div class="bar-item"><span style="height:${height}px"></span><em>${item.label}</em></div>`
    })
    .join('')
}

function renderProfile() {
  const book = currentBook()
  const stats = cycleStatsForBook()
  const activeAccounts = accountsForBook()
  const assets = activeAccounts.filter((item) => item.type === 'asset').reduce((sum, item) => sum + item.balance, 0)
  const liabilities = Math.abs(activeAccounts.filter((item) => item.type === 'liability').reduce((sum, item) => sum + item.balance, 0))
  elements.netWorth.textContent = money.format(assets - liabilities)
  elements.assetSummary.textContent = `${book.name} · 资产 ${money.format(assets)} · 负债 ${money.format(liabilities)}`

  elements.accountList.innerHTML = activeAccounts
    .map((item) => `
      <button class="account-row account-action" type="button" data-account="${item.id}">
        <span class="account-icon">${iconSvg(accountIconId(item))}</span>
        <div class="account-main">
          <strong>${item.name}</strong>
          <span>${item.type === 'liability' ? `还款日 ${item.dueDay || '-'} · 额度 ${item.limit ? money.format(item.limit) : '长期负债'}` : '可用余额'}</span>
        </div>
        <strong class="account-balance">${money.format(item.balance)}</strong>
      </button>
    `)
    .join('')

  const totalBudget = categories.reduce((sum, item) => sum + item.budget, 0)
  const totalExpense = expenseTransactions().reduce((sum, item) => sum + item.amount, 0)
  elements.budgetAdvice.textContent = stats.usageRate >= 90 ? '收紧' : stats.usageRate >= 70 ? '提醒' : '可攒'
  elements.budgetList.innerHTML = categories
    .filter((item) => item.type === 'expense')
    .map((category) => {
      const spent = expenseTransactions().filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.amount, 0)
      const percent = Math.min(100, Math.round((spent / category.budget) * 100))
      const color = percent > 90 ? '#ee5f8c' : category.color
      return `
        <button class="budget-row budget-action" type="button" data-budget="${category.id}">
          <header><strong>${category.name}</strong><span>${money.format(spent)} / ${money.format(category.budget)}</span></header>
          <div class="progress-track"><div class="progress-fill" style="width:${percent}%; background:${color}"></div></div>
        </button>
      `
    })
    .join('')

  elements.bookGrid.innerHTML = books
    .filter((item) => item.id === 'personal' || item.id === 'family')
    .map((item) => `
      <button class="book-card ${item.id === state.activeBook ? 'is-active' : ''}" type="button" data-profile-book="${item.id}">
        <span class="book-icon">${iconSvg(item.id === 'family' ? 'home' : 'user')}</span>
        <div>
          <strong>${item.name}</strong>
          <span>${item.members} · ${item.role}</span>
        </div>
      </button>
    `)
    .join('')

  elements.bookGrid.innerHTML += `
    <button class="book-card salary-card" type="button" data-manage-budget>
      <span class="book-icon">${iconSvg('briefcase')}</span>
      <div>
        <strong>发薪日 ${stats.plan.payday} 号 · 自动入资产池</strong>
        <span>工资 ${money.format(stats.plan.salary)} · 点击设置攒钱周期</span>
      </div>
    </button>
    <button class="book-card salary-card" type="button" data-manage-budget>
      <span class="book-icon">${iconSvg('goal')}</span>
      <div>
        <strong>副业增长 ${money.format(stats.sideIncome)}</strong>
        <span>${stats.plan.sideNames.join(' / ')} · 点击设置副业目标 ${money.format(stats.plan.sideTarget)}</span>
      </div>
    </button>
  `

  elements.recurringList.innerHTML = recurringBills
    .filter((item) => item.bookId === state.activeBook)
    .map((item) => {
      const category = categoryById(item.categoryId)
      return `
        <button class="recurring-row recurring-action" type="button" data-recurring="${item.id}">
          <span class="bill-icon">${iconSvg(categoryIconId(category.id))}</span>
          <div class="recurring-main"><strong>${item.title}</strong><span>${item.cycle} · 下次 ${item.next}</span></div>
          <strong>${money.format(item.amount)}</strong>
        </button>
      `
    })
    .join('') || emptyState('暂无周期流水', `${book.name} 还没有设置周期流水。`)

  renderShortcutCenter()
}

function renderShortcutCenter() {
  elements.shortcutGrid.innerHTML = shortcutActions
    .map((item) => `
      <button class="shortcut-card" type="button" data-shortcut="${item.id}">
        <span>${iconSvg(shortcutIconId(item.id))}</span>
        <strong>${item.title}</strong>
        <em>${item.detail}</em>
      </button>
    `)
    .join('')

  elements.automationList.innerHTML = automationRecipes
    .map((item) => `
      <div class="automation-row">
        <div>
          <strong>${item.title}</strong>
          <span>${item.detail}</span>
        </div>
        <span class="soft-tag">${item.status}</span>
      </div>
    `)
    .join('')
}

function renderAddSheet() {
  const draftBook = currentDraftBook()
  const activeCategories = categories.filter((item) => item.type === state.addType || (state.addType === 'transfer' && item.type === 'transfer'))
  if (!activeCategories.some((item) => item.id === state.selectedCategory)) {
    state.selectedCategory = activeCategories[0]?.id || 'food'
  }
  const draftAccounts = accountsForBook(state.pendingBook)

  elements.categoryGrid.innerHTML = activeCategories
    .map((item) => `
      <button class="category-choice ${state.selectedCategory === item.id ? 'is-active' : ''}" type="button" data-category="${item.id}">
        <span>${iconSvg(categoryIconId(item.id))}</span>
        ${item.name}
      </button>
    `)
    .join('')

  elements.accountSelect.innerHTML = accounts
    .filter((item) => item.scope === state.pendingBook || item.scope === 'both')
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join('')

  elements.bookSelect.innerHTML = ledgerSpaces
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join('')
  elements.bookSelect.value = state.pendingBook

  const members = draftBook.members
  elements.memberSelect.innerHTML = members
    .map((item) => `<option value="${item}">${item}</option>`)
    .join('')
  if (!members.includes(state.pendingMember)) state.pendingMember = currentUser()?.name || '我'
  elements.memberSelect.value = state.pendingMember

  if (!draftAccounts.some((item) => item.id === elements.accountSelect.value)) {
    elements.accountSelect.value = draftBook.defaultAccountId
  }
}

function billRow(item, withActions) {
  const category = categoryById(item.categoryId)
  const account = accountById(item.accountId)
  const amountClass = item.type === 'income' ? 'income' : item.type === 'expense' ? 'expense' : ''
  const sign = item.type === 'income' ? '+' : item.type === 'expense' ? '-' : ''
  const bookName = item.bookId === 'personal' ? '我的资产池' : '共同资产池'
  const beneficiary = item.beneficiary ? ` · 受益人 ${item.beneficiary}` : ''
  const quickAction = item.bookId === 'personal'
    ? `<button type="button" data-to-family="${item.id}" title="复制到共同资产池">共</button>`
    : `<button type="button" data-advance="${item.id}" title="标记我垫付">垫</button>`
  return `
    <article class="bill-row">
      <span class="bill-icon">${iconSvg(categoryIconId(category.id))}</span>
      <div class="bill-main">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${bookName} · ${category.name} · ${account.name} · ${item.member}${beneficiary} · ${item.tags.join(' / ')}</span>
      </div>
      <strong class="bill-amount ${amountClass}">${sign}${preciseMoney.format(item.amount)}</strong>
      ${withActions ? `
        <div class="bill-actions">
          ${quickAction}
          <button type="button" data-copy="${item.id}">复</button>
          <button type="button" data-edit="${item.id}">编</button>
          <button type="button" data-delete="${item.id}">删</button>
        </div>
      ` : ''}
    </article>
  `
}

function sortedTransactions(items = transactionsForBook()) {
  return [...items].sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
}

function groupByDate(items) {
  return items.reduce((groups, item) => {
    groups[item.date] ||= []
    groups[item.date].push(item)
    return groups
  }, {})
}

function formatDate(date) {
  const [, month, day] = date.split('-')
  return `${month} 月 ${day} 日`
}

function emptyState(title, copy) {
  return `<div class="panel"><div class="insight-card"><div class="insight-icon">?</div><div><h3>${title}</h3><p>${copy}</p></div></div></div>`
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char])
}

function openManager(title, eyebrow, html) {
  elements.managerTitle.textContent = title
  elements.managerEyebrow.textContent = eyebrow
  elements.managerBody.innerHTML = html
  elements.managerPanel.hidden = false
  elements.sheetBackdrop.hidden = false
}

function closeManager() {
  elements.managerPanel.hidden = true
  elements.sheetBackdrop.hidden = true
  elements.managerBody.innerHTML = ''
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function openAccountManager(accountId = '') {
  const book = currentBook()
  const account = accounts.find((item) => item.id === accountId) || {
    id: '',
    name: '',
    scope: state.activeBook,
    type: 'asset',
    balance: 0,
    dueDay: '',
    limit: '',
    color: '#E8C08A',
  }
  const rows = accountsForBook()
    .map((item) => `
      <button class="manager-row" type="button" data-edit-account="${item.id}">
        <span>${iconSvg(accountIconId(item))}</span>
        <div><strong>${item.name}</strong><em>${item.type === 'liability' ? '负债' : '资产'} · ${money.format(item.balance)}</em></div>
      </button>
    `)
    .join('')
  openManager('账户资产管理', book.name, `
    <div class="manager-list">${rows}</div>
    <form class="manager-form" data-account-form>
      <input type="hidden" name="id" value="${escapeHtml(account.id)}" />
      <label>账户名称<input name="name" value="${escapeHtml(account.name)}" placeholder="例如：家庭银行卡" required /></label>
      <div class="form-grid">
        <label>类型
          <select name="type">
            <option value="asset" ${account.type === 'asset' ? 'selected' : ''}>资产</option>
            <option value="liability" ${account.type === 'liability' ? 'selected' : ''}>负债</option>
          </select>
        </label>
        <label>余额<input name="balance" inputmode="decimal" value="${account.balance || 0}" /></label>
      </div>
      <div class="form-grid">
        <label>还款日<input name="dueDay" inputmode="numeric" value="${account.dueDay || ''}" placeholder="信用卡可填" /></label>
        <label>额度<input name="limit" inputmode="decimal" value="${account.limit || ''}" placeholder="可选" /></label>
      </div>
      <div class="manager-actions">
        ${account.id ? '<button type="button" class="danger-button" data-delete-account>删除账户</button>' : '<span></span>'}
        <button type="submit" class="primary-button">${account.id ? '保存账户' : '新增账户'}</button>
      </div>
    </form>
  `)
}

function openBudgetManager(focusCategoryId = '') {
  const plan = incomePlanForBook()
  const rows = categories
    .filter((item) => item.type === 'expense')
    .map((item) => `
      <label>${item.name}
        <input name="budget-${item.id}" inputmode="decimal" value="${item.budget}" ${item.id === focusCategoryId ? 'autofocus' : ''} />
      </label>
    `)
    .join('')
  openManager('攒钱周期与现金流', currentBook().name, `
    <form class="manager-form" data-budget-form>
      <div class="form-grid">
        <label>发薪日<input name="payday" inputmode="numeric" value="${plan.payday}" /></label>
        <label>工资收入<input name="salary" inputmode="decimal" value="${plan.salary}" /></label>
      </div>
      <div class="form-grid">
        <label>副业目标<input name="sideTarget" inputmode="decimal" value="${plan.sideTarget}" /></label>
        <label>目标存款<input name="savingTarget" inputmode="decimal" value="${plan.savingTarget}" /></label>
      </div>
      <label>副业来源<input name="sideNames" value="${escapeHtml(plan.sideNames.join(' / '))}" placeholder="小红书 / 接私活" /></label>
      <div class="manager-subtitle">日常分类护栏</div>
      <div class="form-grid">${rows}</div>
      <div class="manager-actions">
        <span>现金池 = 收入 - 固定支出 - 目标存款</span>
        <button type="submit" class="primary-button">保存计划</button>
      </div>
    </form>
  `)
}

function openLedgerManager() {
  const book = currentBook()
  const memberRows = book.members
    .map((member) => `
      <button class="manager-row" type="button" data-remove-member="${escapeHtml(member)}">
        <span>${iconSvg(member === '我' ? 'user' : 'home')}</span>
        <div><strong>${member}</strong><em>${member === '我' ? '管理员' : '成员'} · 点击移除</em></div>
      </button>
    `)
    .join('')
  openManager('共同资产池', book.name, `
    <div class="manager-copy">
      <strong>${book.name}</strong>
      <span>${book.description}</span>
    </div>
    <div class="manager-list">${memberRows}</div>
    <form class="manager-form" data-ledger-form>
      <label>新增成员<input name="member" placeholder="例如：老婆 / 父母 / 室友" /></label>
      <div class="manager-actions">
        <button type="button" data-copy-family-link>复制邀请链接</button>
        <button type="submit" class="primary-button">添加成员</button>
      </div>
    </form>
  `)
}

function openRecurringManager(recurringId = '') {
  const item = recurringBills.find((bill) => bill.id === recurringId) || {
    id: '',
    bookId: state.activeBook,
    title: '',
    categoryId: 'home',
    amount: 0,
    cycle: '每月 1 日',
    next: todayValue(),
  }
  const list = recurringBills
    .filter((bill) => bill.bookId === state.activeBook)
    .map((bill) => `<button class="manager-row" type="button" data-edit-recurring="${bill.id}"><span>${iconSvg(categoryIconId(bill.categoryId))}</span><div><strong>${bill.title}</strong><em>${bill.cycle} · ${money.format(bill.amount)}</em></div></button>`)
    .join('')
  openManager('周期流水', currentBook().name, `
    <div class="manager-list">${list || '<div class="manager-copy"><span>当前资产池还没有周期流水。</span></div>'}</div>
    <form class="manager-form" data-recurring-form>
      <input type="hidden" name="id" value="${escapeHtml(item.id)}" />
      <label>名称<input name="title" value="${escapeHtml(item.title)}" placeholder="例如：房租 / 工资 / 会员" required /></label>
      <div class="form-grid">
        <label>金额<input name="amount" inputmode="decimal" value="${item.amount || 0}" /></label>
        <label>分类
          <select name="categoryId">${categories.map((category) => `<option value="${category.id}" ${category.id === item.categoryId ? 'selected' : ''}>${category.name}</option>`).join('')}</select>
        </label>
      </div>
      <div class="form-grid">
        <label>周期<input name="cycle" value="${escapeHtml(item.cycle)}" /></label>
        <label>下次日期<input name="next" type="date" value="${item.next}" /></label>
      </div>
      <div class="manager-actions">
        ${item.id ? '<button type="button" class="danger-button" data-delete-recurring>删除周期流水</button>' : '<span></span>'}
        <button type="submit" class="primary-button">${item.id ? '保存周期流水' : '新增周期流水'}</button>
      </div>
    </form>
  `)
}

function openSettingPanel(setting) {
  const backendConfig = loadBackendConfig()
  const payload = JSON.stringify({
    users,
    currentUser: currentUser()?.id || '',
    transactions: state.transactions,
    accounts,
    recurringBills,
    incomePlans,
    ledgerSpaces,
    backendMode: backendConfig.mode,
  }, null, 2)
  const cloudReady = isSupabaseConfigured(backendConfig)
  const titles = {
    theme: '主题设置',
    export: '数据导入导出',
    privacy: '隐私锁',
    sync: '云同步',
  }
  const bodies = {
    theme: `
      <div class="manager-copy"><strong>当前为高级深色主题</strong><span>主题偏好会保存在本机浏览器。浅色主题已作为后续产品方向保留。</span></div>
      <button class="primary-button full-button" type="button" data-toggle-private>切换隐私模式</button>
    `,
    export: `
      <div class="manager-copy"><strong>导入 / 导出数据</strong><span>可备份当前浏览器里的流水、账户、周期流水和攒钱计划，也可以粘贴 JSON 恢复。</span></div>
      <textarea class="export-box">${escapeHtml(payload)}</textarea>
      <div class="manager-actions">
        <button type="button" data-import-export>导入文本</button>
        <button class="primary-button" type="button" data-copy-export>复制 JSON</button>
      </div>
    `,
    privacy: `
      <div class="manager-copy"><strong>本机隐私锁</strong><span>纯前端版本无法调用 Face ID，但可以一键隐藏金额，适合公共场合查看。</span></div>
      <button class="primary-button full-button" type="button" data-toggle-private>隐藏 / 显示金额</button>
    `,
    sync: `
      <div class="manager-copy"><strong>${cloudReady ? 'Supabase 配置已保存' : '当前为本机模式'}</strong><span>前端已经通过数据 Adapter 隔离本机存储和云端实现。填入 Supabase 配置后，可继续接入真实登录、云同步和 Realtime。</span></div>
      <form class="manager-form" data-sync-config-form>
        <label>后端模式
          <select name="mode">
            <option value="local" ${backendConfig.mode !== 'supabase' ? 'selected' : ''}>本机 localStorage</option>
            <option value="supabase" ${backendConfig.mode === 'supabase' ? 'selected' : ''}>Supabase Postgres</option>
          </select>
        </label>
        <label>Supabase URL<input name="supabaseUrl" value="${escapeHtml(backendConfig.supabaseUrl)}" placeholder="https://xxxx.supabase.co" /></label>
        <label>Supabase anon key<input name="supabaseAnonKey" value="${escapeHtml(backendConfig.supabaseAnonKey)}" placeholder="只填 anon public key，不填 service_role" /></label>
        <div class="manager-actions">
          <span>DB schema 在 supabase/schema.sql</span>
          <button type="submit" class="primary-button">保存后端配置</button>
        </div>
      </form>
      <div class="manager-list">
        <div class="manager-row"><span>${iconSvg('shield')}</span><div><strong>RLS 权限边界</strong><em>profiles / asset_spaces / memberships 按成员角色隔离。</em></div></div>
        <div class="manager-row"><span>${iconSvg('home')}</span><div><strong>共同资产表</strong><em>accounts / transactions / goals / recurring_rules / income_plans</em></div></div>
      </div>
    `,
  }
  openManager(titles[setting] || '设置', 'Settings', bodies[setting] || bodies.sync)
}

function openAuthManager() {
  const user = currentUser()
  if (!user) {
    openAuthPanel('login')
    return
  }
  const providerLabel = user.provider === 'apple'
    ? 'Apple 登录'
    : user.provider === 'apple-dev'
      ? '本机 Apple 体验账号'
      : user.provider === 'mock'
        ? '体验账号'
        : '本机账号'
  openManager('账号与共同资产', user.name, `
    <div class="manager-copy">
      <strong>${escapeHtml(user.name)}</strong>
      <span>${escapeHtml(providerLabel)} · ${user.role === 'admin' ? '共同资产管理员' : '共同成员'}</span>
    </div>
    <form class="manager-form" data-profile-form>
      <label>昵称<input name="name" value="${escapeHtml(user.name)}" required /></label>
      <label>共同资产邀请码<input name="householdId" value="${escapeHtml(user.householdId || defaultHouseholdId)}" placeholder="例如 FAMILY-520" /></label>
      <div class="manager-actions">
        <button type="button" class="danger-button" data-logout>退出登录</button>
        <button type="submit" class="primary-button">保存账号</button>
      </div>
    </form>
    <div class="manager-list">
      <button class="manager-row" type="button" data-open-register>
        <span>${iconSvg('user')}</span>
        <div><strong>给老婆创建账号</strong><em>同一台设备可先创建成员账号；真正跨设备同步需要接 Supabase。</em></div>
      </button>
      <button class="manager-row" type="button" data-copy-family-link>
        <span>${iconSvg('home')}</span>
        <div><strong>复制共同资产邀请链接</strong><em>${escapeHtml(user.householdId || defaultHouseholdId)}</em></div>
      </button>
      <button class="manager-row" type="button" data-open-apple-config>
        <span></span>
        <div><strong>Apple 登录配置</strong><em>配置 Services ID 和回调地址，正式接入 Sign in with Apple。</em></div>
      </button>
    </div>
  `)
}

function openAppleConfigManager() {
  if (!elements.authPanel.hidden) closeAuthPanel()
  const config = loadAppleConfig() || {}
  const suggestedRedirect = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '/')
  openManager('Apple 登录', 'Sign in with Apple', `
    <div class="manager-copy">
      <strong>正式上线需要 Apple Developer 配置</strong>
      <span>Web 端需要 Services ID 作为 clientId，并把当前站点地址加入 Return URL。生产环境还要在后端校验 Apple 返回的 token / code。</span>
    </div>
    <form class="manager-form" data-apple-config-form>
      <label>Services ID / Client ID<input name="clientId" value="${escapeHtml(config.clientId || '')}" placeholder="例如 com.yourname.coupleledger.web" /></label>
      <label>Return URL<input name="redirectURI" value="${escapeHtml(config.redirectURI || suggestedRedirect)}" placeholder="${escapeHtml(suggestedRedirect)}" /></label>
      <div class="manager-actions">
        <button type="button" data-dev-apple-login>本机 Apple 登录体验</button>
        <button type="submit" class="primary-button">保存配置</button>
      </div>
    </form>
    <div class="manager-list">
      <div class="manager-row">
        <span>${iconSvg('shield')}</span>
        <div><strong>生产安全边界</strong><em>当前静态版只负责唤起 Apple 登录；多人同步和 token 验证建议接 Supabase Edge Function 或你的后端。</em></div>
      </div>
      <div class="manager-row">
        <span>${iconSvg('home')}</span>
        <div><strong>共同资产身份</strong><em>Apple 登录后仍会绑定共同邀请码，每笔流水会保留成员与 userId。</em></div>
      </div>
    </div>
  `)
}

function openSheet(template) {
  const user = requireUser()
  if (!user) return
  elements.addSheet.hidden = false
  elements.sheetBackdrop.hidden = false
  state.editingId = ''
  if (template) {
    prefillEntry({
      type: 'expense',
      bookId: template.scope || state.activeBook,
      categoryId: template.categoryId,
      amount: template.amount,
      accountId: template.accountId,
      note: template.note,
      tags: template.tags,
    })
  } else {
    state.pendingBook = state.activeBook
    state.pendingMember = user.name
    renderAddSheet()
    elements.accountSelect.value = wealthStore.loadLastAccount(state.pendingBook) || currentBook().defaultAccountId
    elements.dateInput.value = todayValue()
  }
  window.setTimeout(() => elements.amountInput.focus(), 80)
}

function closeSheet() {
  elements.addSheet.hidden = true
  elements.sheetBackdrop.hidden = true
}

function switchScreen(screen) {
  state.screen = screen
  document.querySelectorAll('.screen').forEach((item) => item.classList.toggle('is-active', item.dataset.screen === screen))
  document.querySelectorAll('.tab-bar [data-tab]').forEach((item) => item.classList.toggle('is-active', item.dataset.tab === screen))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function syncEntryTypeButtons() {
  document.querySelectorAll('#entryType button').forEach((item) => item.classList.toggle('is-active', item.dataset.type === state.addType))
}

function prefillEntry(draft) {
  state.addType = draft.type || 'expense'
  state.selectedCategory = draft.categoryId || (state.addType === 'income' ? 'salary' : state.addType === 'transfer' ? 'transfer' : 'food')
  state.pendingBook = draft.bookId || state.activeBook
  state.pendingMember = draft.member || currentUser()?.name || '我'
  syncEntryTypeButtons()
  renderAddSheet()
  elements.amountInput.value = draft.amount || ''
  elements.bookSelect.value = state.pendingBook
  elements.memberSelect.value = state.pendingMember
  const validAccounts = accountsForBook(state.pendingBook)
  const accountId = validAccounts.some((item) => item.id === draft.accountId) ? draft.accountId : currentDraftBook().defaultAccountId
  elements.accountSelect.value = accountId
  elements.dateInput.value = draft.date || todayValue()
  elements.noteInput.value = draft.note || ''
  elements.tagInput.value = Array.isArray(draft.tags) ? draft.tags.join(' ') : draft.tags || ''
}

function addTransactionFromSheet() {
  const user = requireUser()
  if (!user) return
  const amount = Number(elements.amountInput.value)
  if (!Number.isFinite(amount) || amount <= 0) return
  const category = categoryById(state.selectedCategory)
  const note = elements.noteInput.value.trim()
  const tags = elements.tagInput.value.split(/[,，、 ]/).map((item) => item.trim()).filter(Boolean)
  const nextTransaction = tx(
    state.addType,
    note || category.name,
    amount,
    state.selectedCategory,
    elements.accountSelect.value,
    state.pendingMember || user.name,
    elements.dateInput.value || todayValue(),
    note,
    tags.length ? tags : ['手动流水'],
  )
  nextTransaction.bookId = state.pendingBook
  nextTransaction.userId = user.id
  nextTransaction.userName = user.name
  nextTransaction.payer = state.pendingMember || user.name
  nextTransaction.owner = state.pendingBook === 'family' ? '全家' : state.pendingMember || user.name
  nextTransaction.isAdvance = tags.includes('我垫付')
  wealthStore.saveLastAccount(state.pendingBook, nextTransaction.accountId)
  wealthStore.saveLastCategory(state.pendingBook, state.addType, nextTransaction.categoryId)
  if (state.editingId) {
    nextTransaction.id = state.editingId
    const original = state.transactions.find((item) => item.id === state.editingId)
    if (original) applyAccountDelta(original, -1)
    nextTransaction.createdAt = original?.createdAt || nextTransaction.createdAt
    state.transactions = state.transactions.map((item) => (item.id === state.editingId ? nextTransaction : item))
  } else {
    state.transactions.unshift(nextTransaction)
  }
  applyAccountDelta(nextTransaction, 1)
  persist()
  elements.amountInput.value = ''
  elements.noteInput.value = ''
  elements.tagInput.value = ''
  state.addType = 'expense'
  state.selectedCategory = 'food'
  state.activeBook = nextTransaction.bookId
  state.pendingBook = state.activeBook
  state.pendingMember = user.name
  state.editingId = ''
  wealthStore.saveActiveSpace(state.activeBook)
  syncEntryTypeButtons()
  closeSheet()
  renderApp()
}

function saveQuickTextEntry() {
  const text = elements.quickTextInput.value.trim()
  const draft = parseQuickEntry(text)
  if (!draft.amount) {
    elements.quickTextInput.focus()
    return
  }
  prefillEntry(draft)
  addTransactionFromSheet()
  elements.quickTextInput.value = ''
}

function shortcutUrl(params) {
  return `${window.location.origin}${window.location.pathname}?${params}`
}

function applyShortcutParams(params, shouldAutoSave = false) {
  const mode = params.get('shortcut')
  if (!mode) return false

  if (mode === 'voice') {
    const parsed = parseLedgerText(params.get('text') || '')
    openSheet()
    prefillEntry(parsed)
    return true
  }

  if (mode === 'receipt') {
    openSheet()
    prefillEntry({
      type: 'expense',
      amount: params.get('amount') || 0,
      bookId: params.get('book') || 'family',
      categoryId: inferCategory(`${params.get('merchant') || ''} ${params.get('text') || ''}`),
      accountId: params.get('account') || 'wechat',
      note: `${params.get('merchant') || '截图识别流水'} · OCR 置信度 ${params.get('confidence') || '待确认'}`,
      tags: '截图 识别',
      member: params.get('member') || '我',
    })
    return true
  }

  if (mode === 'add') {
    openSheet()
    prefillEntry({
      type: params.get('type') || 'expense',
      amount: params.get('amount') || '',
      bookId: params.get('book') || 'family',
      categoryId: params.get('category') || inferCategory(params.get('note') || ''),
      accountId: params.get('account') || 'wechat',
      date: params.get('date') || todayValue(),
      note: params.get('note') || '',
      tags: params.get('tags') || '快捷指令',
      member: params.get('member') || '我',
    })
    if (shouldAutoSave || params.get('confirm') === 'auto') {
      addTransactionFromSheet()
    }
    return true
  }

  return false
}

function parseLedgerText(text) {
  const amount = text.match(/(\d+(?:\.\d+)?)\s*元?/)?.[1] || ''
  const type = text.includes('收入') || text.includes('工资') ? 'income' : text.includes('转账') ? 'transfer' : 'expense'
  const bookId = text.includes('个人账本') ? 'personal' : 'family'
  const accountId = text.includes('家庭银行卡')
    ? 'family-card'
    : text.includes('银行卡')
      ? (bookId === 'family' ? 'family-card' : 'cmb')
      : text.includes('支付宝')
        ? 'alipay'
        : text.includes('现金')
          ? (bookId === 'family' ? 'family-cash' : 'cash')
          : (bookId === 'family' ? 'family-card' : 'wechat')
  const member = text.includes('老婆') ? '老婆' : '我'
  const categoryId = type === 'income' ? 'salary' : type === 'transfer' ? 'transfer' : inferCategory(text)
  const note = text
    .replace(/嘿 Siri|家庭账本|个人账本|记一笔|记录|支出|收入|转账|从|账户|元/g, '')
    .replace(amount, '')
    .trim() || categoryById(categoryId).name
  return { type, amount, bookId, categoryId, accountId, note, tags: text.includes('家庭') ? '家庭 Siri' : 'Siri', member }
}

function parseQuickEntry(text) {
  const user = currentUser()
  const amount = text.match(/(\d+(?:\.\d+)?)/)?.[1] || ''
  const categoryId = inferCategory(text)
  const type = /收入|工资|副业|奖金/.test(text) ? 'income' : 'expense'
  const bookId = state.activeBook
  const accountId = wealthStore.loadLastAccount(bookId) || currentBook().defaultAccountId
  const note = text.replace(amount, '').replace(/元/g, '').trim() || categoryById(categoryId).name
  return {
    type,
    amount,
    bookId,
    categoryId: type === 'income' ? (text.includes('副业') ? 'side' : 'salary') : categoryId,
    accountId,
    date: todayValue(),
    note,
    tags: '快捷输入',
    member: user?.name || '我',
  }
}

function inferCategory(text) {
  if (/早餐|咖啡|买菜|超市|外卖|餐|午饭|晚饭|奶茶|星巴克/.test(text)) return 'food'
  if (/打车|地铁|通勤|公交|油费/.test(text)) return 'transport'
  if (/房租|房贷|水电|物业|居住/.test(text)) return 'home'
  if (/会员|数码|手机|电脑|耳机/.test(text)) return 'digital'
  if (/医疗|药|医院|理疗/.test(text)) return 'health'
  if (/书|课程|教育|绘本/.test(text)) return 'education'
  if (/旅行|酒店|机票|门票/.test(text)) return 'travel'
  return 'shopping'
}

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => switchScreen(button.dataset.tab))
})

document.querySelectorAll('[data-open-add]').forEach((button) => {
  button.addEventListener('click', () => openSheet())
})

document.querySelectorAll('[data-switch-screen]').forEach((button) => {
  button.addEventListener('click', () => switchScreen(button.dataset.switchScreen))
})

document.querySelectorAll('[data-range]').forEach((button) => {
  button.addEventListener('click', () => {
    state.range = button.dataset.range
    document.querySelectorAll('[data-range]').forEach((item) => item.classList.toggle('is-active', item === button))
  })
})

qs('.privacy-toggle').addEventListener('click', () => {
  document.body.classList.toggle('is-private')
})

elements.userMenu.addEventListener('click', openAuthManager)
elements.manageAuth.addEventListener('click', openAuthManager)
elements.appleLoginButton.addEventListener('click', loginWithMockAccount)
elements.appleConfigButton.addEventListener('click', openAppleConfigManager)
elements.authModeToggle.addEventListener('click', () => openAuthPanel(elements.authForm.hidden ? 'register' : 'login'))
elements.authForm.addEventListener('submit', (event) => {
  event.preventDefault()
  handleAuthSubmit()
})

elements.bookSwitcher.addEventListener('click', (event) => {
  const button = event.target.closest('[data-book]')
  if (!button) return
  state.activeBook = button.dataset.book
  state.pendingBook = state.activeBook
  state.pendingMember = '我'
  state.billFilter = 'all'
  wealthStore.saveActiveSpace(state.activeBook)
  renderApp()
})

elements.templateRow.addEventListener('click', (event) => {
  const button = event.target.closest('[data-template]')
  if (!button) return
  const template = templates.find((item) => item.title === button.dataset.template)
  openSheet(template)
})

elements.quickTextSave.addEventListener('click', saveQuickTextEntry)
elements.quickTextInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') saveQuickTextEntry()
})

elements.filterStrip.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]')
  if (!button) return
  state.billFilter = button.dataset.filter
  renderBills()
})

elements.calendarStrip.addEventListener('click', (event) => {
  const button = event.target.closest('[data-day]')
  if (!button) return
  state.dayFilter = state.dayFilter === button.dataset.day ? '' : button.dataset.day
  renderBills()
})

elements.groupedLedger.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete]')
  const copyButton = event.target.closest('[data-copy]')
  const editButton = event.target.closest('[data-edit]')
  const toFamilyButton = event.target.closest('[data-to-family]')
  const advanceButton = event.target.closest('[data-advance]')
  if (deleteButton) {
    const deleted = state.transactions.find((item) => item.id === deleteButton.dataset.delete)
    if (deleted) applyAccountDelta(deleted, -1)
    state.transactions = state.transactions.filter((item) => item.id !== deleteButton.dataset.delete)
    persist()
    renderApp()
    return
  }
  if (toFamilyButton) {
    const source = state.transactions.find((item) => item.id === toFamilyButton.dataset.toFamily)
    if (!source) return
    const duplicate = {
      ...source,
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      bookId: 'family',
      accountId: 'family-card',
      member: '我',
      beneficiary: '全家',
      tags: Array.from(new Set([...source.tags, '转家庭'])),
      createdAt: new Date().toISOString(),
    }
    state.transactions.unshift(duplicate)
    applyAccountDelta(duplicate, 1)
    state.activeBook = 'family'
    state.pendingBook = 'family'
    wealthStore.saveActiveSpace(state.activeBook)
    persist()
    renderApp()
    return
  }
  if (advanceButton) {
    const source = state.transactions.find((item) => item.id === advanceButton.dataset.advance)
    if (!source) return
    source.tags = Array.from(new Set([...source.tags, '我垫付']))
    source.settlement = 'advance'
    source.member = source.member || '我'
    persist()
    renderApp()
    return
  }
  if (copyButton || editButton) {
    const source = state.transactions.find((item) => item.id === (copyButton || editButton).dataset[copyButton ? 'copy' : 'edit'])
    if (!source) return
    openSheet()
    state.editingId = editButton ? source.id : ''
    prefillEntry({
      type: source.type,
      amount: source.amount,
      bookId: source.bookId,
      categoryId: source.categoryId,
      accountId: source.accountId,
      date: source.date,
      note: editButton ? source.note : `${source.note || source.title} 副本`,
      tags: source.tags,
      member: source.member,
    })
  }
})

elements.shortcutGrid.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-shortcut]')
  if (!button) return
  const action = shortcutActions.find((item) => item.id === button.dataset.shortcut)
  if (!action) return
  await navigator.clipboard?.writeText(shortcutUrl(action.params))
  applyShortcutParams(new URLSearchParams(action.params))
})

elements.billSearch.addEventListener('input', renderBills)

elements.entryType.addEventListener('click', (event) => {
  const button = event.target.closest('[data-type]')
  if (!button) return
  state.addType = button.dataset.type
  syncEntryTypeButtons()
  renderAddSheet()
})

elements.bookSelect.addEventListener('change', () => {
  state.pendingBook = elements.bookSelect.value
  state.pendingMember = state.pendingBook === 'personal' ? '我' : elements.memberSelect.value
  renderAddSheet()
})

elements.memberSelect.addEventListener('change', () => {
  state.pendingMember = elements.memberSelect.value
})

elements.categoryGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]')
  if (!button) return
  state.selectedCategory = button.dataset.category
  renderAddSheet()
})

elements.closeSheet.addEventListener('click', closeSheet)
elements.sheetBackdrop.addEventListener('click', () => {
  closeSheet()
  closeManager()
  if (!elements.authPanel.hidden) closeAuthPanel()
})
elements.saveEntry.addEventListener('click', addTransactionFromSheet)

elements.manageAccounts.addEventListener('click', () => openAccountManager())
elements.manageAssetAccounts.addEventListener('click', () => openAccountManager())
elements.manageGoals.addEventListener('click', () => openBudgetManager())
elements.manageRecurring.addEventListener('click', () => openRecurringManager())
elements.budgetAdvice.addEventListener('click', () => openBudgetManager())
elements.closeManager.addEventListener('click', closeManager)

elements.accountList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-account]')
  if (button) openAccountManager(button.dataset.account)
})

elements.assetAccountList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-account]')
  if (button) openAccountManager(button.dataset.account)
})

elements.goalGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-goal-account]')
  if (button?.dataset.goalAccount) openAccountManager(button.dataset.goalAccount)
})

elements.budgetList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-budget]')
  if (button) openBudgetManager(button.dataset.budget)
})

elements.bookGrid.addEventListener('click', (event) => {
  const bookButton = event.target.closest('[data-profile-book]')
  if (bookButton) {
    state.activeBook = bookButton.dataset.profileBook
    state.pendingBook = state.activeBook
    wealthStore.saveActiveSpace(state.activeBook)
    renderApp()
    openLedgerManager()
    return
  }
  if (event.target.closest('[data-manage-budget]')) openBudgetManager()
})

elements.recurringList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-recurring]')
  if (button) openRecurringManager(button.dataset.recurring)
})

elements.automationList.addEventListener('click', (event) => {
  const row = event.target.closest('.automation-row')
  if (row) openSettingPanel('sync')
})

qs('.settings-panel').addEventListener('click', (event) => {
  const button = event.target.closest('[data-setting]')
  if (button) openSettingPanel(button.dataset.setting)
})

elements.managerBody.addEventListener('click', async (event) => {
  const editAccount = event.target.closest('[data-edit-account]')
  const deleteAccount = event.target.closest('[data-delete-account]')
  const editRecurring = event.target.closest('[data-edit-recurring]')
  const deleteRecurring = event.target.closest('[data-delete-recurring]')
  const removeMember = event.target.closest('[data-remove-member]')
  if (editAccount) {
    openAccountManager(editAccount.dataset.editAccount)
    return
  }
  if (deleteAccount) {
    const id = elements.managerBody.querySelector('[data-account-form] [name="id"]')?.value
    if (id) {
      accounts = accounts.filter((item) => item.id !== id)
      persistAccounts()
      closeManager()
      renderApp()
    }
    return
  }
  if (editRecurring) {
    openRecurringManager(editRecurring.dataset.editRecurring)
    return
  }
  if (deleteRecurring) {
    const id = elements.managerBody.querySelector('[data-recurring-form] [name="id"]')?.value
    if (id) {
      recurringBills = recurringBills.filter((item) => item.id !== id)
      persistRecurringBills()
      closeManager()
      renderApp()
    }
    return
  }
  if (removeMember) {
    const book = currentBook()
    const member = removeMember.dataset.removeMember
    if (member !== '我') {
      book.members = book.members.filter((item) => item !== member)
      persistLedgerSpaces()
      openLedgerManager()
      renderApp()
    }
    return
  }
  if (event.target.closest('[data-copy-family-link]')) {
    await navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?join=${state.activeBook}&role=member`)
    event.target.closest('[data-copy-family-link]').textContent = '已复制'
    return
  }
  if (event.target.closest('[data-copy-export]')) {
    const text = elements.managerBody.querySelector('.export-box')?.value || ''
    await navigator.clipboard?.writeText(text)
    event.target.closest('[data-copy-export]').textContent = '已复制'
    return
  }
  if (event.target.closest('[data-import-export]')) {
    try {
      const parsed = JSON.parse(elements.managerBody.querySelector('.export-box')?.value || '{}')
      if (Array.isArray(parsed.transactions)) {
        state.transactions = normalizeTransactions(parsed.transactions)
        persist()
      }
      if (Array.isArray(parsed.accounts)) {
        accounts = parsed.accounts
        persistAccounts()
      }
      if (Array.isArray(parsed.recurringBills)) {
        recurringBills = parsed.recurringBills
        persistRecurringBills()
      }
      if (Array.isArray(parsed.users)) {
        users = parsed.users
        persistUsers()
        if (parsed.currentUser) wealthStore.saveSessionUserId(parsed.currentUser)
      }
      if (parsed.incomePlans && typeof parsed.incomePlans === 'object') {
        Object.assign(incomePlans.personal, parsed.incomePlans.personal || {})
        Object.assign(incomePlans.family, parsed.incomePlans.family || {})
        persistIncomePlans()
      }
      closeManager()
      renderApp()
    } catch {
      event.target.closest('[data-import-export]').textContent = '格式错误'
    }
    return
  }
  if (event.target.closest('[data-toggle-private]')) {
    document.body.classList.toggle('is-private')
  }
  if (event.target.closest('[data-logout]')) {
    closeManager()
    logout()
  }
  if (event.target.closest('[data-open-register]')) {
    closeManager()
    openAuthPanel('register')
  }
  if (event.target.closest('[data-open-apple-config]')) {
    openAppleConfigManager()
  }
  if (event.target.closest('[data-dev-apple-login]')) {
    const deviceId = localStorage.getItem('hezang-device-apple-id') || uid('apple-device')
    localStorage.setItem('hezang-device-apple-id', deviceId)
    loginWithAppleProfile({
      provider: 'apple-dev',
      sub: deviceId,
      email: 'local-apple@example.dev',
      name: currentUser()?.name || 'Apple 用户',
    })
  }
})

elements.managerBody.addEventListener('submit', (event) => {
  event.preventDefault()
  const accountForm = event.target.closest('[data-account-form]')
  const budgetForm = event.target.closest('[data-budget-form]')
  const ledgerForm = event.target.closest('[data-ledger-form]')
  const recurringForm = event.target.closest('[data-recurring-form]')
  const profileForm = event.target.closest('[data-profile-form]')
  const appleConfigForm = event.target.closest('[data-apple-config-form]')
  const syncConfigForm = event.target.closest('[data-sync-config-form]')
  if (syncConfigForm) {
    const form = new FormData(syncConfigForm)
    saveBackendConfig({
      mode: form.get('mode') || 'local',
      supabaseUrl: String(form.get('supabaseUrl') || '').trim(),
      supabaseAnonKey: String(form.get('supabaseAnonKey') || '').trim(),
    })
    const button = syncConfigForm.querySelector('.primary-button')
    if (button) button.textContent = '已保存'
    window.setTimeout(() => openSettingPanel('sync'), 500)
    return
  }
  if (appleConfigForm) {
    const form = new FormData(appleConfigForm)
    const clientId = String(form.get('clientId') || '').trim()
    const redirectURI = String(form.get('redirectURI') || '').trim()
    if (!clientId || !redirectURI) {
      const button = appleConfigForm.querySelector('.primary-button')
      if (button) button.textContent = '请补全'
      return
    }
    persistAppleConfig({ clientId, redirectURI })
    const button = appleConfigForm.querySelector('.primary-button')
    if (button) button.textContent = '已保存'
    window.setTimeout(closeManager, 500)
    return
  }
  if (accountForm) {
    const form = new FormData(accountForm)
    const id = form.get('id') || uid('account')
    const balance = Number(form.get('balance') || 0)
    const next = {
      id,
      name: String(form.get('name') || '').trim() || '未命名账户',
      scope: state.activeBook,
      type: form.get('type'),
      icon: '账',
      balance: form.get('type') === 'liability' ? -Math.abs(balance) : balance,
      color: '#E8C08A',
      dueDay: Number(form.get('dueDay')) || '',
      limit: Number(form.get('limit')) || '',
    }
    const exists = accounts.some((item) => item.id === id)
    accounts = exists ? accounts.map((item) => (item.id === id ? { ...item, ...next } : item)) : [...accounts, next]
    persistAccounts()
    closeManager()
    renderApp()
    return
  }
  if (budgetForm) {
    const form = new FormData(budgetForm)
    const plan = incomePlanForBook()
    plan.payday = Math.min(28, Math.max(1, Number(form.get('payday')) || plan.payday))
    plan.salary = Number(form.get('salary')) || 0
    plan.sideTarget = Number(form.get('sideTarget')) || 0
    plan.savingTarget = Number(form.get('savingTarget')) || 0
    plan.sideNames = String(form.get('sideNames') || '').split(/[\/,，、]/).map((item) => item.trim()).filter(Boolean)
    categories.filter((item) => item.type === 'expense').forEach((item) => {
      item.budget = Number(form.get(`budget-${item.id}`)) || 0
    })
    persistIncomePlans()
    persistCategorySettings()
    closeManager()
    renderApp()
    return
  }
  if (ledgerForm) {
    const member = String(new FormData(ledgerForm).get('member') || '').trim()
    if (member) {
      const book = currentBook()
      book.members = Array.from(new Set([...book.members, member]))
      persistLedgerSpaces()
      state.pendingMember = member
      openLedgerManager()
      renderApp()
    }
    return
  }
  if (recurringForm) {
    const form = new FormData(recurringForm)
    const id = form.get('id') || uid('recurring')
    const next = {
      id,
      bookId: state.activeBook,
      title: String(form.get('title') || '').trim() || '周期流水',
      categoryId: form.get('categoryId') || 'home',
      amount: Number(form.get('amount')) || 0,
      cycle: String(form.get('cycle') || '').trim() || '每月 1 日',
      next: form.get('next') || todayValue(),
    }
    const exists = recurringBills.some((item) => item.id === id)
    recurringBills = exists ? recurringBills.map((item) => (item.id === id ? next : item)) : [...recurringBills, next]
    persistRecurringBills()
    closeManager()
    renderApp()
  }
  if (profileForm) {
    const user = currentUser()
    if (!user) return
    const form = new FormData(profileForm)
    const oldName = user.name
    user.name = String(form.get('name') || '').trim() || user.name
    user.householdId = String(form.get('householdId') || '').trim().toUpperCase() || defaultHouseholdId
    users = users.map((item) => (item.id === user.id ? user : item))
    state.transactions = state.transactions.map((item) => item.member === oldName ? { ...item, member: user.name, userName: user.name } : item)
    persistUsers()
    persist()
    syncUserIntoFamily(user)
    state.pendingMember = user.name
    closeManager()
    renderApp()
  }
})

qs('#copyInvite').addEventListener('click', async () => {
  const householdId = currentUser()?.householdId || defaultHouseholdId
  const link = `${window.location.origin}${window.location.pathname}?join=${householdId}&role=partner`
  await navigator.clipboard?.writeText(link)
  qs('#copyInvite').textContent = '已复制'
  window.setTimeout(() => {
    qs('#copyInvite').textContent = '邀请'
  }, 1600)
})

elements.dateInput.value = todayValue()
ensureLocalExperienceSession()
renderApp()
applyShortcutParams(new URLSearchParams(window.location.search))
