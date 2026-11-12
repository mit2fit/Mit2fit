import Capacitor
import UIKit

final class TrackerViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(TrackerPlugin())
        view.backgroundColor = UIColor(red: 0.035, green: 0.035, blue: 0.043, alpha: 1)
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }
}
