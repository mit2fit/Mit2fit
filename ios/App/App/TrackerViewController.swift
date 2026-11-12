import Capacitor
import UIKit

final class TrackerViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(TrackerPlugin())
        guard let webView else { return }
        let container = UIView()
        container.backgroundColor = UIColor(red: 0.035, green: 0.035, blue: 0.043, alpha: 1)
        view = container

        container.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        let safeArea = container.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: safeArea.topAnchor),
            webView.bottomAnchor.constraint(equalTo: safeArea.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: safeArea.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: safeArea.trailingAnchor)
        ])
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }
}
