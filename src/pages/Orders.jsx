import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package, Calendar, DollarSign, CheckCircle, Clock, Truck, ArrowLeft, PartyPopper } from 'lucide-react';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl animate-slide-up">
            <div className="flex items-center gap-4">
              <PartyPopper className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold mb-1">Order Placed Successfully!</h3>
                <p className="text-green-50">Thank you for your purchase. Your order is being processed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-3 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Order History</h1>
              <p className="text-slate-600">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-slate-700 mb-3">No orders yet</h2>
            <p className="text-slate-500 mb-8">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="card p-6 hover:shadow-2xl animate-fade-in"
              >
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`badge border ${getStatusColor(order.status)} flex items-center gap-1.5`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 mb-1">Total Amount</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items ({order.items.length})
                  </h4>
                  {order.items.map((orderItem, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      {/* Item Image */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                        <img
                          src={orderItem.item.image}
                          alt={orderItem.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-800 mb-1">
                          {orderItem.item.name}
                        </h5>
                        <p className="text-sm text-slate-600 line-clamp-1 mb-2">
                          {orderItem.item.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-600">
                            Quantity: <span className="font-semibold">{orderItem.quantity}</span>
                          </span>
                          <span className="text-slate-600">
                            Price: <span className="font-semibold">${orderItem.price.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">
                          ${(orderItem.price * orderItem.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      {order.status === 'delivered' && (
                        <span className="text-green-600 font-medium">✓ Delivered</span>
                      )}
                      {order.status === 'shipped' && (
                        <span className="text-purple-600 font-medium">🚚 On the way</span>
                      )}
                      {order.status === 'processing' && (
                        <span className="text-blue-600 font-medium">⚙️ Processing</span>
                      )}
                      {order.status === 'pending' && (
                        <span className="text-yellow-600 font-medium">⏳ Pending</span>
                      )}
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
