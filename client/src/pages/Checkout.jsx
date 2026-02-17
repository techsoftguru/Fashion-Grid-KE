import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/orders'
import { stkPush } from '../services/mpesa'
import { getDeliveryZones } from '../services/deliveryZones'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeliveryZoneSelector from '../components/DeliveryZoneSelector'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState('')
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [phone, setPhone] = useState(user?.phone || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDeliveryZones().then(data => setZones(data))
  }, [])

  useEffect(() => {
    const zone = zones.find(z => z.id === selectedZone)
    setDeliveryPrice(zone ? zone.price : 0)
  }, [selectedZone, zones])

  const total = cartTotal + deliveryPrice

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to continue')
      return navigate('/login')
    }
    if (!selectedZone) {
      toast.error('Select delivery zone')
      return
    }
    setLoading(true)
    try {
      // Create order first
      const orderData = {
        deliveryZoneId: selectedZone,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      }
      const order = await createOrder(orderData)
      // Initiate M-Pesa payment
      const mpesaRes = await stkPush(phone, total, order.id)
      toast.success('STK Push sent. Check your phone to complete payment.')
      // Wait a bit then redirect to orders page
      setTimeout(() => {
        clearCart()
        navigate('/orders')
      }, 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="border p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Delivery Details</h2>
          <DeliveryZoneSelector selectedZone={selectedZone} onChange={setSelectedZone} />
        </div>

        <div className="border p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Payment Details (M-Pesa)</h2>
          <label className="block mb-2">Phone Number (e.g., 0712345678)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border p-2 rounded w-full"
            placeholder="0712345678"
          />
        </div>

        <div className="border p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>KSh {cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>KSh {deliveryPrice.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>KSh {total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || cart.length === 0}
          className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay with M-Pesa'}
        </button>
      </form>
    </div>
  )
}