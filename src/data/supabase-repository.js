const SUPABASE_CLIENT_URL = 'https://esm.sh/@supabase/supabase-js@2'

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
  return {
    async listSpaces() {
      const { data, error } = await client
        .from('asset_spaces')
        .select('id, client_id, name, type, invite_code, metadata, created_at, updated_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },
    async listAccounts(spaceClientId) {
      const { data, error } = await client
        .from('accounts')
        .select('*, asset_spaces!inner(client_id)')
        .eq('asset_spaces.client_id', spaceClientId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },
    async upsertAccount(spaceId, account) {
      const payload = {
        space_id: spaceId,
        client_id: account.id,
        name: account.name,
        kind: account.type,
        balance: account.balance,
        icon: account.icon,
        color: account.color,
        due_day: account.dueDay || null,
        credit_limit: account.limit || null,
      }
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
      }
      const { data, error } = await client.from('transactions').upsert(payload, { onConflict: 'space_id,client_id' }).select().single()
      if (error) throw error
      return fromSnakeTransaction(data)
    },
    async softDeleteTransaction(spaceId, clientId) {
      const { error } = await client
        .from('transactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('space_id', spaceId)
        .eq('client_id', clientId)
      if (error) throw error
    },
    subscribeToSpace(spaceId, handler) {
      return client
        .channel(`space:${spaceId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `space_id=eq.${spaceId}` }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts', filter: `space_id=eq.${spaceId}` }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: `space_id=eq.${spaceId}` }, handler)
        .subscribe()
    },
  }
}
