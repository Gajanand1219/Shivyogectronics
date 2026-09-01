import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AdminProductsContext = createContext(null)

async function apiRequest(method, body = {}) {
  const response = await fetch('/api/products', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export function AdminProductsProvider({ children }) {
  const [adminProducts, setAdminProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)

      const data = await apiRequest('GET')

      setAdminProducts(Array.isArray(data.products) ? data.products : [])
    } catch (error) {
      console.error('Failed to load products:', error)
      setAdminProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const addProduct = useCallback(async (product) => {
    const data = await apiRequest('POST', {
      action: 'add',
      product,
    })

    setAdminProducts(data.products || [])

    return data.product
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    const data = await apiRequest('POST', {
      action: 'update',
      id,
      updates,
    })

    setAdminProducts(data.products || [])
  }, [])

  const deleteProduct = useCallback(async (id) => {
    const data = await apiRequest('POST', {
      action: 'delete',
      id,
    })

    setAdminProducts(data.products || [])
  }, [])

  return (
    <AdminProductsContext.Provider
      value={{
        adminProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loading,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </AdminProductsContext.Provider>
  )
}

export function useAdminProducts() {
  const ctx = useContext(AdminProductsContext)

  if (!ctx) {
    throw new Error(
      'useAdminProducts must be used inside AdminProductsProvider'
    )
  }

  return ctx
}
