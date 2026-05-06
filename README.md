# 一起攒 Couple Wealth

资产管理优先的情侣/家庭共同攒钱 Web App，手动流水记录作为辅助输入。

核心主线：

看净资产 -> 管账户 -> 锁定目标存款 -> 控制现金流 -> 补必要流水

## 运行

```bash
npm start
```

打开 http://localhost:4173/。

## 设计系统

- 视觉：深空黑、资产绿、香槟金、现金流橙、低饱和蓝。
- 字体：SF Pro Display / 系统 UI 字体。
- 组件：8px 圆角、深色玻璃卡片、资产绿按钮、绿色进度、金色辅助高光。
- 品牌：双圆交叠发光 logo，表达共同账户、共同目标、一起攒资产。

## 核心功能

- 总览：净资产、总资产、负债、可用现金、现金可支撑天数。
- 资产：账户余额、资产、负债、净资产、资产结构与现金流趋势。
- 目标：旅行、装修、应急金等攒钱目标，按账户余额自动计算进度。
- 收入系统：工资、副业、奖金、其他收入，支持发薪日与副业目标。
- 工资周期：默认按发薪日计算周期，例如 04.10 - 05.09。
- 攒钱计划：现金池 = 收入 - 固定支出 - 目标存款。
- 流水：支出、收入、转账，字段包含 book_id、member、payer、owner、is_advance。
- 情侣/家庭：我的资产池与共同资产池快速切换，共同账户、成员记录、垫付机制。
- 自动化预留：OCR、快捷指令、Siri、周期流水、小组件。

## 后端

- 默认：本机 `localStorage`，GitHub Pages / Cloudflare Pages 可直接预览。
- 已接入：Supabase Postgres + Anonymous Auth + Realtime + RLS。
- 数据边界：`src/data/*`，UI 不直接绑定具体 DB。
- Schema：`supabase/schema.sql`。
- 说明：`docs/BACKEND.md`。

## 部署

这是零依赖静态应用，可以免费部署到 Cloudflare Pages。

部署目录使用仓库根目录即可，构建命令留空，输出目录留空或使用 `/`。

## 产品文档

见 [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)。

后端实现方案见 [docs/BACKEND.md](docs/BACKEND.md)。

快捷指令与 iOS 自动化方案见 [docs/IOS_SHORTCUTS.md](docs/IOS_SHORTCUTS.md)。
