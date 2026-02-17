import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../services/products'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    getProduct(id).then(data => {
      setProduct(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!product) return <div>Product not found</div>

  const handleAdd = () => {
    addToCart({ ...product, quantity: 1 })
    toast.success('Added to cart')
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-blue-600 mb-4">KSh {product.price.toLocaleString()}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="mb-2">Category: {product.category}</p>
        <p className="mb-4">Stock: {product.stock > 0 ? product.stock : 'Out of stock'}</p>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}