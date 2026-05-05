# iOS 快捷指令 / 自动化能力设计

## 定位

快捷指令不是附属入口，而是合账的第六种核心记账方式，与打开 App、桌面小组件、Siri 语音、截图识别、分享菜单导入、周期自动化并列。

官方能力边界参考：

- App Intents 暴露 App 动作给系统、Siri、Spotlight、快捷指令和小组件。
- App Shortcuts 负责把常用 Intent 注册成系统可发现的短语。
- WidgetKit 可通过 App Intent 触发小组件内按钮。
- Share Extension 负责从微信、支付宝、银行、电商等 App 分享图片或订单页。

## 用户能力矩阵

| 入口 | 用户动作 | 系统能力 | 账本上下文 |
|---|---|---|---|
| 快捷指令 Action | 新增账单 | `AddTransactionIntent` | 个人 / 家庭 |
| Siri | “家庭账本记一笔买菜 86 元” | `VoiceLedgerIntent` | 自动解析 |
| 截图识别 | 最新截图 / 传入图片 | `RecognizeReceiptIntent` | 可确认 |
| 分享菜单 | 从微信/支付宝/订单页分享 | Share Extension | 可选账本 |
| 自动化 | 每月工资 / 房租 / 晚间提醒 | `GenerateRecurringBillIntent` | 账本绑定 |
| 小组件 | 快速记账 / 扫图 / 看预算 | WidgetKit + App Intent | 快速入口 |

## App Intents 设计

快捷指令参数必须使用 App Entity，而不是纯文本：

- `LedgerBookEntity`: 我的个人账本、家庭账本、旅行账本、装修账本。
- `LedgerCategoryEntity`: 餐饮、交通、购物、居住、医疗、工资、转账等。
- `LedgerAccountEntity`: 微信钱包、支付宝、银行卡、家庭银行卡、家庭现金、旅行基金等。
- `LedgerMemberEntity`: 我、老婆、父母等家庭成员。

这样用户在快捷指令编辑器里可以直接选择 App 内真实数据，Siri 也能基于实体补全。

### AddTransactionIntent

用于新增账单，必须支持以下参数：

- `book`: 个人账本 / 家庭账本 / 指定共享账本。
- `amount`: 金额。
- `type`: 支出 / 收入 / 转账。
- `category`: 分类实体。
- `account`: 账户实体。
- `date`: 时间。
- `note`: 备注。
- `tags`: 标签。
- `member`: 家庭账本成员。
- `requiresConfirmation`: 是否进入确认页。

高置信度自动化可直接写入，但必须写入 `source = shortcut` 且支持撤销。

### VoiceLedgerIntent

输入自然语言，调用同一套解析器：

- 金额识别：`86 元`、`86块`、`二十元`。
- 分类识别：买菜/早餐/咖啡 -> 餐饮；地铁/打车 -> 交通。
- 账户识别：微信、支付宝、银行卡、现金。
- 账本识别：家庭账本、个人账本、旅行账本。
- 成员识别：我、老婆、家人昵称。

低置信度时返回确认结果，由 App 打开确认页。

### RecognizeReceiptIntent

输入图片或最近截图：

- OCR 提取：金额、商户、时间、支付方式、订单类型。
- 推荐分类与账户。
- 保存原图作为凭证。
- `confidence >= 0.92` 可允许自动入账，但默认仍建议确认。

### GenerateRecurringBillIntent

用于周期账单：

- 每月 1 日工资收入。
- 房租、房贷、会员订阅。
- 支持自动生成与提醒模式。

### QueryFinanceSummaryIntent

用于小组件、Siri、Spotlight 查询：

- 本月支出。
- 预算剩余。
- 今日消费状态。
- 家庭成员分摊。

## App Shortcuts 短语

- “记一笔 \(\.$amount) 元 \(\.$note)”
- “家庭账本记一笔 \(\.$note) \(\.$amount) 元”
- “从 \(\.$account) 支出 \(\.$amount) 元 \(\.$note)”
- “识别这张支付截图”
- “查看本月支出”
- “查看预算剩余”

## 小组件

建议提供 3 种尺寸：

- 小号：快速记账、扫图识别。
- 中号：本月支出、预算剩余、家庭账本入口。
- 大号：趋势图、预算进度、最近账单。

所有按钮使用 App Intent，不只打开 App。

## 分享菜单导入流程

1. 用户在微信、支付宝、银行、电商、外卖 App 中分享截图或订单页。
2. Share Extension 接收图片/URL/文本。
3. OCR/NLP 解析账单候选。
4. 展示确认页：金额、商户、分类、账户、账本、时间、成员、凭证。
5. 一键确认入账。
6. 写入原始凭证、识别置信度和来源。

## 确认与撤销

- 所有 OCR / NLP / 自动化生成账单默认进入确认状态。
- 高置信度自动入账必须弹出 “已自动记账，可撤销”。
- 用户修改分类/账户后写入偏好记忆，下次同商户自动推荐。
- 误记账可以在 30 秒内撤销，也可从账单列表删除。

## Web/PWA 过渡实现

当前 Web 版已支持 URL 参数作为快捷指令过渡方案，并会打开确认记账 Sheet：

```text
/?shortcut=add&type=expense&book=family&amount=35&note=早餐&category=food&account=wechat&member=我&tags=快捷指令
/?shortcut=add&type=expense&book=personal&amount=20&note=咖啡&category=food&account=wechat&member=我
/?shortcut=voice&text=家庭账本记一笔买菜86元
/?shortcut=receipt&book=family&merchant=星巴克&amount=20&account=wechat&confidence=0.92
```

iOS 快捷指令可以先用“打开 URL”调用 Web App；正式 iOS 版使用 `ios/AppIntents` 中的原生骨架替换。
