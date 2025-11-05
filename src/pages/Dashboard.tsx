import { Link } from 'react-router-dom'
import { useGuide } from '../context/GuideContext'
import { invoiceService, customerService } from '../services/mockData'

const Dashboard = () => {
  const { autoStartEnabled } = useGuide()
  const invoices = invoiceService.getAll()
  const customers = customerService.getAll()

  const stats = [
    { label: 'Total Invoices', value: invoices.length, icon: '📄', color: '#E94B6C' },
    { label: 'Total Customers', value: customers.length, icon: '👥', color: '#6B1B9A' },
    { label: 'Paid Invoices', value: invoices.filter(i => i.status === 'paid').length, icon: '✅', color: '#4CAF50' },
    { label: 'Draft Invoices', value: invoices.filter(i => i.status === 'draft').length, icon: '📝', color: '#FF9800' }
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Overview
        </h3>
        <p className="text-gray-600">
          {autoStartEnabled 
            ? 'Guides are enabled. Navigate to Create Invoice to start the guided tour.'
            : 'Guides are disabled. Enable them in Settings to get help.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: stat.color + '20' }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/create-invoice"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-medium text-gray-900">Create Invoice</p>
              <p className="text-sm text-gray-500">Start a new invoice</p>
            </div>
          </Link>
          
          <Link
            to="/invoices"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-medium text-gray-900">View Invoices</p>
              <p className="text-sm text-gray-500">See all invoices</p>
            </div>
          </Link>
          
          <Link
            to="/settings"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-500">Configure guides</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Invoices */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice #</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-purple-600">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{invoice.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">${invoice.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {invoice.status === 'paid' ? 'Paid' : invoice.status === 'sent' ? 'Sent' : 'Draft'}
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

export default Dashboard
