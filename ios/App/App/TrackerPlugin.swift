import ActivityKit
import Capacitor
import HealthKit
import UserNotifications

@objc(TrackerPlugin)
final class TrackerPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "TrackerPlugin"
    let jsName = "Mit2FitTracker"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "saveWorkout", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restAlertPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestRestAlerts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "syncRestTimer", returnType: CAPPluginReturnPromise)
    ]

    private lazy var healthStore = HKHealthStore()
    private let notifications = UNUserNotificationCenter.current()
    private let notificationID = "com.mit2fit.tracker.rest-complete"

    @objc func saveWorkout(_ call: CAPPluginCall) {
        guard let id = call.getString("id"), !id.isEmpty, id.utf8.count <= 128,
              let endAt = call.getDouble("endAt"), endAt.isFinite, endAt > 0,
              let duration = call.getDouble("durationSeconds"), duration.isFinite,
              duration > 0, duration < endAt / 1000 else {
            call.reject("This workout needs a valid date and duration to be saved to Apple Health.")
            return
        }

        Task { @MainActor in
            guard HKHealthStore.isHealthDataAvailable() else {
                call.reject("Apple Health is unavailable on this device.")
                return
            }
            do {
                let workoutType = HKObjectType.workoutType()
                if healthStore.authorizationStatus(for: workoutType) == .notDetermined {
                    try await healthStore.requestAuthorization(toShare: [workoutType], read: [])
                }
                guard healthStore.authorizationStatus(for: workoutType) == .sharingAuthorized else {
                    call.reject("Allow Mit2Fit to write workouts in the Health app’s privacy settings, then try again.")
                    return
                }

                let end = Date(timeIntervalSince1970: endAt / 1000)
                let configuration = HKWorkoutConfiguration()
                configuration.activityType = .traditionalStrengthTraining
                let builder = HKWorkoutBuilder(healthStore: healthStore, configuration: configuration, device: nil)
                try await builder.beginCollection(at: end.addingTimeInterval(-duration))
                try await builder.addMetadata([
                    HKMetadataKeySyncIdentifier: id,
                    HKMetadataKeySyncVersion: 1
                ])
                try await builder.endCollection(at: end)
                guard try await builder.finishWorkout() != nil else {
                    call.reject("Apple Health could not confirm that the workout was saved.")
                    return
                }
                call.resolve()
            } catch {
                call.reject("Could not save this workout to Apple Health.", nil, error)
            }
        }
    }

    @objc func restAlertPermission(_ call: CAPPluginCall) {
        Task {
            call.resolve(["permission": await alertPermission()])
        }
    }

    @objc func requestRestAlerts(_ call: CAPPluginCall) {
        Task {
            do {
                if await alertPermission() == "default" {
                    _ = try await notifications.requestAuthorization(options: [.alert, .sound])
                }
                call.resolve(["permission": await alertPermission()])
            } catch {
                call.reject("Could not request rest alert permission.", nil, error)
            }
        }
    }

    @objc func syncRestTimer(_ call: CAPPluginCall) {
        let timestamp = call.getDouble("endsAt")
        let notify = call.getBool("notify") ?? false
        let sound = call.getBool("sound") ?? true
        Task { @MainActor in
            notifications.removePendingNotificationRequests(withIdentifiers: [notificationID])
            let now = Date()
            let activities = Activity<RestTimerAttributes>.activities
            if let timestamp, timestamp.isFinite, timestamp / 1000 > now.timeIntervalSince1970 {
                let end = Date(timeIntervalSince1970: timestamp / 1000)
                if notify {
                    let content = UNMutableNotificationContent()
                    content.title = "Rest complete"
                    content.body = "Ready for your next set."
                    content.sound = sound ? .default : nil
                    let trigger = UNTimeIntervalNotificationTrigger(
                        timeInterval: max(1, end.timeIntervalSinceNow), repeats: false
                    )
                    do {
                        try await notifications.add(UNNotificationRequest(
                            identifier: notificationID, content: content, trigger: trigger
                        ))
                    } catch {
                        NSLog("Mit2Fit rest notification could not be scheduled: %@", error.localizedDescription)
                    }
                }

                if ActivityAuthorizationInfo().areActivitiesEnabled {
                    let content = ActivityContent(
                        state: RestTimerAttributes.ContentState(startsAt: now, endsAt: end),
                        staleDate: end
                    )
                    if let activity = activities.first {
                        await activity.update(content)
                    } else {
                        do {
                            _ = try Activity.request(attributes: RestTimerAttributes(), content: content, pushType: nil)
                        } catch {
                            NSLog("Mit2Fit Live Activity could not start: %@", error.localizedDescription)
                        }
                    }
                }
            } else {
                for activity in activities {
                    await activity.end(nil, dismissalPolicy: .immediate)
                }
            }
            call.resolve()
        }
    }

    private func alertPermission() async -> String {
        switch await notifications.notificationSettings().authorizationStatus {
        case .authorized, .provisional, .ephemeral: "granted"
        case .denied: "denied"
        default: "default"
        }
    }
}
