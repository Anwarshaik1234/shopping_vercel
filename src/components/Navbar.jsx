import { ShoppingCart, User, LogOut, Package, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, cartItemCount, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ShopNova
            </span>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Cart Button */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
                >
                  <ShoppingCart className="w-6 h-6 text-slate-700 group-hover:text-primary-600 transition-colors" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-slow">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Orders Button */}
                <button
                  onClick={() => navigate('/orders')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
                >
                  <Package className="w-6 h-6 text-slate-700 group-hover:text-primary-600 transition-colors" />
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-accent-50 px-4 py-2 rounded-lg">
                    <User className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {user.username}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
