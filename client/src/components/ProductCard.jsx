import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 })
    toast.success('Added to cart')
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-2">KSh {product.price.toLocaleString()}</p>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}