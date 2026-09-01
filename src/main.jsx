import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { AdminProductsProvider } from './context/AdminProductsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AdminProductsProvider>
        <App />
      </AdminProductsProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
