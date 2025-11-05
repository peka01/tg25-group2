export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
}

export interface InvoiceLineItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  date: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid'
}

export interface GuideStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
  }
}

export interface GuideConfig {
  name: string
  description: string
  category: string
  autoStartDefault: boolean
  steps: GuideStep[]
}
