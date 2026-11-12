import ActivityKit
import SwiftUI
import WidgetKit

@main
struct RestTimerWidget: Widget {
    private let accent = Color(red: 0, green: 0.90, blue: 0.60)

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: RestTimerAttributes.self) { context in
            HStack(spacing: 12) {
                Image(systemName: "timer")
                    .font(.title2)
                    .foregroundStyle(accent)
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Mit2Fit").font(.caption)
                    Text(context.isStale ? "Rest complete" : "Rest timer").font(.headline)
                }
                Spacer()
                countdown(context)
                    .font(.title2.weight(.semibold))
                    .multilineTextAlignment(.trailing)
                    .frame(width: 90, alignment: .trailing)
            }
            .padding(16)
            .activityBackgroundTint(Color(red: 0.035, green: 0.035, blue: 0.043))
            .foregroundStyle(.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label("Mit2Fit", systemImage: "timer").foregroundStyle(accent)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    countdown(context)
                        .multilineTextAlignment(.trailing)
                        .frame(width: 84, alignment: .trailing)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text(context.isStale ? "Rest complete" : "Rest between sets")
                        .font(.caption)
                }
            } compactLeading: {
                Image(systemName: "timer").foregroundStyle(accent)
            } compactTrailing: {
                countdown(context)
                    .multilineTextAlignment(.trailing)
                    .frame(width: 50, alignment: .trailing)
            } minimal: {
                Image(systemName: "timer").foregroundStyle(accent)
            }
            .keylineTint(accent)
        }
    }

    private func countdown(_ context: ActivityViewContext<RestTimerAttributes>) -> some View {
        Text(
            timerInterval: context.state.startsAt...context.state.endsAt,
            pauseTime: context.state.endsAt,
            countsDown: true,
            showsHours: false
        )
        .monospacedDigit()
        .foregroundStyle(accent)
    }
}
