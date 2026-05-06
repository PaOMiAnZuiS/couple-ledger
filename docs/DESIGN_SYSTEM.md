# Couple Wealth Design System

这套设计系统用于支撑“一起攒”的统一产品体验，结构为 Foundations、Components、Patterns、Screens、Assets、Tokens。它的核心不是装饰，而是围绕“共同资产与攒钱周期”的视觉与交互语言。

## Foundations

### Color

- `color/bg/primary`: `#07110F`，主背景深黑绿。
- `color/bg/card`: `#101A18`，卡片与底部导航主色。
- `color/text/primary`: `#F7FBFA`，核心金额与主信息。
- `color/text/secondary`: 62% 白，辅助状态与描述。
- `color/brand/green`: `#6EE7B7`，品牌高光、选中态、关键行动。
- `color/brand/champagne`: `#F6D889`，目标资金与辅助高光。
- `color/income`: `#34D399`，收入、资产增长、正向变化。
- `color/expense`: `#F59E0B`，流出、现金池消耗、风险提示。

### Typography

字体使用 SF Pro 体系，fallback 为 Inter 和系统无衬线。界面遵循“金额优先”原则：

- 核心金额：32-40px Bold。
- 页面标题：24-28px Semibold。
- 卡片标题：16-18px Semibold。
- 正文：14-16px Regular。
- 辅助信息：11-12px Regular / Medium。

### Texture

- Glass: 轻透明背景 + 24px blur + 低对比边框。
- Glow: 低饱和资产绿光，仅用于品牌、金额、选中态与浮动行动。
- Shadow: 低透明黑色阴影，强化层级，不做厚重拟物。
- 每屏最多一个主光源，材质透明度低于 10%。

## Components

- Card: 主卡片、玻璃卡片、信息卡片，统一 `24px` 圆角。
- Amount: 金额文本组件，支持 income / expense / neutral。
- Status: “净资产”“可用现金”“可支撑天数”状态组合。
- Progress: 现金流进度条，资产绿色到香槟金渐变。
- List Item: 流水项，包含图标、标题、元信息、金额。
- Goal Card: 攒钱目标卡，展示目标金额、当前金额、缺口和进度。
- Floating Entry: 右下角“补流水”快捷入口，作为辅助行动。
- Tab Bar: 5 栏底部导航，总览 / 资产 / 目标 / 流水 / 我的。

## Patterns

总览由以下模块组成：

- Header: 当前资产池、攒钱周期、现金可支撑天数。
- Main: 核心金额“净资产”。
- Status: 可用现金、目标/投资、负债余额、存钱率。
- Insight: 资产状态与现金流建议。
- Actions: 管理资产、看目标、补流水，按资产优先级排序。
- Plan: 攒钱计划与现金流护栏。
- Recent List: 最近流水。

目标页由以下模块组成：

- Goal Summary: 总目标进度、目标总额、当前已攒金额。
- Goal Grid: 按账户余额自动计算每个攒钱目标进度。
- Allocation: 按缺口比例给出本周期目标存款分配建议。

信息闭环固定为：净资产 -> 账户结构 -> 攒钱目标 -> 现金流护栏 -> 必要流水。

## Development Mapping

- `Card` -> `.panel`, `.hero-card`, `.insight-card`
- `Amount` -> `.hero-card h2`, `.bill-amount`, `.amount-field input`
- `Progress` -> `.progress-track`, `.progress-fill`, `.goal-progress`
- `List` -> `.bill-row`, `.account-row`, `.recurring-row`
- `Goal Card` -> `.goal-card`
- `Floating Entry` -> `.floating-entry`
- `Tab Bar` -> `.tab-bar`
- Tokens -> `src/static.css` 末尾的 `Couple Wealth Figma system v5` 变量层
