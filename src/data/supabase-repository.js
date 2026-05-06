const SUPABASE_CLIENT_URL = 'https://esm.sh/@supabase/supabase-js@2'

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined))
}

function toSnakeAccount(spaceId, item) {
  return {
    space_id: spaceId,
    client_id: item.id,
    name: item.name,
    kind: item.type,
    balance: Number(item.balance || 0),
    icon: item.icon || '账',
    color: item.color || '#6EE7B7',
    due_day: item.dueDay || null,
    credit_limit: item.limit || null,
  }
}

function fromSnakeAccount(row, fallbackScope = '') {
  return {
    id: row.client_id || row.id,
    name: row.name,
    scope: row.asset_spaces?.client_id || fallbackScope,
    type: row.kind,
    icon: row.icon || '账',
    balance: Number(row.balance || 0),
    color: row.color || '#6EE7B7',
    dueDay: row.due_day || '',
    limit: row.credit_limit || '',
  }
}

function toSnakeCategory(spaceId, item, index = 0) {
  return {
    space_id: spaceId,
    client_id: item.id,
    name: item.name,
    type: item.type,
    icon: item.icon || '',
    color: item.color || '#6EE7B7',
    budget: Number(item.budget || 0),
    sort_order: index,
  }
}

function fromSnakeCategory(row) {
  return {
    id: row.client_id || row.id,
    name: row.name,
    type: row.type,
    icon: row.icon || '',
    color: row.color || '#6EE7B7',
    budget: Number(row.budget || 0),
  }
}

function toSnakeIncomePlan(spaceId, plan) {
  return {
    space_id: spaceId,
    payday: Number(plan.payday || 10),
    salary: Number(plan.salary || 0),
    side_target: Number(plan.sideTarget || 0),
    saving_target: Number(plan.savingTarget || 0),
    side_names: plan.sideNames || [],
  }
}

function fromSnakeIncomePlan(row) {
  return {
    payday: Number(row.payday || 10),
    salary: Number(row.salary || 0),
    sideTarget: Number(row.side_target || 0),
    savingTarget: Number(row.saving_target || 0),
    sideNames: row.side_names || [],
  }
}

function toSnakeRecurring(spaceId, item) {
  return {
    space_id: spaceId,
    client_id: item.id,
    title: item.title,
    category_client_id: item.categoryId || '',
    account_client_id: item.accountId || '',
    amount: Number(item.amount || 0),
    cycle: item.cycle,
    next_on: item.next,
    enabled: item.enabled !== false,
  }
}

function fromSnakeRecurring(row, fallbackBookId = '') {
  return {
    id: row.client_id || row.id,
    bookId: row.asset_spaces?.client_id || fallbackBookId,
    title: row.title,
    categoryId: row.category_client_id || '',
    accountId: row.account_client_id || '',
    amount: Number(row.amount || 0),
    cycle: row.cycle,
    next: row.next_on,
    enabled: row.enabled !== false,
  }
}

function normalizeDueDate(value) {
  if (!value || value === '长期') return null
  const normalized = String(value).replace(/[.]/g, '-')
  if (/^\d{4}-\d{2}$/.test(normalized)) return `${normalized}-01`
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized
  return null
}

function toSnakeGoal(spaceId, item, index = 0) {
  return {
    space_id: spaceId,
    client_id: item.id,
    title: item.title,
    target_amount: Number(item.target || 0),
    due_on: normalizeDueDate(item.due),
    icon: item.icon || 'goal',
    color: item.color || '#F6D889',
    sort_order: index,
  }
}

function toSnakeTransaction(item) {
  return {
    client_id: item.id,
    account_client_id: item.accountId,
    category_client_id: item.categoryId,
    type: item.type,
    title: item.title,
    amount: item.amount,
    occurred_on: item.date,
    member_name: item.member || '',
    payer_name: item.payer || item.member || '',
    owner_name: item.owner || item.beneficiary || item.member || '',
    is_advance: Boolean(item.isAdvance),
    settlement_status: item.settlement || '',
    note: item.note || '',
    tags: item.tags || [],
    receipt_url: item.receiptUrl || '',
    created_at: item.createdAt,
    updated_at: new Date().toISOString(),
  }
}

function fromSnakeTransaction(row) {
  return {
    id: row.client_id || row.id,
    bookId: row.space_client_id || row.asset_spaces?.client_id || '',
    type: row.type,
    title: row.title,
    amount: Number(row.amount || 0),
    categoryId: row.category_client_id || row.categories?.client_id || '',
    accountId: row.account_client_id || row.accounts?.client_id || '',
    member: row.member_name || '我',
    userId: row.created_by || '',
    userName: row.member_name || '我',
    payer: row.payer_name || row.member_name || '我',
    owner: row.owner_name || row.member_name || '我',
    isAdvance: Boolean(row.is_advance),
    beneficiary: row.owner_name || '',
    settlement: row.settlement_status || '',
    date: row.occurred_on,
    note: row.note || '',
    tags: row.tags || [],
    receiptUrl: row.receipt_url || '',
    createdAt: row.created_at,
  }
}

export async function createSupabaseClient(config) {
  if (!config?.supabaseUrl || !config?.supabaseAnonKey) return null
  const { createClient } = await import(SUPABASE_CLIENT_URL)
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export function createSupabaseWealthRepository(client) {
  let cloudUser = null
  let spacesByClientId = {}

  async function ensureCloudUser(localUser = {}) {
    const sessionResult = await client.auth.getSession()
    cloudUser = sessionResult.data?.session?.user || null
    if (!cloudUser) {
      const { data, error } = await client.auth.signInAnonymously({
        options: {
          data: {
            display_name: localUser.name || '我',
            local_user_id: localUser.id || '',
          },
        },
      })
      if (error) throw new Error(`Supabase 登录失败：${error.message}。请在 Supabase Auth 开启 Anonymous sign-ins，或后续接入邮箱/Apple 登录。`)
      cloudUser = data.user
    }
    if (cloudUser) {
      await client.from('profiles').upsert({
        id: cloudUser.id,
        display_name: localUser.name || cloudUser.user_metadata?.display_name || '我',
      }, { onConflict: 'id' })
    }
    return cloudUser
  }

  async function refreshSpaceMap() {
    const spaces = await repository.listSpaces()
    spacesByClientId = Object.fromEntries(spaces.map((space) => [space.client_id, space]))
    return spacesByClientId
  }

  async function ensureSpaces(ledgerSpaces, defaultHouseholdId = 'FAMILY-520') {
    if (!cloudUser) await ensureCloudUser()
    await refreshSpaceMap()
    for (const space of ledgerSpaces) {
      if (spacesByClientId[space.id]) continue
      const inviteCode = space.id === 'family' ? `${defaultHouseholdId}-${cloudUser.id.slice(0, 8)}` : null
      const { data, error } = await client
        .from('asset_spaces')
        .insert({
          client_id: space.id,
          owner_id: cloudUser.id,
          name: space.name,
          type: space.id === 'personal' ? 'personal' : 'family',
          invite_code: inviteCode,
          metadata: compactObject({
            short_name: space.shortName,
            hero: space.hero,
            description: space.description,
            color: space.color,
            default_account_id: space.defaultAccountId,
          }),
        })
        .select('id, client_id, name, type, invite_code, metadata, created_at, updated_at')
        .single()
      if (error) throw error
      spacesByClientId[space.id] = data
    }
    return spacesByClientId
  }

  function spaceForClientId(clientId) {
    const space = spacesByClientId[clientId]
    if (!space?.id) throw new Error(`云端资产池不存在：${clientId}`)
    return space
  }

  async function upsertCategoriesForSpace(spaceId, categories) {
    const rows = categories.map((category, index) => toSnakeCategory(spaceId, category, index))
    if (!rows.length) return
    const { error } = await client.from('categories').upsert(rows, { onConflict: 'space_id,client_id' })
    if (error) throw error
  }

  async function upsertAccountsForSpace(spaceClientId, allAccounts) {
    const space = spaceForClientId(spaceClientId)
    const rows = allAccounts
      .filter((account) => account.scope === spaceClientId || account.scope === 'both')
      .map((account) => toSnakeAccount(space.id, account))
    if (!rows.length) return
    const { error } = await client.from('accounts').upsert(rows, { onConflict: 'space_id,client_id' })
    if (error) throw error
  }

  async function upsertIncomePlan(spaceClientId, incomePlans) {
    const space = spaceForClientId(spaceClientId)
    const plan = incomePlans[spaceClientId]
    if (!plan) return
    const { error } = await client.from('income_plans').upsert(toSnakeIncomePlan(space.id, plan), { onConflict: 'space_id' })
    if (error) throw error
  }

  async function upsertRecurringForSpace(spaceClientId, recurringRules) {
    const space = spaceForClientId(spaceClientId)
    const rows = recurringRules
      .filter((item) => item.bookId === spaceClientId)
      .map((item) => toSnakeRecurring(space.id, item))
    if (!rows.length) return
    const { error } = await client.from('recurring_rules').upsert(rows, { onConflict: 'space_id,client_id' })
    if (error) throw error
  }

  async function upsertGoalsForSpace(spaceClientId, savingGoals) {
    const space = spaceForClientId(spaceClientId)
    const goals = savingGoals[spaceClientId] || []
    if (!goals.length) return
    const { data, error } = await client
      .from('goals')
      .upsert(goals.map((goal, index) => toSnakeGoal(space.id, goal, index)), { onConflict: 'space_id,client_id' })
      .select('id, client_id')
    if (error) throw error

    const { data: accountRows, error: accountError } = await client
      .from('accounts')
      .select('id, client_id')
      .eq('space_id', space.id)
      .is('deleted_at', null)
    if (accountError) throw accountError
    const accountByClientId = Object.fromEntries((accountRows || []).map((row) => [row.client_id, row.id]))
    const goalByClientId = Object.fromEntries((data || []).map((row) => [row.client_id, row.id]))
    const links = goals.flatMap((goal) => (goal.accountIds || [])
      .map((accountClientId) => ({
        goal_id: goalByClientId[goal.id],
        account_id: accountByClientId[accountClientId],
      }))
      .filter((row) => row.goal_id && row.account_id))
    if (links.length) {
      const { error: linkError } = await client.from('goal_accounts').upsert(links, { onConflict: 'goal_id,account_id' })
      if (linkError) throw linkError
    }
  }

  async function upsertTransactionsForSpace(spaceClientId, transactions) {
    const space = spaceForClientId(spaceClientId)
    const rows = transactions
      .filter((item) => (item.bookId || 'family') === spaceClientId)
      .map((item) => ({
        ...toSnakeTransaction(item),
        space_id: space.id,
        created_by: cloudUser?.id || null,
        updated_by: cloudUser?.id || null,
      }))
    if (!rows.length) return
    const { error } = await client.from('transactions').upsert(rows, { onConflict: 'space_id,client_id' })
    if (error) throw error
  }

  const repository = {
    async ensureSession(localUser) {
      await ensureCloudUser(localUser)
      return cloudUser
    },

    async listSpaces() {
      const { data, error } = await client
        .from('asset_spaces')
        .select('id, client_id, name, type, invite_code, metadata, created_at, updated_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },

    async bootstrapDefaults(payload) {
      await ensureCloudUser(payload.user)
      await ensureSpaces(payload.ledgerSpaces, payload.defaultHouseholdId)
      const spaceClientIds = Object.keys(spacesByClientId)
      for (const spaceClientId of spaceClientIds) {
        const space = spaceForClientId(spaceClientId)
        await upsertCategoriesForSpace(space.id, payload.categories)
        await upsertAccountsForSpace(spaceClientId, payload.accounts)
        await upsertIncomePlan(spaceClientId, payload.incomePlans)
        await upsertRecurringForSpace(spaceClientId, payload.recurringBills)
        await upsertGoalsForSpace(spaceClientId, payload.savingGoals)
        await upsertTransactionsForSpace(spaceClientId, payload.transactions)
      }
      return spacesByClientId
    },

    async saveSnapshot(payload) {
      await this.bootstrapDefaults(payload)
    },

    async loadSnapshot() {
      await refreshSpaceMap()
      const spaces = Object.values(spacesByClientId)
      const accounts = []
      const categories = []
      const recurringRules = []
      const transactions = []
      const incomePlans = {}

      for (const space of spaces) {
        const [
          { data: accountRows, error: accountError },
          { data: categoryRows, error: categoryError },
          { data: recurringRows, error: recurringError },
          { data: transactionRows, error: transactionError },
          { data: planRows, error: planError },
        ] = await Promise.all([
          client.from('accounts').select('*, asset_spaces!inner(client_id)').eq('space_id', space.id).is('deleted_at', null).order('created_at', { ascending: true }),
          client.from('categories').select('*').eq('space_id', space.id).is('deleted_at', null).order('sort_order', { ascending: true }),
          client.from('recurring_rules').select('*, asset_spaces!inner(client_id)').eq('space_id', space.id).is('deleted_at', null).order('created_at', { ascending: true }),
          client.from('transactions').select('*, asset_spaces!inner(client_id), accounts(client_id), categories(client_id)').eq('space_id', space.id).is('deleted_at', null).order('occurred_on', { ascending: false }).order('created_at', { ascending: false }).limit(500),
          client.from('income_plans').select('*').eq('space_id', space.id).limit(1),
        ])
        if (accountError) throw accountError
        if (categoryError) throw categoryError
        if (recurringError) throw recurringError
        if (transactionError) throw transactionError
        if (planError) throw planError

        accounts.push(...(accountRows || []).map((row) => fromSnakeAccount(row, space.client_id)))
        categories.push(...(categoryRows || []).map(fromSnakeCategory))
        recurringRules.push(...(recurringRows || []).map((row) => fromSnakeRecurring(row, space.client_id)))
        transactions.push(...(transactionRows || []).map(fromSnakeTransaction))
        if (planRows?.[0]) incomePlans[space.client_id] = fromSnakeIncomePlan(planRows[0])
      }

      return {
        spaces,
        accounts,
        categories,
        recurringRules,
        transactions,
        incomePlans,
      }
    },

    async listAccounts(spaceClientId) {
      const { data, error } = await client
        .from('accounts')
        .select('*, asset_spaces!inner(client_id)')
        .eq('asset_spaces.client_id', spaceClientId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data || []).map((row) => fromSnakeAccount(row, spaceClientId))
    },
    async upsertAccount(spaceId, account) {
      const payload = toSnakeAccount(spaceId, account)
      const { data, error } = await client.from('accounts').upsert(payload, { onConflict: 'space_id,client_id' }).select().single()
      if (error) throw error
      return data
    },
    async listTransactions(spaceClientId, limit = 500) {
      const { data, error } = await client
        .from('transactions')
        .select('*, asset_spaces!inner(client_id), accounts(client_id), categories(client_id)')
        .eq('asset_spaces.client_id', spaceClientId)
        .is('deleted_at', null)
        .order('occurred_on', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data || []).map(fromSnakeTransaction)
    },
    async upsertTransaction(spaceId, transaction) {
      const payload = {
        ...toSnakeTransaction(transaction),
        space_id: spaceId,
        created_by: cloudUser?.id || null,
        updated_by: cloudUser?.id || null,
      }
      const { data, error } = await client.from('transactions').upsert(payload, { onConflict: 'space_id,client_id' }).select().single()
      if (error) throw error
      return fromSnakeTransaction(data)
    },
    async upsertTransactionForBook(bookId, transaction) {
      const space = spaceForClientId(bookId)
      return this.upsertTransaction(space.id, transaction)
    },
    async softDeleteTransaction(spaceId, clientId) {
      const { error } = await client
        .from('transactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('space_id', spaceId)
        .eq('client_id', clientId)
      if (error) throw error
    },
    async softDeleteTransactionForBook(bookId, clientId) {
      const space = spaceForClientId(bookId)
      await this.softDeleteTransaction(space.id, clientId)
    },
    subscribeToSpaces(handler) {
      const channel = client.channel(`spaces:${Object.keys(spacesByClientId).join(',')}`)
      Object.values(spacesByClientId).forEach((space) => {
        channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `space_id=eq.${space.id}` }, handler)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts', filter: `space_id=eq.${space.id}` }, handler)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: `space_id=eq.${space.id}` }, handler)
      })
      return channel.subscribe()
    },
  }

  return repository
}
