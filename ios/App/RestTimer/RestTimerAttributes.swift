import ActivityKit
import Foundation

struct RestTimerAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        let startsAt: Date
        let endsAt: Date
    }
}
