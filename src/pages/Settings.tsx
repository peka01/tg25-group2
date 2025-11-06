import { useState, useEffect } from 'react'
import { useGuide } from '../context/GuideContext'
import { GuideConfig } from '../types'
import GuideEditor from '../components/GuideEditor'

const Settings = () => {
  const { autoStartEnabled, setAutoStartEnabled, startGuide } = useGuide()
  const [guides, setGuides] = useState<{ id: string; config: GuideConfig; active: boolean }[]>([])
  const [editingGuide, setEditingGuide] = useState<{ id: string; config: GuideConfig } | null>(null)
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user')
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')

  // Load available guides
  useEffect(() => {
    const loadGuides = async () => {
      const guideList = [
        { id: 'invoice-creation', active: true },
        { id: 'view-invoices', active: true }
      ]
      
      const loadedGuides = await Promise.all(
        guideList.map(async ({ id, active }) => {
          try {
            const response = await fetch(`/src/data/guides/${id}.json`)
            const config = await response.json()
            return { id, config, active }
          } catch (error) {
            console.error(`Failed to load guide ${id}:`, error)
            return null
          }
        })
      )
      
      setGuides(loadedGuides.filter(Boolean) as any)
    }
    
    loadGuides()
  }, [])

  const handleSaveGuide = (config: GuideConfig) => {
    if (!editingGuide) return
    
    // Update the guide in state
    setGuides(guides.map(g => 
      g.id === editingGuide.id ? { ...g, config } : g
    ))
    
    // In a real app, you would save to backend/file system here
    const json = JSON.stringify(config, null, 2)
    console.log('Save guide:', editingGuide.id, json)
    
    // For demo purposes, offer download
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${editingGuide.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    setEditingGuide(null)
  }

  const handleToggleGuide = (id: string) => {
    setGuides(guides.map(g => 
      g.id === id ? { ...g, active: !g.active } : g
    ))
  }

  const handleDeleteGuide = (id: string) => {
    if (confirm(`Are you sure you want to delete the "${guides.find(g => g.id === id)?.config.name}" guide?`)) {
      setGuides(guides.filter(g => g.id !== id))
    }
  }

  const handleImportGuide = () => {
    try {
      const config = JSON.parse(importText)
      const id = config.name.toLowerCase().replace(/\s+/g, '-')
      setGuides([...guides, { id, config, active: true }])
      setImportText('')
      setShowImport(false)
      alert('Guide imported successfully!')
    } catch (error) {
      alert('Invalid JSON format. Please check your input.')
    }
  }

  const handleExportGuide = (guide: { id: string; config: GuideConfig }) => {
    const json = JSON.stringify(guide.config, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${guide.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTestGuide = (id: string) => {
    startGuide(id)
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Settings
        </h3>
        <p className="text-gray-600">Configure your guide settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('user')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'user'
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Settings
            {activeTab === 'user' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'admin'
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              Admin Panel
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                Advanced
              </span>
            </span>
            {activeTab === 'admin' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Settings Tab */}
      {activeTab === 'user' && (
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
              {guides.filter(g => g.active).map((guide) => (
                <div 
                  key={guide.id}
                  className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <p className="font-medium text-gray-900">{guide.config.name}</p>
                      <p className="text-sm text-gray-600">{guide.config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTestGuide(guide.id)}
                      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Test
                    </button>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
              {guides.filter(g => g.active).length === 0 && (
                <p className="text-gray-500 text-center py-8">No active guides available</p>
              )}
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
      )}

      {/* Admin Panel Tab */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <h4 className="text-xl font-bold mb-2">Guide Management Console</h4>
            <p className="text-purple-100">
              Create, edit, and manage onboarding guides for your application
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const newGuide: GuideConfig = {
                  name: 'New Guide',
                  description: 'Guide description',
                  category: 'general',
                  autoStartDefault: false,
                  steps: []
                }
                setEditingGuide({ id: `new-guide-${Date.now()}`, config: newGuide })
              }}
              className="p-5 bg-white border-2 border-purple-300 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <h5 className="font-semibold text-gray-900 mb-1">Create New Guide</h5>
              <p className="text-sm text-gray-600">Start from scratch</p>
            </button>
            
            <button
              onClick={() => setShowImport(true)}
              className="p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">📥</div>
              <h5 className="font-semibold text-gray-900 mb-1">Import Guide</h5>
              <p className="text-sm text-gray-600">From JSON file</p>
            </button>
            
            <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">📊</div>
              <h5 className="font-semibold text-gray-900 mb-1">Statistics</h5>
              <p className="text-sm text-gray-600">
                {guides.length} total guides
                <br />
                {guides.filter(g => g.active).length} active
              </p>
            </div>
          </div>

          {/* Guides List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h5 className="font-semibold text-gray-900">All Guides</h5>
            </div>
            <div className="divide-y divide-gray-200">
              {guides.map((guide) => (
                <div key={guide.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h6 className="font-semibold text-gray-900 text-lg">
                          {guide.config.name}
                        </h6>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          guide.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {guide.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          {guide.config.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{guide.config.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>📝</span> {guide.config.steps.length} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <span>{guide.config.autoStartDefault ? '✅' : '⏸️'}</span>
                          {guide.config.autoStartDefault ? 'Auto-start enabled' : 'Manual start'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingGuide({ id: guide.id, config: guide.config })}
                        className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleTestGuide(guide.id)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        ▶️ Test
                      </button>
                      <button
                        onClick={() => handleToggleGuide(guide.id)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                          guide.active
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {guide.active ? '⏸️ Disable' : '▶️ Enable'}
                      </button>
                      <button
                        onClick={() => handleExportGuide(guide)}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        📤 Export
                      </button>
                      <button
                        onClick={() => handleDeleteGuide(guide.id)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {guides.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-600 mb-4">No guides yet</p>
                  <button
                    onClick={() => {
                      const newGuide: GuideConfig = {
                        name: 'New Guide',
                        description: 'Guide description',
                        category: 'general',
                        autoStartDefault: false,
                        steps: []
                      }
                      setEditingGuide({ id: `new-guide-${Date.now()}`, config: newGuide })
                    }}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Create Your First Guide
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>💡</span> Guide Design Best Practices
            </h5>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span><strong>Keep steps concise:</strong> 5-8 steps is ideal for most guides</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span><strong>Use clear language:</strong> Avoid jargon and technical terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span><strong>Test thoroughly:</strong> Always test guides in the actual UI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span><strong>Progressive disclosure:</strong> Show one concept at a time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span><strong>Celebrate completion:</strong> End with positive reinforcement</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Guide Editor Modal */}
      {editingGuide && (
        <GuideEditor
          guide={editingGuide.config}
          onSave={handleSaveGuide}
          onCancel={() => setEditingGuide(null)}
        />
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5 text-white rounded-t-xl">
              <h3 className="text-xl font-bold">Import Guide</h3>
              <p className="text-purple-100 text-sm mt-1">Paste your guide JSON configuration</p>
            </div>
            <div className="p-6">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                placeholder='{"name": "My Guide", "description": "...", ...}'
              />
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => { setShowImport(false); setImportText(''); }}
                className="px-5 py-2.5 text-sm text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImportGuide}
                className="px-5 py-2.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
