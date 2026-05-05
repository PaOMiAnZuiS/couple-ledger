import AppIntents
import Foundation

enum TransactionKind: String, AppEnum {
    case expense
    case income
    case transfer

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "收支类型")
    static var caseDisplayRepresentations: [TransactionKind: DisplayRepresentation] = [
        .expense: "支出",
        .income: "收入",
        .transfer: "转账"
    ]
}

enum LedgerBookKind: String, AppEnum {
    case personal
    case family

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "账本类型")
    static var caseDisplayRepresentations: [LedgerBookKind: DisplayRepresentation] = [
        .personal: "个人账本",
        .family: "家庭账本"
    ]
}

struct LedgerDraft: Codable, Hashable {
    var bookId: String
    var bookName: String
    var bookKind: LedgerBookKind
    var amount: Decimal
    var kind: TransactionKind
    var categoryId: String
    var categoryName: String
    var accountId: String
    var accountName: String
    var date: Date
    var note: String?
    var tags: [String]
    var memberId: String?
    var memberName: String?
    var source: String
    var confidence: Double?
    var requiresConfirmation: Bool
}

struct AddTransactionIntent: AppIntent {
    static var title: LocalizedStringResource = "新增账单"
    static var description = IntentDescription("向个人账本或家庭账本新增一笔收入、支出或转账。")
    static var openAppWhenRun = false

    @Parameter(title: "账本", default: LedgerBookEntity.family)
    var book: LedgerBookEntity

    @Parameter(title: "金额")
    var amount: Decimal

    @Parameter(title: "收支类型", default: .expense)
    var kind: TransactionKind

    @Parameter(title: "分类", default: LedgerCategoryEntity.food)
    var category: LedgerCategoryEntity

    @Parameter(title: "账户", default: LedgerAccountEntity.wechat)
    var account: LedgerAccountEntity

    @Parameter(title: "时间", default: .now)
    var date: Date

    @Parameter(title: "备注")
    var note: String?

    @Parameter(title: "标签")
    var tags: [String]?

    @Parameter(title: "成员", default: LedgerMemberEntity.me)
    var member: LedgerMemberEntity?

    @Parameter(title: "需要确认", default: true)
    var requiresConfirmation: Bool

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let draft = LedgerDraft(
            bookId: book.id,
            bookName: book.name,
            bookKind: book.kind,
            amount: amount,
            kind: kind,
            categoryId: category.id,
            categoryName: category.name,
            accountId: account.id,
            accountName: account.name,
            date: date,
            note: note,
            tags: tags ?? [],
            memberId: member?.id,
            memberName: member?.name,
            source: "app_intent",
            confidence: nil,
            requiresConfirmation: requiresConfirmation
        )

        if requiresConfirmation {
            try await LedgerIntentBridge.shared.presentConfirmation(draft)
            return .result(dialog: "已打开合账确认页")
        }

        try await LedgerIntentBridge.shared.save(draft)
        return .result(dialog: "已记入\(book.name)")
    }
}

struct VoiceLedgerIntent: AppIntent {
    static var title: LocalizedStringResource = "语音记账"
    static var description = IntentDescription("解析自然语言并生成账单草稿。")
    static var openAppWhenRun = false

    @Parameter(title: "记账内容")
    var text: String

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let draft = try await LedgerIntentBridge.shared.parse(text)
        if draft.requiresConfirmation || (draft.confidence ?? 0) < 0.92 {
            try await LedgerIntentBridge.shared.presentConfirmation(draft)
            return .result(dialog: "我识别到一笔账单，请确认")
        }

        try await LedgerIntentBridge.shared.save(draft)
        return .result(dialog: "已自动记账，可在合账中撤销")
    }
}

struct RecognizeReceiptIntent: AppIntent {
    static var title: LocalizedStringResource = "识别截图并记账"
    static var description = IntentDescription("从支付截图、订单截图或分享图片中识别账单信息。")
    static var openAppWhenRun = false

    @Parameter(title: "图片")
    var image: IntentFile

    @Parameter(title: "账本", default: LedgerBookEntity.family)
    var book: LedgerBookEntity

    @Parameter(title: "高置信度自动入账", default: false)
    var autoSaveWhenConfident: Bool

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let draft = try await LedgerIntentBridge.shared.recognize(image, book: book)
        if autoSaveWhenConfident, (draft.confidence ?? 0) >= 0.92 {
            try await LedgerIntentBridge.shared.save(draft)
            return .result(dialog: "已识别并自动记账，可撤销")
        }

        try await LedgerIntentBridge.shared.presentConfirmation(draft)
        return .result(dialog: "识别完成，请确认")
    }
}

struct GenerateRecurringBillIntent: AppIntent {
    static var title: LocalizedStringResource = "生成周期账单"
    static var description = IntentDescription("生成房租、工资、订阅、房贷等周期账单。")
    static var openAppWhenRun = false

    @Parameter(title: "周期账单名称")
    var recurringName: String

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let draft = try await LedgerIntentBridge.shared.generateRecurring(named: recurringName)
        try await LedgerIntentBridge.shared.save(draft)
        return .result(dialog: "已生成\(recurringName)")
    }
}

struct QueryFinanceSummaryIntent: AppIntent {
    static var title: LocalizedStringResource = "查看财务摘要"
    static var description = IntentDescription("查询本月支出、预算剩余或家庭成员分摊。")
    static var openAppWhenRun = false

    @Parameter(title: "账本", default: LedgerBookEntity.family)
    var book: LedgerBookEntity

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let summary = try await LedgerIntentBridge.shared.summary(book: book)
        return .result(dialog: IntentDialog(summary))
    }
}

struct HeZangShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: AddTransactionIntent(),
            phrases: [
                "用\(.applicationName)记一笔",
                "在\(.applicationName)新增账单"
            ],
            shortTitle: "记一笔",
            systemImageName: "plus.circle.fill"
        )

        AppShortcut(
            intent: VoiceLedgerIntent(),
            phrases: [
                "用\(.applicationName)语音记账",
                "\(.applicationName)家庭账本记一笔"
            ],
            shortTitle: "语音记账",
            systemImageName: "waveform"
        )

        AppShortcut(
            intent: RecognizeReceiptIntent(),
            phrases: [
                "用\(.applicationName)识别支付截图",
                "\(.applicationName)扫图记账"
            ],
            shortTitle: "扫图记账",
            systemImageName: "doc.viewfinder"
        )

        AppShortcut(
            intent: QueryFinanceSummaryIntent(),
            phrases: [
                "查看\(.applicationName)本月支出",
                "查看\(.applicationName)预算剩余"
            ],
            shortTitle: "财务摘要",
            systemImageName: "chart.line.uptrend.xyaxis"
        )
    }
}

actor LedgerIntentBridge {
    static let shared = LedgerIntentBridge()

    func save(_ draft: LedgerDraft) async throws {
        // Production: validate permissions, write to local store, sync to Supabase, schedule undo.
    }

    func presentConfirmation(_ draft: LedgerDraft) async throws {
        // Production: open the confirmation scene with amount, merchant, category, account, book, member and receipt.
    }

    func parse(_ text: String) async throws -> LedgerDraft {
        // Production: use the same parser as the App, backed by merchant rules and user preference memory.
        let book = text.contains("家庭") ? LedgerBookEntity.family : LedgerBookEntity.personal
        let category = text.contains("打车")
            ? LedgerCategoryEntity(id: "transport", name: "交通", kind: .expense)
            : LedgerCategoryEntity.food
        let account = text.contains("支付宝")
            ? LedgerAccountEntity(id: "alipay", name: "支付宝", isFamilyAccount: false)
            : LedgerAccountEntity.wechat
        let member = text.contains("老婆")
            ? LedgerMemberEntity(id: "wife", name: "老婆", role: "普通成员")
            : LedgerMemberEntity.me
        LedgerDraft(
            bookId: book.id,
            bookName: book.name,
            bookKind: book.kind,
            amount: Decimal(string: text.firstMatch(#"(\d+(?:\.\d+)?)"#) ?? "0") ?? 0,
            kind: text.contains("收入") ? .income : .expense,
            categoryId: category.id,
            categoryName: category.name,
            accountId: account.id,
            accountName: account.name,
            date: .now,
            note: text,
            tags: ["Siri"],
            memberId: member.id,
            memberName: member.name,
            source: "siri",
            confidence: 0.86,
            requiresConfirmation: true
        )
    }

    func recognize(_ image: IntentFile, book: LedgerBookEntity) async throws -> LedgerDraft {
        // Production: OCR image, classify merchant, infer account and keep original image as receipt.
        LedgerDraft(
            bookId: book.id,
            bookName: book.name,
            bookKind: book.kind,
            amount: 0,
            kind: .expense,
            categoryId: LedgerCategoryEntity.food.id,
            categoryName: LedgerCategoryEntity.food.name,
            accountId: LedgerAccountEntity.wechat.id,
            accountName: LedgerAccountEntity.wechat.name,
            date: .now,
            note: "截图识别账单",
            tags: ["截图", "OCR"],
            memberId: LedgerMemberEntity.me.id,
            memberName: LedgerMemberEntity.me.name,
            source: "receipt_ocr",
            confidence: 0.0,
            requiresConfirmation: true
        )
    }

    func generateRecurring(named name: String) async throws -> LedgerDraft {
        let category = name.contains("工资") ? LedgerCategoryEntity.salary : LedgerCategoryEntity(id: "home", name: "居住", kind: .expense)
        LedgerDraft(
            bookId: LedgerBookEntity.family.id,
            bookName: LedgerBookEntity.family.name,
            bookKind: LedgerBookEntity.family.kind,
            amount: name.contains("工资") ? 18500 : 5800,
            kind: name.contains("工资") ? .income : .expense,
            categoryId: category.id,
            categoryName: category.name,
            accountId: LedgerAccountEntity.familyCard.id,
            accountName: LedgerAccountEntity.familyCard.name,
            date: .now,
            note: name,
            tags: ["周期账单"],
            memberId: LedgerMemberEntity.me.id,
            memberName: LedgerMemberEntity.me.name,
            source: "recurring",
            confidence: 1,
            requiresConfirmation: false
        )
    }

    func summary(book: LedgerBookEntity) async throws -> String {
        "本月支出 5700 元，预算剩余 15400 元，家庭账本状态健康。"
    }
}

private extension String {
    func firstMatch(_ pattern: String) -> String? {
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return nil }
        let range = NSRange(startIndex..., in: self)
        guard let match = regex.firstMatch(in: self, range: range), let resultRange = Range(match.range(at: 1), in: self) else {
            return nil
        }
        return String(self[resultRange])
    }
}
