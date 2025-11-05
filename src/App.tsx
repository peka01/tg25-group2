import { BrowserRouter } from 'react-router-dom'
import { GuideProvider } from './context/GuideContext'
import { InvoiceProvider } from './context/InvoiceContext'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <GuideProvider>
        <InvoiceProvider>
          <Layout />
        </InvoiceProvider>
      </GuideProvider>
    </BrowserRouter>
  )
}

export default App
