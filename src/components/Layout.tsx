import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useGuide } from '../context/GuideContext'
import Dashboard from '../pages/Dashboard'
import CreateInvoice from '../pages/CreateInvoice'
import ViewInvoices from '../pages/ViewInvoices'
import Settings from '../pages/Settings'

const Layout = () => {
  const location = useLocation()
  const { startGuide, stopGuide, isGuideActive } = useGuide()

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Create Invoice', path: '/create-invoice', icon: '📝' },
    { name: 'View Invoices', path: '/invoices', icon: '📄' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ]

  const handleStartGuide = () => {
    if (location.pathname === '/create-invoice') {
      startGuide('invoice-creation')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - White with Purple Active State */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="px-8 py-4 bg-[#6B1B9A] flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white">
            Spiris
          </h1>
          <p className="text-sm text-purple-200 mt-1">ERP System</p>
        </div>
        
        <nav className="mt-2 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2.5 rounded-md mb-1 text-sm font-medium ${
                  isActive 
                    ? 'bg-[#6B1B9A] text-white' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-[#6B1B9A]'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Purple */}
        <header className="bg-[#6B1B9A] border-b border-purple-800">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-xl font-semibold text-white">
              {navigation.find(nav => nav.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            
            <div className="flex items-center gap-4">
              {location.pathname === '/create-invoice' && (
                <button
                  onClick={isGuideActive ? stopGuide : handleStartGuide}
                  data-guide-step="welcome"
                  className={`px-5 py-2 rounded-md text-sm font-medium ${
                    isGuideActive
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-[#6B1B9A]'
                  }`}
                >
                  {isGuideActive ? '⏹ Stop Guide' : '🎯 Start Guide'}
                </button>
              )}
              
              <div className="flex items-center gap-3 px-3 py-2 bg-purple-800 rounded-md">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#6B1B9A] font-medium text-sm">
                  A
                </div>
                <span className="text-sm font-medium text-white">User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoices" element={<ViewInvoices />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Layout
