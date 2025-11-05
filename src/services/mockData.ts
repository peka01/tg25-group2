import { Customer, Product, Invoice, InvoiceLineItem } from '../types'

// Mock data storage
let customers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 555-0100',
    address: '123 Business St, New York, NY 10001'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'info@techstart.com',
    phone: '+1 555-0200',
    address: '456 Innovation Ave, San Francisco, CA 94102'
  },
  {
    id: '3',
    name: 'Global Solutions Ltd',
    email: 'hello@globalsolutions.com',
    phone: '+1 555-0300',
    address: '789 Enterprise Blvd, Chicago, IL 60601'
  }
]

let products: Product[] = [
  {
    id: '1',
    name: 'Professional Service - Hourly',
    description: 'Professional consulting services billed hourly',
    price: 150.00
  },
  {
    id: '2',
    name: 'Software License - Annual',
    description: 'Annual software license subscription',
    price: 1200.00
  },
  {
    id: '3',
    name: 'Training Session',
    description: 'On-site or virtual training session',
    price: 500.00
  },
  {
    id: '4',
    name: 'Support Package - Premium',
    description: 'Premium support package with 24/7 availability',
    price: 2500.00
  },
  {
    id: '5',
    name: 'Custom Development',
    description: 'Custom software development per project',
    price: 5000.00
  }
]

let invoices: Invoice[] = []

// Customer operations
export const customerService = {
  getAll: (): Customer[] => customers,
  
  getById: (id: string): Customer | undefined => 
    customers.find(c => c.id === id),
  
  create: (customer: Omit<Customer, 'id'>): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString()
    }
    customers.push(newCustomer)
    return newCustomer
  },
  
  update: (id: string, updates: Partial<Customer>): Customer | undefined => {
    const index = customers.findIndex(c => c.id === id)
    if (index === -1) return undefined
    customers[index] = { ...customers[index], ...updates }
    return customers[index]
  },
  
  delete: (id: string): boolean => {
    const index = customers.findIndex(c => c.id === id)
    if (index === -1) return false
    customers.splice(index, 1)
    return true
  }
}

// Product operations
export const productService = {
  getAll: (): Product[] => products,
  
  getById: (id: string): Product | undefined => 
    products.find(p => p.id === id),
  
  search: (query: string): Product[] => {
    const lowerQuery = query.toLowerCase()
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    )
  }
}

// Invoice operations
export const invoiceService = {
  getAll: (): Invoice[] => invoices,
  
  getById: (id: string): Invoice | undefined => 
    invoices.find(i => i.id === id),
  
  create: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(5, '0')}`
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber
    }
    invoices.push(newInvoice)
    return newInvoice
  },
  
  update: (id: string, updates: Partial<Invoice>): Invoice | undefined => {
    const index = invoices.findIndex(i => i.id === id)
    if (index === -1) return undefined
    invoices[index] = { ...invoices[index], ...updates }
    return invoices[index]
  },
  
  delete: (id: string): boolean => {
    const index = invoices.findIndex(i => i.id === id)
    if (index === -1) return false
    invoices.splice(index, 1)
    return true
  },
  
  calculateTotals: (lineItems: InvoiceLineItem[]): { subtotal: number, tax: number, total: number } => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }
}
