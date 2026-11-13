# Mit2Fit for iPhone

Run `npm ci` and `npm run build:ios` from the repository root, then open `ios/App/App.xcodeproj` and run the App scheme. Open **Mit2Fit Tracker** on the iPhone. The app bundles the existing tracker so workouts can be logged offline. It supports iOS 16.4 and newer.

For a device or TestFlight build, select the Mit2Fit LLC Apple Developer team in Signing & Capabilities for both the App and RestTimer targets. The app and extension use the identifiers `com.mit2fit.tracker` and `com.mit2fit.tracker.RestTimer`. The app target uses the HealthKit capability. Before submission, add the app’s public privacy policy in App Store Connect and verify both integrations on a signed build running on an iPhone.

For a smoke test, start a rest timer and wait for **Lock Screen timer on**, then lock the iPhone. If the tracker says **Enable Live Activities in Settings**, tap the message and enable Live Activities for Mit2Fit Tracker. Unlock, extend it, and confirm the new deadline. Skip or finish the workout to end the Live Activity. To receive an alert at the end of rest, tap Alerts in the tracker and allow notifications.

To test Apple Health, finish a workout and choose **Save to Apple Health**. For an older entry with no duration, enter the elapsed seconds before saving. Allow Mit2Fit Tracker to write workouts and confirm the strength workout appears in Health. If you already use the web tracker, use **Saved to Device** in Safari to export a backup, then import it in the app.
