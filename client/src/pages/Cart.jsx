import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-grow ml-4">
                <Link to={`/products/${item.id}`} className="font-semibold">{item.name}</Link>
                <p className="text-gray-600">KSh {item.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="border px-2 py-1"
                  >-</button>
                  <span className="mx-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="border px-2 py-1"
                  >+</button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">KSh {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border p-4 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>KSh {cartTotal.toLocaleString()}</span>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>KSh {cartTotal.toLocaleString()}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block bg-blue-600 text-white text-center py-3 rounded-lg mt-6 hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}