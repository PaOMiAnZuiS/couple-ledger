import Foundation
import UniformTypeIdentifiers

struct SharedReceiptCandidate: Codable, Hashable {
    var amount: Decimal?
    var merchant: String?
    var paidAt: Date?
    var account: String?
    var category: String?
    var rawText: String?
    var confidence: Double
    var attachmentBookmark: Data?
}

final class ShareImportHandler {
    func handle(extensionItems: [NSExtensionItem]) async throws -> SharedReceiptCandidate {
        for item in extensionItems {
            guard let providers = item.attachments else { continue }
            for provider in providers {
                if provider.hasItemConformingToTypeIdentifier(UTType.image.identifier) {
                    return try await loadImageAndRecognize(provider)
                }
                if provider.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
                    return try await loadURLAndRecognize(provider)
                }
                if provider.hasItemConformingToTypeIdentifier(UTType.text.identifier) {
                    return try await loadTextAndRecognize(provider)
                }
            }
        }
        return SharedReceiptCandidate(confidence: 0)
    }

    private func loadImageAndRecognize(_ provider: NSItemProvider) async throws -> SharedReceiptCandidate {
        // Production: use Vision OCR, payment screenshot classifier and account/category recommender.
        SharedReceiptCandidate(
            amount: nil,
            merchant: nil,
            paidAt: nil,
            account: nil,
            category: nil,
            rawText: nil,
            confidence: 0,
            attachmentBookmark: nil
        )
    }

    private func loadURLAndRecognize(_ provider: NSItemProvider) async throws -> SharedReceiptCandidate {
        // Production: parse supported order URLs, preserve original URL as receipt evidence.
        SharedReceiptCandidate(confidence: 0)
    }

    private func loadTextAndRecognize(_ provider: NSItemProvider) async throws -> SharedReceiptCandidate {
        // Production: parse copied payment/order text and create a confirmation draft.
        SharedReceiptCandidate(confidence: 0)
    }
}
