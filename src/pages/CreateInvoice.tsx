import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoice } from '../context/InvoiceContext'
import { useGuide } from '../context/GuideContext'
import { customerService, productService } from '../services/mockData'
import { Customer, Product } from '../types'

const CreateInvoice = () => {
  const navigate = useNavigate()
  const { 
    currentInvoice, 
    setCustomer, 
    addLineItem, 
    updateLineItem, 
    removeLineItem, 
    saveInvoice, 
    resetInvoice,
    lineItems 
  } = useInvoice()
  
  const { autoStartEnabled, startGuide } = useGuide()

  const [customers] = useState<Customer[]>(customerService.getAll())
  const [products] = useState<Product[]>(productService.getAll())
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  // Auto-start guide on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('invoiceGuideCompleted')
    if (autoStartEnabled && !hasVisited) {
      // Delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startGuide('invoice-creation')
        localStorage.setItem('invoiceGuideCompleted', 'true')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoStartEnabled, startGuide])

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId)
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setCustomer(customer)
    }
  }

  const handleAddLineItem = () => {
    if (!selectedProductId || quantity < 1) return
    
    const product = products.find(p => p.id === selectedProductId)
    if (!product) return

    addLineItem({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price
    })

    // Reset form
    setSelectedProductId('')
    setQuantity(1)
  }

  const handleSaveInvoice = () => {
    const invoice = saveInvoice()
    if (invoice) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/invoices')
      }, 2000)
    } else {
      alert('Please select a customer and add at least one line item')
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      resetInvoice()
      setSelectedCustomerId('')
      setSelectedProductId('')
      setQuantity(1)
    }
  }

  const totals = lineItems.reduce((acc, item) => {
    acc.subtotal += item.total
    return acc
  }, { subtotal: 0 })
  
  const tax = totals.subtotal * 0.1
  const total = totals.subtotal + tax

  return (
    <div className="max-w-6xl mx-auto">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span className="font-medium">Invoice Created!</span>
          </div>
        </div>
      )}

      {/* Customer Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Select Customer</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer *
          </label>
          <select
            data-guide-step="customer-select"
            value={selectedCustomerId}
            onChange={(e) => handleCustomerSelect(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          >
            <option value="">Select a customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
          
          {currentInvoice?.customerId && (
            <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Selected:</strong> {currentInvoice.customerName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Add Line Items</h3>
        
        {/* Add Item Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product/Service *
            </label>
            <select
              data-guide-step="product-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              data-guide-step="quantity-input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="flex items-end">
            <button
              data-guide-step="add-line-item"
              onClick={handleAddLineItem}
              disabled={!selectedProductId || !currentInvoice?.customerId}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              + Add Line Item
            </button>
          </div>
        </div>

        {/* Line Items Table */}
        {lineItems.length > 0 ? (
          <div data-guide-step="line-items-table" className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.productName}</td>
                    <td className="py-3 px-4 text-sm">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No line items added yet. Add your first item above.</p>
          </div>
        )}
      </div>

      {/* Invoice Preview */}
      {lineItems.length > 0 && currentInvoice?.customerId && (
        <div data-guide-step="invoice-preview" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Preview Invoice</h3>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
              <span className="text-gray-900">Total:</span>
              <span className="text-purple-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          data-guide-step="save-invoice"
          onClick={handleSaveInvoice}
          disabled={!currentInvoice?.customerId || lineItems.length === 0}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Save Invoice
        </button>
      </div>
    </div>
  )
}

export default CreateInvoice
