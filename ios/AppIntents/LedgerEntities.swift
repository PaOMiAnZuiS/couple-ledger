import AppIntents
import Foundation

struct LedgerBookEntity: AppEntity, Identifiable, Hashable {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "账本")
    static var defaultQuery = LedgerBookQuery()

    let id: String
    let name: String
    let kind: LedgerBookKind

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)", subtitle: kind == .family ? "家庭共享账本" : "个人账本")
    }

    static let personal = LedgerBookEntity(id: "personal-default", name: "我的个人账本", kind: .personal)
    static let family = LedgerBookEntity(id: "family-default", name: "家庭账本", kind: .family)
}

struct LedgerBookQuery: EntityStringQuery {
    func entities(for identifiers: [LedgerBookEntity.ID]) async throws -> [LedgerBookEntity] {
        Self.all.filter { identifiers.contains($0.id) }
    }

    func entities(matching string: String) async throws -> [LedgerBookEntity] {
        Self.all.filter { $0.name.localizedStandardContains(string) }
    }

    func suggestedEntities() async throws -> [LedgerBookEntity] {
        Self.all
    }

    static let all: [LedgerBookEntity] = [
        .personal,
        .family,
        LedgerBookEntity(id: "travel-2026", name: "旅行账本", kind: .family),
        LedgerBookEntity(id: "renovation", name: "装修账本", kind: .family)
    ]
}

struct LedgerCategoryEntity: AppEntity, Identifiable, Hashable {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "分类")
    static var defaultQuery = LedgerCategoryQuery()

    let id: String
    let name: String
    let kind: TransactionKind

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)", subtitle: kind.displayName)
    }

    static let food = LedgerCategoryEntity(id: "food", name: "餐饮", kind: .expense)
    static let salary = LedgerCategoryEntity(id: "salary", name: "工资", kind: .income)
    static let transfer = LedgerCategoryEntity(id: "transfer", name: "转账", kind: .transfer)
}

struct LedgerCategoryQuery: EntityStringQuery {
    func entities(for identifiers: [LedgerCategoryEntity.ID]) async throws -> [LedgerCategoryEntity] {
        Self.all.filter { identifiers.contains($0.id) }
    }

    func entities(matching string: String) async throws -> [LedgerCategoryEntity] {
        Self.all.filter { $0.name.localizedStandardContains(string) }
    }

    func suggestedEntities() async throws -> [LedgerCategoryEntity] {
        Self.all
    }

    static let all: [LedgerCategoryEntity] = [
        .food,
        LedgerCategoryEntity(id: "transport", name: "交通", kind: .expense),
        LedgerCategoryEntity(id: "shopping", name: "购物", kind: .expense),
        LedgerCategoryEntity(id: "home", name: "居住", kind: .expense),
        LedgerCategoryEntity(id: "health", name: "医疗", kind: .expense),
        LedgerCategoryEntity(id: "education", name: "教育", kind: .expense),
        LedgerCategoryEntity(id: "travel", name: "旅行", kind: .expense),
        LedgerCategoryEntity(id: "digital", name: "数码", kind: .expense),
        .salary,
        LedgerCategoryEntity(id: "bonus", name: "奖金", kind: .income),
        .transfer
    ]
}

struct LedgerAccountEntity: AppEntity, Identifiable, Hashable {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "账户")
    static var defaultQuery = LedgerAccountQuery()

    let id: String
    let name: String
    let isFamilyAccount: Bool

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)", subtitle: isFamilyAccount ? "家庭共同账户" : "个人账户")
    }

    static let wechat = LedgerAccountEntity(id: "wechat", name: "微信钱包", isFamilyAccount: false)
    static let familyCard = LedgerAccountEntity(id: "family-card", name: "家庭银行卡", isFamilyAccount: true)
}

struct LedgerAccountQuery: EntityStringQuery {
    func entities(for identifiers: [LedgerAccountEntity.ID]) async throws -> [LedgerAccountEntity] {
        Self.all.filter { identifiers.contains($0.id) }
    }

    func entities(matching string: String) async throws -> [LedgerAccountEntity] {
        Self.all.filter { $0.name.localizedStandardContains(string) }
    }

    func suggestedEntities() async throws -> [LedgerAccountEntity] {
        Self.all
    }

    static let all: [LedgerAccountEntity] = [
        LedgerAccountEntity(id: "cash", name: "现金", isFamilyAccount: false),
        LedgerAccountEntity(id: "cmb", name: "招商银行卡", isFamilyAccount: false),
        .wechat,
        LedgerAccountEntity(id: "alipay", name: "支付宝", isFamilyAccount: false),
        LedgerAccountEntity(id: "credit", name: "信用卡", isFamilyAccount: false),
        .familyCard,
        LedgerAccountEntity(id: "family-cash", name: "家庭现金", isFamilyAccount: true),
        LedgerAccountEntity(id: "travel-fund", name: "旅行基金", isFamilyAccount: true)
    ]
}

struct LedgerMemberEntity: AppEntity, Identifiable, Hashable {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "成员")
    static var defaultQuery = LedgerMemberQuery()

    let id: String
    let name: String
    let role: String

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)", subtitle: role)
    }

    static let me = LedgerMemberEntity(id: "me", name: "我", role: "家庭管理员")
}

struct LedgerMemberQuery: EntityStringQuery {
    func entities(for identifiers: [LedgerMemberEntity.ID]) async throws -> [LedgerMemberEntity] {
        Self.all.filter { identifiers.contains($0.id) }
    }

    func entities(matching string: String) async throws -> [LedgerMemberEntity] {
        Self.all.filter { $0.name.localizedStandardContains(string) }
    }

    func suggestedEntities() async throws -> [LedgerMemberEntity] {
        Self.all
    }

    static let all: [LedgerMemberEntity] = [
        .me,
        LedgerMemberEntity(id: "wife", name: "老婆", role: "普通成员"),
        LedgerMemberEntity(id: "parent", name: "父母", role: "只读成员")
    ]
}

extension TransactionKind {
    var displayName: String {
        switch self {
        case .expense: "支出"
        case .income: "收入"
        case .transfer: "转账"
        }
    }
}
