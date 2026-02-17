import { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus } from '../../services/admin'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const data = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { orderStatus: newStatus })
      toast.success('Order status updated')
      fetchOrders()
    } catch {
      toast.error('Update failed')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Order ID</th>
            <th className="py-2 px-4 border">Customer</th>
            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">Payment</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="py-2 px-4 border">{order.id}</td>
              <td className="py-2 px-4 border">{order.user?.name} ({order.user?.email})</td>
              <td className="py-2 px-4 border">KSh {order.totalAmount}</td>
              <td className="py-2 px-4 border">{order.paymentStatus}</td>
              <td className="py-2 px-4 border">{order.orderStatus}</td>
              <td className="py-2 px-4 border">
                <select value={order.orderStatus} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="border p-1 rounded">
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}