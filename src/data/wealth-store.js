export const storageKeys = {
  activeSpace: 'hezang-active-book',
  backendConfig: 'hezang-backend-config',
  categorySettings: 'hezang-category-settings',
  incomePlans: 'hezang-income-plans',
  ledgerSpaces: 'hezang-ledger-spaces',
  recurringRules: 'hezang-recurring-bills',
  sessionUser: 'hezang-session-user',
  transactions: 'hezang-pro-transactions',
  accounts: 'hezang-accounts',
  users: 'hezang-users',
}

function safeStorage() {
  return typeof window === 'undefined' ? null : window.localStorage
}

function readJson(storage, key, fallback) {
  if (!storage) return fallback
  const stored = storage.getItem(key)
  if (!stored) return fallback
  try {
    return JSON.parse(stored)
  } catch {
    return fallback
  }
}

function writeJson(storage, key, value) {
  if (!storage) return
  storage.setItem(key, JSON.stringify(value))
}

function readRuntimeConfig() {
  if (typeof window === 'undefined') return {}
  return window.CoupleWealthConfig || window.COUPLE_WEALTH_CONFIG || {}
}

export function loadBackendConfig(storage = safeStorage()) {
  const stored = readJson(storage, storageKeys.backendConfig, {})
  const runtime = readRuntimeConfig()
  const mode = runtime.backendMode || runtime.mode || stored.mode || 'local'
  return {
    mode,
    supabaseUrl: runtime.supabaseUrl || stored.supabaseUrl || '',
    supabaseAnonKey: runtime.supabaseAnonKey || stored.supabaseAnonKey || '',
  }
}

export function saveBackendConfig(config, storage = safeStorage()) {
  writeJson(storage, storageKeys.backendConfig, {
    mode: config.mode || 'local',
    supabaseUrl: config.supabaseUrl || '',
    supabaseAnonKey: config.supabaseAnonKey || '',
  })
}

export function isSupabaseConfigured(config = loadBackendConfig()) {
  return config.mode === 'supabase' && Boolean(config.supabaseUrl && config.supabaseAnonKey)
}

export function createLocalWealthStore(storage = safeStorage()) {
  return {
    loadUsers() {
      const parsed = readJson(storage, storageKeys.users, [])
      return Array.isArray(parsed) ? parsed : []
    },
    saveUsers(users) {
      writeJson(storage, storageKeys.users, users)
    },
    loadAccounts(defaultAccounts) {
      const parsed = readJson(storage, storageKeys.accounts, null)
      return Array.isArray(parsed) && parsed.length ? parsed : defaultAccounts.map((item) => ({ ...item }))
    },
    saveAccounts(accounts) {
      writeJson(storage, storageKeys.accounts, accounts)
    },
    loadRecurringRules(defaultRules) {
      const parsed = readJson(storage, storageKeys.recurringRules, null)
      return Array.isArray(parsed) ? parsed : defaultRules.map((item) => ({ ...item }))
    },
    saveRecurringRules(rules) {
      writeJson(storage, storageKeys.recurringRules, rules)
    },
    loadTransactions(seedTransactions, withSeedBackfill) {
      const parsed = readJson(storage, storageKeys.transactions, null)
      return parsed ? withSeedBackfill(parsed) : withSeedBackfill(seedTransactions)
    },
    saveTransactions(transactions) {
      writeJson(storage, storageKeys.transactions, transactions)
    },
    applyCategorySettings(categories) {
      const stored = readJson(storage, storageKeys.categorySettings, {})
      categories.forEach((item) => {
        if (Number.isFinite(Number(stored[item.id]?.budget))) item.budget = Number(stored[item.id].budget)
      })
    },
    saveCategorySettings(categories) {
      writeJson(storage, storageKeys.categorySettings, Object.fromEntries(categories.map((item) => [item.id, { budget: item.budget }])))
    },
    applyIncomePlans(incomePlans) {
      const stored = readJson(storage, storageKeys.incomePlans, {})
      Object.entries(stored).forEach(([bookId, plan]) => {
        if (!incomePlans[bookId]) return
        ;['payday', 'salary', 'sideTarget', 'savingTarget'].forEach((key) => {
          if (Number.isFinite(Number(plan[key]))) incomePlans[bookId][key] = Number(plan[key])
        })
        if (Array.isArray(plan.sideNames)) incomePlans[bookId].sideNames = plan.sideNames
      })
    },
    saveIncomePlans(incomePlans) {
      writeJson(storage, storageKeys.incomePlans, incomePlans)
    },
    applyLedgerSpaces(spaces) {
      const stored = readJson(storage, storageKeys.ledgerSpaces, {})
      spaces.forEach((space) => {
        if (Array.isArray(stored[space.id]?.members) && stored[space.id].members.length) {
          space.members = stored[space.id].members
        }
      })
    },
    saveLedgerSpaces(spaces) {
      writeJson(storage, storageKeys.ledgerSpaces, Object.fromEntries(spaces.map((item) => [item.id, { members: item.members }])))
    },
    loadSessionUserId() {
      return storage?.getItem(storageKeys.sessionUser) || ''
    },
    saveSessionUserId(userId) {
      storage?.setItem(storageKeys.sessionUser, userId)
    },
    clearSessionUserId() {
      storage?.removeItem(storageKeys.sessionUser)
    },
    loadActiveSpace(fallback = 'family') {
      return storage?.getItem(storageKeys.activeSpace) || fallback
    },
    saveActiveSpace(spaceId) {
      storage?.setItem(storageKeys.activeSpace, spaceId)
    },
    loadLastAccount(spaceId) {
      return storage?.getItem(`hezang-last-account-${spaceId}`) || ''
    },
    saveLastAccount(spaceId, accountId) {
      storage?.setItem(`hezang-last-account-${spaceId}`, accountId)
    },
    saveLastCategory(spaceId, type, categoryId) {
      storage?.setItem(`hezang-last-category-${spaceId}-${type}`, categoryId)
    },
  }
}
