import React, { useState, useEffect, useCallback } from 'react'

interface ElementPickerProps {
  onSelect: (selector: string) => void
  onCancel: () => void
}

const ElementPicker: React.FC<ElementPickerProps> = ({ onSelect, onCancel }) => {
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null)
  const [hoveredSelector, setHoveredSelector] = useState<string>('')

  // Generate a reliable CSS selector for an element
  const generateSelector = useCallback((element: Element): string => {
    // Priority 1: data-guide-step attribute
    const guideStep = element.getAttribute('data-guide-step')
    if (guideStep) {
      return `[data-guide-step="${guideStep}"]`
    }

    // Priority 2: ID
    if (element.id) {
      return `#${element.id}`
    }

    // Priority 3: Unique class combination
    const classes = Array.from(element.classList).filter(c => !c.startsWith('hover-') && !c.startsWith('picker-'))
    if (classes.length > 0) {
      const classSelector = `.${classes.join('.')}`
      // Test if it's unique
      if (document.querySelectorAll(classSelector).length === 1) {
        return classSelector
      }
    }

    // Priority 4: Build a path with parent context
    const buildPath = (el: Element): string => {
      const parts: string[] = []
      let current: Element | null = el

      while (current && current !== document.body && parts.length < 3) {
        let part = current.tagName.toLowerCase()
        
        if (current.id) {
          part = `#${current.id}`
          parts.unshift(part)
          break
        }

        const classNames = Array.from(current.classList)
          .filter(c => !c.startsWith('hover-') && !c.startsWith('picker-'))
          .slice(0, 2)
        
        if (classNames.length > 0) {
          part += `.${classNames.join('.')}`
        }

        // Add nth-child if needed for specificity
        const parent = current.parentElement
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            child => child.tagName === current!.tagName
          )
          if (siblings.length > 1) {
            const index = siblings.indexOf(current) + 1
            part += `:nth-child(${index})`
          }
        }

        parts.unshift(part)
        current = current.parentElement
      }

      return parts.join(' > ')
    }

    return buildPath(element)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as Element
    
    // Ignore the picker overlay itself
    if (target.closest('.element-picker-overlay')) {
      return
    }

    setHoveredElement(target)
    setHoveredSelector(generateSelector(target))
  }, [generateSelector])

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as Element
    
    // Ignore clicks on the picker overlay
    if (target.closest('.element-picker-overlay')) {
      return
    }

    const selector = generateSelector(target)
    onSelect(selector)
  }, [generateSelector, onSelect])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)

    // Add cursor styling
    document.body.classList.add('element-picker-active')

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.body.classList.remove('element-picker-active')
    }
  }, [handleMouseMove, handleClick, handleKeyDown])

  // Get bounding rect of hovered element
  const rect = hoveredElement?.getBoundingClientRect()

  return (
    <>
      {/* Overlay */}
      <div className="element-picker-overlay fixed inset-0 z-[9999] pointer-events-none">
        {/* Instructions Banner */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 shadow-xl pointer-events-auto">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-lg">Element Picker Mode</h3>
                <p className="text-purple-100 text-sm">
                  Hover over any element and click to select it
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium pointer-events-auto"
            >
              Cancel (Esc)
            </button>
          </div>
        </div>

        {/* Selector Info Box */}
        {hoveredSelector && rect && (
          <div
            className="fixed bg-black text-white px-4 py-2 rounded-lg text-sm font-mono shadow-xl pointer-events-none"
            style={{
              top: rect.top > 120 ? rect.top - 40 : rect.bottom + 10,
              left: Math.min(rect.left, window.innerWidth - 400),
              maxWidth: '400px',
              zIndex: 10001
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="truncate">{hoveredSelector}</span>
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Click to select • Tag: {hoveredElement?.tagName.toLowerCase()}
            </div>
          </div>
        )}

        {/* Highlight Overlay */}
        {rect && (
          <>
            {/* Main highlight box */}
            <div
              className="fixed border-4 border-purple-500 bg-purple-500 bg-opacity-10 pointer-events-none transition-all duration-100"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                zIndex: 10000
              }}
            />
            
            {/* Dimension labels */}
            <div
              className="fixed bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none"
              style={{
                top: rect.top - 24,
                left: rect.left,
                zIndex: 10001
              }}
            >
              {Math.round(rect.width)} × {Math.round(rect.height)}
            </div>

            {/* Element info badge */}
            <div
              className="fixed bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none"
              style={{
                top: rect.bottom + 4,
                left: rect.left,
                zIndex: 10001
              }}
            >
              {hoveredElement?.tagName.toLowerCase()}
              {hoveredElement?.className && ` .${hoveredElement.className.split(' ')[0]}`}
            </div>
          </>
        )}

        {/* Help hints */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-6 py-3 rounded-full shadow-xl pointer-events-none">
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                ⬆
              </span>
              Hover to preview
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                🖱
              </span>
              Click to select
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                Esc
              </span>
              Cancel
            </span>
          </div>
        </div>
      </div>

      {/* CSS to prevent interactions during picking */}
      <style>{`
        .element-picker-active * {
          cursor: crosshair !important;
        }
      `}</style>
    </>
  )
}

export default ElementPicker
