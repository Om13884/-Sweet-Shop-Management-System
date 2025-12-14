import { useState, useEffect } from 'react';
import { sweetService } from '../services/sweet.service';
import { Sweet } from '../types';
import { getSweetImage } from '../utils/imageMapper';

const AdminPanel = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [restocking, setRestocking] = useState<string | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAll();
      setSweets(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSweet) {
        await sweetService.update(editingSweet.id, {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
      } else {
        await sweetService.create({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity) || 0,
        });
      }
      resetForm();
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetService.delete(id);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleRestock = async (id: string) => {
    const quantity = parseInt(restockQuantity[id] || '0');
    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    try {
      setRestocking(id);
      await sweetService.restock(id, quantity);
      setRestockQuantity({ ...restockQuantity, [id]: '' });
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Restock failed');
    } finally {
      setRestocking(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', quantity: '' });
    setEditingSweet(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Add New Sweet'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                required
                min="0"
                className="border border-gray-300 rounded-md px-3 py-2"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                required
                min="0"
                className="border border-gray-300 rounded-md px-3 py-2"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingSweet ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading sweets...</p>
        </div>
      ) : (
        /* Sweets Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sweets.map((sweet) => (
                <tr key={sweet.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={getSweetImage(sweet.name)}
                      alt={sweet.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = '/menu-images/barfi.avif';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sweet.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sweet.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${sweet.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sweet.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(sweet)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sweet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <div className="inline-flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                        value={restockQuantity[sweet.id] || ''}
                        onChange={(e) =>
                          setRestockQuantity({ ...restockQuantity, [sweet.id]: e.target.value })
                        }
                      />
                      <button
                        onClick={() => handleRestock(sweet.id)}
                        disabled={restocking === sweet.id}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        {restocking === sweet.id ? 'Restocking...' : 'Restock'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

