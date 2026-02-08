import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowLeft, PartyPopper } from 'lucide-react';
import api from '../utils/api';

const Cart = ({ onCartUpdate }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/carts');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await api.put(`/carts/${itemId}`, { quantity: newQuantity });
      await fetchCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await api.delete(`/carts/${itemId}`);
      await fetchCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      await api.post('/orders');
      navigate('/orders?success=true');
      onCartUpdate();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const cartItems = cart?.cart?.items || [];
  const total = parseFloat(cart?.total || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-3 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Shopping Cart</h1>
              <p className="text-slate-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-slate-700 mb-3">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Add some amazing products to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem._id}
                  className="card p-6 flex gap-6 animate-fade-in hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {cartItem.item.name}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {cartItem.item.description}
                        </p>
                        <span className="badge bg-primary-100 text-primary-700 mt-2 inline-block">
                          {cartItem.item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(cartItem.item._id)}
                        disabled={updating[cartItem.item._id]}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                          disabled={cartItem.quantity <= 1 || updating[cartItem.item._id]}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                          disabled={updating[cartItem.item._id]}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                          ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500">
                          ${cartItem.item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-slate-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-slate-800">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        ${(total * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={checkout}
                  disabled={checkingOut}
                  className="w-full btn-accent flex items-center justify-center gap-2"
                >
                  {checkingOut ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <PartyPopper className="w-5 h-5" />
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium text-center">
                    🎉 Free shipping on all orders!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
