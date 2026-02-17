import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/products'
import LoadingSpinner from '../../components/LoadingSpinner'
import { FaEdit, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', image: null })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const data = await getProducts({ limit: 100 })
    setProducts(data.products)
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (form[key] !== null) formData.append(key, form[key])
    })
    try {
      if (editing) {
        await updateProduct(editing.id, formData)
        toast.success('Product updated')
      } else {
        await createProduct(formData)
        toast.success('Product created')
      }
      setShowModal(false)
      setEditing(null)
      setForm({ name: '', description: '', price: '', category: '', stock: '', image: null })
      fetchProducts()
    } catch (err) {
      toast.error('Operation failed')
    }
  }

  const handleEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: null,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteProduct(id)
        toast.success('Product deleted')
        fetchProducts()
      } catch {
        toast.error('Delete failed')
      }
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', category: '', stock: '', image: null }); setShowModal(true) }} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Category</th>
            <th className="py-2 px-4 border">Stock</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="py-2 px-4 border">{p.id}</td>
              <td className="py-2 px-4 border"><img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover" /></td>
              <td className="py-2 px-4 border">{p.name}</td>
              <td className="py-2 px-4 border">{p.price}</td>
              <td className="py-2 px-4 border">{p.category}</td>
              <td className="py-2 px-4 border">{p.stock}</td>
              <td className="py-2 px-4 border">
                <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2"><FaEdit /></button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block">Name</label>
                <input name="name" value={form.name} onChange={handleInputChange} className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-2">
                <label className="block">Description</label>
                <textarea name="description" value={form.description} onChange={handleInputChange} className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-2">
                <label className="block">Price (KES)</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleInputChange} className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-2">
                <label className="block">Category</label>
                <select name="category" value={form.category} onChange={handleInputChange} className="border p-2 rounded w-full" required>
                  <option value="">Select</option>
                  <option value="men-clothing">Men Clothing</option>
                  <option value="men-shoes">Men Shoes</option>
                  <option value="women-clothing">Women Clothing</option>
                  <option value="women-shoes">Women Shoes</option>
                  <option value="kids-clothing">Kids Clothing</option>
                  <option value="kids-shoes">Kids Shoes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block">Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleInputChange} className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-4">
                <label className="block">Image</label>
                <input type="file" onChange={handleFileChange} className="border p-2 rounded w-full" accept="image/*" required={!editing} />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}