import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { useAuth } from './hooks/useAuth';
import api from './utils/api';

function App() {
  const { user, loading, login, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    } else {
      // Clear cart count when user logs out
      setCartItemCount(0);
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/carts');
      const count = response.data.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      setCartItemCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      // Don't show error to user, just log it
      setCartItemCount(0);
    }
  };

  const handleLogout = async () => {
    // Clear cart count immediately for better UX
    setCartItemCount(0);
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium text-lg">Loading ShopNova...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        {user && (
          <Navbar 
            user={user} 
            cartItemCount={cartItemCount} 
            onLogout={handleLogout}
          />
        )}
        
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Login onLogin={login} />
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <Home onCartUpdate={fetchCartCount} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/cart"
            element={
              user ? (
                <Cart onCartUpdate={fetchCartCount} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/orders"
            element={
              user ? <Orders /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;