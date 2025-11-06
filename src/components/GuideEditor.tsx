import React, { useState } from 'react'
import { GuideConfig, GuideStep } from '../types'
import ElementPicker from './ElementPicker'

interface GuideEditorProps {
  guide: GuideConfig
  onSave: (guide: GuideConfig) => void
  onCancel: () => void
}

const GuideEditor: React.FC<GuideEditorProps> = ({ guide, onSave, onCancel }) => {
  const [editedGuide, setEditedGuide] = useState<GuideConfig>(guide)
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [isPickingElement, setIsPickingElement] = useState(false)

  const handleGuideMetadataChange = (field: keyof GuideConfig, value: any) => {
    setEditedGuide({ ...editedGuide, [field]: value })
  }

  const handleStepChange = (index: number, field: keyof GuideStep | string, value: any) => {
    const newSteps = [...editedGuide.steps]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      newSteps[index] = {
        ...newSteps[index],
        [parent]: {
          ...(newSteps[index] as any)[parent],
          [child]: value
        }
      }
    } else {
      newSteps[index] = { ...newSteps[index], [field]: value }
    }
    setEditedGuide({ ...editedGuide, steps: newSteps })
  }

  const addStep = () => {
    const newStep: GuideStep = {
      element: '[data-guide-step="new-step"]',
      popover: {
        title: 'New Step',
        description: 'Describe what to do in this step',
        side: 'bottom',
        align: 'start'
      }
    }
    setEditedGuide({ ...editedGuide, steps: [...editedGuide.steps, newStep] })
    setSelectedStepIndex(editedGuide.steps.length)
  }

  const removeStep = (index: number) => {
    const newSteps = editedGuide.steps.filter((_, i) => i !== index)
    setEditedGuide({ ...editedGuide, steps: newSteps })
    setSelectedStepIndex(null)
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...editedGuide.steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSteps.length) return
    
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    setEditedGuide({ ...editedGuide, steps: newSteps })
    setSelectedStepIndex(targetIndex)
  }

  const duplicateStep = (index: number) => {
    const newSteps = [...editedGuide.steps]
    const duplicated = { ...newSteps[index] }
    newSteps.splice(index + 1, 0, duplicated)
    setEditedGuide({ ...editedGuide, steps: newSteps })
    setSelectedStepIndex(index + 1)
  }

  const handleElementPicked = (selector: string) => {
    if (selectedStepIndex !== null) {
      handleStepChange(selectedStepIndex, 'element', selector)
    }
    setIsPickingElement(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">Edit Guide</h2>
          <p className="text-purple-100 text-sm mt-1">Customize your onboarding guide</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Guide Metadata & Steps List */}
            <div className="space-y-6">
              {/* Guide Metadata */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span> Guide Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guide Name
                    </label>
                    <input
                      type="text"
                      value={editedGuide.name}
                      onChange={(e) => handleGuideMetadataChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editedGuide.description}
                      onChange={(e) => handleGuideMetadataChange('description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editedGuide.category}
                      onChange={(e) => handleGuideMetadataChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="autostart"
                      checked={editedGuide.autoStartDefault}
                      onChange={(e) => handleGuideMetadataChange('autoStartDefault', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="autostart" className="text-sm font-medium text-gray-700">
                      Auto-start by default
                    </label>
                  </div>
                </div>
              </div>

              {/* Steps List */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>📝</span> Steps ({editedGuide.steps.length})
                  </h3>
                  <button
                    onClick={addStep}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {editedGuide.steps.map((step, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedStepIndex(index)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStepIndex === index
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                              Step {index + 1}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {step.element}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {step.popover.title}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStep(index, 'up'); }}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStep(index, 'down'); }}
                            disabled={index === editedGuide.steps.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Step Editor */}
            <div>
              {selectedStepIndex !== null ? (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 sticky top-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>✏️</span> Edit Step {selectedStepIndex + 1}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => duplicateStep(selectedStepIndex)}
                        className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Duplicate step"
                      >
                        📋 Duplicate
                      </button>
                      <button
                        onClick={() => removeStep(selectedStepIndex)}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Element Selector
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editedGuide.steps[selectedStepIndex].element}
                          onChange={(e) => handleStepChange(selectedStepIndex, 'element', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          placeholder="[data-guide-step='example']"
                        />
                        <button
                          onClick={() => setIsPickingElement(true)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                          title="Pick element from UI"
                        >
                          🎯 Pick
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        CSS selector for the element to highlight • Click "Pick" to select visually
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={editedGuide.steps[selectedStepIndex].popover.title}
                        onChange={(e) => handleStepChange(selectedStepIndex, 'popover.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editedGuide.steps[selectedStepIndex].popover.description}
                        onChange={(e) => handleStepChange(selectedStepIndex, 'popover.description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Popover Position
                        </label>
                        <select
                          value={editedGuide.steps[selectedStepIndex].popover.side || 'bottom'}
                          onChange={(e) => handleStepChange(selectedStepIndex, 'popover.side', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="top">Top</option>
                          <option value="right">Right</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alignment
                        </label>
                        <select
                          value={editedGuide.steps[selectedStepIndex].popover.align || 'start'}
                          onChange={(e) => handleStepChange(selectedStepIndex, 'popover.align', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="start">Start</option>
                          <option value="center">Center</option>
                          <option value="end">End</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Preview Box */}
                    <div className="mt-6 p-4 bg-white rounded-lg border-2 border-purple-200">
                      <p className="text-xs font-semibold text-purple-600 mb-2">PREVIEW</p>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {editedGuide.steps[selectedStepIndex].popover.title}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {editedGuide.steps[selectedStepIndex].popover.description}
                      </p>
                      <div className="mt-3 flex gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {editedGuide.steps[selectedStepIndex].popover.side || 'bottom'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {editedGuide.steps[selectedStepIndex].popover.align || 'start'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 border border-gray-200 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-gray-600">Select a step to edit</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {editedGuide.steps.length} step{editedGuide.steps.length !== 1 ? 's' : ''} in this guide
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-sm text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedGuide)}
              className="px-5 py-2.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Element Picker */}
      {isPickingElement && (
        <ElementPicker
          onSelect={handleElementPicked}
          onCancel={() => setIsPickingElement(false)}
        />
      )}
    </div>
  )
}

export default GuideEditor
