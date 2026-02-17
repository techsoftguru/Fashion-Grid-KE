import { useEffect, useState } from 'react'
import { getProducts } from '../services/products'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSearchParams } from 'react-router-dom'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    getProducts({ page, category, limit: 12 }).then(data => {
      setProducts(data.products)
      setTotalPages(data.pages)
      setLoading(false)
    })
  }, [page, category])

  const handleCategoryChange = (e) => {
    setSearchParams({ category: e.target.value, page: 1 })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Products</h1>
        <select onChange={handleCategoryChange} value={category} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="men-clothing">Men Clothing</option>
          <option value="men-shoes">Men Shoes</option>
          <option value="women-clothing">Women Clothing</option>
          <option value="women-shoes">Women Shoes</option>
          <option value="kids-clothing">Kids Clothing</option>
          <option value="kids-shoes">Kids Shoes</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setSearchParams({ category, page: p })}
              className={`px-4 py-2 border ${page === p ? 'bg-blue-600 text-white' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}