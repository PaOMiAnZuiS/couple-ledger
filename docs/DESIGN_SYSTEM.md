# Couple Ledger Design System

这套设计系统用于支撑“一起记”的统一产品体验，结构为 Foundations、Components、Patterns、Screens、Assets、Tokens。它的核心不是装饰，而是围绕“工资周期决策”的视觉与交互语言。

## Foundations

### Color

- `color/bg/primary`: `#0A0F12`，主背景深黑蓝。
- `color/bg/card`: `#121820`，卡片与底部导航主色。
- `color/text/primary`: `#F7FBFA`，核心金额与主信息。
- `color/text/secondary`: 62% 白，辅助状态与描述。
- `color/brand/gold`: `#E8C08A`，品牌高光、选中态、关键行动。
- `color/income`: `#22C55E`，收入、预算健康、正向变化。
- `color/expense`: `#FF8A3D`，支出、预算消耗、风险提示。

### Typography

字体使用 SF Pro 体系，fallback 为 Inter 和系统无衬线。界面遵循“金额优先”原则：

- 核心金额：32-40px Bold。
- 页面标题：24-28px Semibold。
- 卡片标题：16-18px Semibold。
- 正文：14-16px Regular。
- 辅助信息：11-12px Regular / Medium。

### Texture

- Glass: 轻透明背景 + 24px blur + 低对比边框。
- Glow: 低饱和暖金光，仅用于品牌、金额、选中态与 FAB。
- Shadow: 低透明黑色阴影，强化层级，不做厚重拟物。
- 每屏最多一个主光源，材质透明度低于 10%。

## Components

- Card: 主卡片、玻璃卡片、信息卡片，统一 `24px` 圆角。
- Amount: 金额文本组件，支持 income / expense / neutral。
- Status: “还能花”“每日可花”“距发薪”状态组合。
- Progress: 预算进度条，收入绿色到香槟金渐变。
- List Item: 账单项，包含图标、标题、元信息、金额。
- FAB: 中心“记一笔”按钮，暖金圆形主行动。
- Tab Bar: 5 栏底部导航，图标为 2px 圆角线性风格。

## Patterns

首页由以下模块组成：

- Header: 当前账本、工资周期、剩余天数。
- Main: 核心金额“还能花”。
- Status: 每日可花、已花 / 预算、存钱率。
- Insight: 消费节奏建议。
- Budget: 预算进度与风险提示。
- Recent List: 最近账单。

信息闭环固定为：工资周期 -> 收入 -> 支出 -> 剩余 -> 决策。

## Development Mapping

- `Card` -> `.panel`, `.hero-card`, `.insight-card`
- `Amount` -> `.hero-card h2`, `.bill-amount`, `.amount-field input`
- `Progress` -> `.progress-track`, `.progress-fill`
- `List` -> `.bill-row`, `.account-row`, `.recurring-row`
- `FAB` -> `.tab-bar .add-tab`
- `Tab Bar` -> `.tab-bar`
- Tokens -> `src/static.css` 末尾的 `Couple Ledger Figma system v4` 变量层
