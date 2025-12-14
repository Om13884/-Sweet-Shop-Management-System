import { useState, useEffect } from 'react';
import { sweetService } from '../services/sweet.service';
import { Sweet, SearchFilters } from '../types';
import { getSweetImage } from '../utils/imageMapper';

const Dashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadSweets();
  }, [filters]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAll(filters);
      setSweets(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id: string) => {
    try {
      setPurchasing(id);
      await sweetService.purchase(id, 1);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sweet Shop Dashboard</h1>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-300 rounded-md px-3 py-2"
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by category"
            className="border border-gray-300 rounded-md px-3 py-2"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
          <input
            type="number"
            placeholder="Min price"
            className="border border-gray-300 rounded-md px-3 py-2"
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max price"
            className="border border-gray-300 rounded-md px-3 py-2"
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

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
        /* Sweets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No sweets found
            </div>
          ) : (
            sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={getSweetImage(sweet.name)}
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = '/menu-images/barfi.avif';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{sweet.name}</h3>
                  <p className="text-gray-600 mb-2">Category: {sweet.category}</p>
                  <p className="text-2xl font-bold text-purple-600 mb-2">
                    ${sweet.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Quantity: <span className="font-semibold">{sweet.quantity}</span>
                  </p>
                  <button
                    onClick={() => handlePurchase(sweet.id)}
                    disabled={sweet.quantity === 0 || purchasing === sweet.id}
                    className={`w-full py-2 px-4 rounded font-semibold ${
                      sweet.quantity === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {purchasing === sweet.id
                      ? 'Purchasing...'
                      : sweet.quantity === 0
                      ? 'Out of Stock'
                      : 'Purchase'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

