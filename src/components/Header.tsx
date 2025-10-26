import { Moon, Sun, ShoppingCart, GitCompare, Eye, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import { getCart, getComparisonList, getVisitorCount, incrementVisitorCount } from '../utils/localStorage';

interface HeaderProps {
  onCartClick?: () => void;
  onCompareClick?: () => void;
}

export const Header = ({ onCartClick, onCompareClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCartCount(getCart().length);
    setCompareCount(getComparisonList().length);
    setVisitorCount(incrementVisitorCount());

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleComparisonUpdate = (e: CustomEvent) => {
      setCompareCount(e.detail);
    };

    const handleCartUpdate = (e: CustomEvent) => {
      setCartCount(e.detail);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('comparisonUpdated', handleComparisonUpdate as EventListener);
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('comparisonUpdated', handleComparisonUpdate as EventListener);
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              AhsanLabs - DigitalStore
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <Eye size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {visitorCount.toLocaleString()} visitors
              </span>
            </div>

            {onCompareClick && (
              <button
                onClick={onCompareClick}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <GitCompare size={24} className="text-gray-700 dark:text-gray-300" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {compareCount}
                  </span>
                )}
              </button>
            )}

            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ShoppingCart size={24} className="text-gray-700 dark:text-gray-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={24} className="text-gray-700" />
              ) : (
                <Sun size={24} className="text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
