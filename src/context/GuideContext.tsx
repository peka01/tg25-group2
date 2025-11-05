import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { driver, DriveStep, Driver } from 'driver.js'
import { GuideConfig } from '../types'

interface GuideContextType {
  startGuide: (guideName: string) => void
  stopGuide: () => void
  isGuideActive: boolean
  autoStartEnabled: boolean
  setAutoStartEnabled: (enabled: boolean) => void
}

const GuideContext = createContext<GuideContextType | undefined>(undefined)

export const useGuide = () => {
  const context = useContext(GuideContext)
  if (!context) {
    throw new Error('useGuide must be used within GuideProvider')
  }
  return context
}

export const GuideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuideActive, setIsGuideActive] = useState(false)
  const [autoStartEnabled, setAutoStartEnabled] = useState(() => {
    const saved = localStorage.getItem('guideAutoStart')
    return saved !== null ? JSON.parse(saved) : true
  })
  const driverRef = useRef<Driver | null>(null)

  useEffect(() => {
    localStorage.setItem('guideAutoStart', JSON.stringify(autoStartEnabled))
  }, [autoStartEnabled])

  const loadGuideConfig = async (guideName: string): Promise<GuideConfig | null> => {
    try {
      const response = await fetch(`/src/data/guides/${guideName}.json`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Failed to load guide:', error)
      return null
    }
  }

  const startGuide = useCallback(async (guideName: string) => {
    const config = await loadGuideConfig(guideName)
    if (!config) {
      console.error(`Guide ${guideName} not found`)
      return
    }

    // Clean up existing driver
    if (driverRef.current) {
      driverRef.current.destroy()
    }

    // Convert guide steps to driver.js format
    const driverSteps: DriveStep[] = config.steps.map(step => ({
      element: step.element,
      popover: {
        title: step.popover.title,
        description: step.popover.description,
        side: step.popover.side || 'bottom',
        align: step.popover.align || 'start'
      }
    }))

    // Create new driver instance
    const driverObj = driver({
      showProgress: true,
      steps: driverSteps,
      onDestroyStarted: () => {
        setIsGuideActive(false)
        if (driverRef.current) {
          driverRef.current.destroy()
          driverRef.current = null
        }
      },
      onDestroyed: () => {
        setIsGuideActive(false)
        driverRef.current = null
      },
      onNextClick: (_element, step, options) => {
        // Check if this is the last step
        if (step.popover && options.state && options.state.activeIndex === driverSteps.length - 1) {
          driverObj.destroy()
          setIsGuideActive(false)
          driverRef.current = null
        } else {
          driverObj.moveNext()
        }
      },
      popoverClass: 'driver-popover-custom',
      allowClose: true,
      doneBtnText: 'Done',
      nextBtnText: 'Next',
      prevBtnText: 'Previous'
    })

    driverRef.current = driverObj
    setIsGuideActive(true)
    driverObj.drive()
  }, [])

  const stopGuide = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy()
      driverRef.current = null
    }
    setIsGuideActive(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [])

  return (
    <GuideContext.Provider
      value={{
        startGuide,
        stopGuide,
        isGuideActive,
        autoStartEnabled,
        setAutoStartEnabled
      }}
    >
      {children}
    </GuideContext.Provider>
  )
}
