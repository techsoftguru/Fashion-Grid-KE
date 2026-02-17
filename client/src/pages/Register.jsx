import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const { register } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    register(name, email, password, phone)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1">Phone (e.g., 0712345678)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700">Register</button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  )
}