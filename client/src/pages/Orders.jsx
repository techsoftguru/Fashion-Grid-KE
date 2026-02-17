import { useEffect, useState } from 'react'
import { getMyOrders } from '../services/orders'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders().then(data => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/products" className="text-blue-600">Start shopping</Link></p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order #{order.id}</span>
                <span className={`px-2 py-1 text-sm rounded ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: KSh {order.totalAmount}</p>
              <p>Delivery: {order.deliveryZone.name}</p>
              <p>Status: {order.orderStatus}</p>
              <Link to={`/orders/${order.id}`} className="text-blue-600 mt-2 inline-block">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}