import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, TrendingUp, Zap } from 'lucide-react';
import api from '../utils/api';

const Home = ({ onCartUpdate }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingToCart, setAddingToCart] = useState({});
  const [notification, setNotification] = useState(null);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'electronics', name: 'Electronics', icon: '⚡' },
    { id: 'fashion', name: 'Fashion', icon: '👔' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'beauty', name: 'Beauty', icon: '💄' }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedCategory]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const addToCart = async (itemId) => {
    setAddingToCart(prev => ({ ...prev, [itemId]: true }));
    try {
      await api.post('/carts', { itemId, quantity: 1 });
      showNotification('Added to cart successfully! 🎉');
      onCartUpdate();
    } catch (error) {
      showNotification('Failed to add to cart', 'error');
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl animate-slide-up ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-600'
        } text-white font-medium`}>
          {notification.message}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in flex items-center justify-center gap-3">
              <Zap className="w-12 h-12" />
              Discover Amazing Products
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-slide-up">
              Shop the latest trends with unbeatable prices
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative animate-slide-up">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-700">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 shadow border border-slate-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-primary-600">{filteredItems.length}</span> products
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item._id}
                className="card group hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-slate-100 aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.stock < 20 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="badge bg-primary-100 text-primary-700">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 h-10">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(item._id)}
                    disabled={addingToCart[item._id] || item.stock === 0}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    {addingToCart[item._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
