# 一起攒后端实现

当前实现把后端拆成两层：

- `supabase/schema.sql`：Supabase Postgres 表结构、索引和 RLS policy。
- `src/data/*`：前端数据访问边界。页面不应该直接依赖 Supabase API。

## 第一阶段

默认仍使用本机 `localStorage`，因此 GitHub Pages 和本地预览不需要任何后端配置也能跑。

设置入口：

我的 -> 云同步 -> 后端模式

这里可以保存 Supabase URL 和 anon public key。切到 Supabase 后，前端会：

- 使用 Supabase Anonymous Auth 建立当前浏览器的云端身份。
- 自动创建个人 / 共同资产池和 owner membership。
- 把本机账户、分类、攒钱计划、周期流水和流水快照同步到 Postgres。
- 订阅 Realtime，在其它客户端写入后自动拉取最新快照。

注意不要把 `service_role` key 填到前端。

## Supabase 建库

1. 新建 Supabase 项目。
2. 打开 SQL Editor。
3. 执行 `supabase/schema.sql`。
4. 在 Authentication 里开启 Anonymous sign-ins。
5. 前端只使用 anon key，所有业务表通过 RLS 控制权限。

当前阶段使用匿名登录，适合先把数据链路跑通。后续接邮箱、Apple 登录或自建账号系统时，UI 侧仍走同一个 repository 边界。

## 数据模型

- `profiles`：用户资料。
- `asset_spaces`：我的资产池、共同资产池、目标资产池。
- `memberships`：成员和角色。
- `accounts`：现金、银行卡、信用卡、投资、目标账户。
- `transactions`：流水，支持收入、支出、转账、垫付。
- `goals` / `goal_accounts`：攒钱目标和关联账户。
- `income_plans`：发薪日、工资、副业目标、目标存款。
- `recurring_rules`：周期流水。
- `categories`：分类和现金流护栏。
- `audit_logs`：关键操作审计。

## 权限模型

业务权限永远围绕 `asset_space + membership + role`：

- `admin`：管理成员、账户、目标、计划和周期规则。
- `member`：看统计、补流水、编辑自己创建的流水。
- `readonly`：只读。

Supabase 阶段用 RLS 实现这套规则。以后切到自建 Node/Go 后端时，把同一套规则放到服务端 middleware/service 即可。

## 可替换后端

UI 层只应该调用仓储/Adapter：

- 本机：`createLocalWealthStore()`
- Supabase：`createSupabaseWealthRepository()`

后续可替换到：

- 自托管 Postgres
- Neon / RDS Postgres
- MySQL
- SQLite 本地同步

最顺的迁移路径是 Supabase Postgres -> 自托管 Postgres，因为表结构、SQL 和权限模型最接近。
