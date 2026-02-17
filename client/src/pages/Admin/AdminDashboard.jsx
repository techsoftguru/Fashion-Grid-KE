import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAnalytics } from '../../services/admin'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({})

  useEffect(() => {
    getAnalytics().then(setAnalytics)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl">{analytics.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl">KSh {(analytics.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed Payments</h3>
          <p className="text-3xl">{analytics.completedPayments || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/products" className="bg-blue-100 p-6 rounded-lg text-center hover:bg-blue-200">
          <h2 className="text-xl font-bold">Manage Products</h2>
        </Link>
        <Link to="/admin/orders" className="bg-green-100 p-6 rounded-lg text-center hover:bg-green-200">
          <h2 className="text-xl font-bold">Manage Orders</h2>
        </Link>
        <Link to="/admin/analytics" className="bg-purple-100 p-6 rounded-lg text-center hover:bg-purple-200">
          <h2 className="text-xl font-bold">Analytics</h2>
        </Link>
        <Link to="/admin/users" className="bg-yellow-100 p-6 rounded-lg text-center hover:bg-yellow-200">
          <h2 className="text-xl font-bold">Users</h2>
        </Link>
      </div>
    </div>
  )
}