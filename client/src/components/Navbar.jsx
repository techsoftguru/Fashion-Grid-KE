import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FaShoppingCart, FaUser } from 'react-icons/fa'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">Fashion Grid KE</Link>
          <div className="flex space-x-6 items-center">
            <Link to="/products" className="hover:text-gray-300">Products</Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                )}
                <Link to="/orders" className="hover:text-gray-300">Orders</Link>
                <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
                <Link to="/cart" className="relative">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <span>{user.name}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
                <Link to="/cart" className="relative">
                  <FaShoppingCart size={20} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}