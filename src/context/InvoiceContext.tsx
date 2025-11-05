import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Invoice, InvoiceLineItem, Customer } from '../types'
import { invoiceService } from '../services/mockData'

interface InvoiceContextType {
  currentInvoice: Partial<Invoice> | null
  setCustomer: (customer: Customer) => void
  addLineItem: (item: Omit<InvoiceLineItem, 'id' | 'total'>) => void
  updateLineItem: (id: string, updates: Partial<InvoiceLineItem>) => void
  removeLineItem: (id: string) => void
  saveInvoice: () => Invoice | null
  resetInvoice: () => void
  lineItems: InvoiceLineItem[]
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export const useInvoice = () => {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoice must be used within InvoiceProvider')
  }
  return context
}

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice> | null>(null)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([])

  const setCustomer = useCallback((customer: Customer) => {
    setCurrentInvoice(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    }))
  }, [])

  const addLineItem = useCallback((item: Omit<InvoiceLineItem, 'id' | 'total'>) => {
    const newItem: InvoiceLineItem = {
      ...item,
      id: Date.now().toString(),
      total: item.quantity * item.unitPrice
    }
    setLineItems(prev => [...prev, newItem])
  }, [])

  const updateLineItem = useCallback((id: string, updates: Partial<InvoiceLineItem>) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, ...updates }
      updated.total = updated.quantity * updated.unitPrice
      return updated
    }))
  }, [])

  const removeLineItem = useCallback((id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const saveInvoice = useCallback((): Invoice | null => {
    if (!currentInvoice?.customerId || lineItems.length === 0) {
      return null
    }

    const totals = invoiceService.calculateTotals(lineItems)
    
    const invoice = invoiceService.create({
      customerId: currentInvoice.customerId,
      customerName: currentInvoice.customerName!,
      date: currentInvoice.date!,
      lineItems,
      ...totals,
      status: 'draft'
    })

    // Reset after saving
    setCurrentInvoice(null)
    setLineItems([])

    return invoice
  }, [currentInvoice, lineItems])

  const resetInvoice = useCallback(() => {
    setCurrentInvoice(null)
    setLineItems([])
  }, [])

  return (
    <InvoiceContext.Provider
      value={{
        currentInvoice,
        setCustomer,
        addLineItem,
        updateLineItem,
        removeLineItem,
        saveInvoice,
        resetInvoice,
        lineItems
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}
