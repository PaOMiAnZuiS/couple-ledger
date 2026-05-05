import AppIntents
import SwiftUI
import WidgetKit

struct QuickLedgerWidget: Widget {
    let kind = "QuickLedgerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            QuickLedgerWidgetView(entry: entry)
        }
        .configurationDisplayName("合账快捷入口")
        .description("快速记账、扫图识别、查看预算剩余。")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct LedgerEntry: TimelineEntry {
    let date: Date
    let monthExpense: String
    let budgetLeft: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> LedgerEntry {
        LedgerEntry(date: .now, monthExpense: "¥5,700", budgetLeft: "¥15,400")
    }

    func getSnapshot(in context: Context, completion: @escaping (LedgerEntry) -> Void) {
        completion(placeholder(in: context))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<LedgerEntry>) -> Void) {
        completion(Timeline(entries: [placeholder(in: context)], policy: .after(.now.addingTimeInterval(1800))))
    }
}

struct QuickLedgerWidgetView: View {
    let entry: LedgerEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("合账")
                .font(.headline)
            Text("本月支出 \(entry.monthExpense)")
                .font(.subheadline)
            Text("预算剩余 \(entry.budgetLeft)")
                .font(.caption)
                .foregroundStyle(.secondary)

            HStack {
                Button(intent: OpenQuickEntryIntent()) {
                    Label("记账", systemImage: "plus.circle.fill")
                }
                Button(intent: OpenReceiptScanIntent()) {
                    Label("扫图", systemImage: "doc.viewfinder")
                }
            }
            .buttonStyle(.borderedProminent)
        }
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct OpenQuickEntryIntent: AppIntent {
    static var title: LocalizedStringResource = "打开快速记账"
    static var openAppWhenRun = true

    func perform() async throws -> some IntentResult {
        // Production: route to the Add Transaction scene within 1 second.
        .result()
    }
}

struct OpenReceiptScanIntent: AppIntent {
    static var title: LocalizedStringResource = "打开扫图识别"
    static var openAppWhenRun = true

    func perform() async throws -> some IntentResult {
        // Production: route to receipt recognition and request photo/share input.
        .result()
    }
}
