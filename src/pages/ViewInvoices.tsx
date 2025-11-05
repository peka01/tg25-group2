import { invoiceService } from '../services/mockData'
import { Link } from 'react-router-dom'

const ViewInvoices = () => {
  const invoices = invoiceService.getAll()

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          All Invoices
        </h3>
        <p className="text-gray-600">View and manage all customer invoices</p>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</h4>
          <p className="text-gray-600 mb-6">Create your first invoice to get started</p>
          <Link
            to="/create-invoice"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Create Invoice
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Invoice #</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Subtotal</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tax</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-purple-600">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{invoice.customerName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{invoice.date}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{invoice.lineItems.length}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">${invoice.subtotal.toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">${invoice.tax.toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">${invoice.total.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {invoice.status === 'paid' ? 'PAID' : invoice.status === 'sent' ? 'SENT' : 'DRAFT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewInvoices
