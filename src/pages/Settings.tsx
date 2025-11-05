import { useGuide } from '../context/GuideContext'

const Settings = () => {
  const { autoStartEnabled, setAutoStartEnabled } = useGuide()

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Settings
        </h3>
        <p className="text-gray-600">Configure your guide settings</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Guide Settings</h4>
        
        <div className="space-y-6">
          {/* Auto-start Toggle */}
          <div className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
            <div className="flex-1">
              <h5 className="font-medium text-gray-900 mb-1">Auto-start Guides</h5>
              <p className="text-sm text-gray-600">
                Automatically start guides when you visit a page for the first time
              </p>
            </div>
            <button
              onClick={() => setAutoStartEnabled(!autoStartEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                autoStartEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  autoStartEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Guide Info */}
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <span>💡</span> About Guides
            </h5>
            <p className="text-sm text-gray-700 mb-2">
              Guides help you learn how to use various features in the ERP system. 
              They highlight important UI elements and provide step-by-step instructions.
            </p>
            <p className="text-sm text-gray-700">
              You can always start a guide manually with the "Start Guide" button when available.
            </p>
          </div>

          {/* Available Guides */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Available Guides</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-medium text-gray-900">Invoice Creation Guide</p>
                    <p className="text-sm text-gray-600">Learn how to create customer invoices</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Reset Guide Progress */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                localStorage.removeItem('guideCompleted')
                localStorage.removeItem('invoiceGuideCompleted')
                alert('Guide progress has been reset. Guides will be shown again on first visit.')
              }}
              className="px-5 py-2.5 text-sm text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Reset Guide Progress
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Reset all completed guides to see them again
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
