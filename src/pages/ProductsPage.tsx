import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { Rating } from '../components/Rating';
import { Filter, GitCompare, Search, X, Home } from 'lucide-react';
import { addToComparison, getComparisonList } from '../utils/localStorage';

interface ProductsPageProps {
  onProductClick: (productId: string) => void;
}

export const ProductsPage = ({ onProductClick }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query

  useEffect(() => {
    fetch('/products.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });

    setComparisonList(getComparisonList());

    const handleComparisonUpdate = (e: CustomEvent) => {
      setComparisonList(e.detail === 0 ? [] : getComparisonList());
    };

    window.addEventListener('comparisonUpdated', handleComparisonUpdate as EventListener);

    return () => {
      window.removeEventListener('comparisonUpdated', handleComparisonUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const handleAddToComparison = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentList = getComparisonList();
    if (currentList.includes(productId)) {
      // Remove from comparison
      const updatedList = currentList.filter((id) => id !== productId);
      localStorage.setItem('digital_store_comparison', JSON.stringify(updatedList));
      setComparisonList(updatedList);
      window.dispatchEvent(new CustomEvent('comparisonUpdated', { detail: updatedList.length }));
    } else {
      // Add to comparison
      addToComparison(productId);
      const updatedList = getComparisonList();
      setComparisonList(updatedList);
      window.dispatchEvent(new CustomEvent('comparisonUpdated', { detail: updatedList.length }));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Home size={20} />
              <span>Home</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">All Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse our complete collection of digital products</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-4 py-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter size={20} />
            <span className="font-semibold">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isInComparison = comparisonList.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => onProductClick(product.id)}
              >
                <div className="relative w-full aspect-[4/3] max-h-[200px] bg-white dark:bg-gray-700 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20 hidden">
                    {product.name[0]}
                  </div>

                  <button
                    onClick={(e) => handleAddToComparison(product.id, e)}
                    disabled={!isInComparison && comparisonList.length >= 4}
                    className={`absolute top-3 left-3 p-2 rounded-lg transition-all ${
                      isInComparison
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/90 hover:bg-white text-gray-700'
                    }`}
                    title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    <GitCompare size={18} />
                  </button>

                  {product.originalPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {product.category}
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Rating rating={product.rating} size={16} readonly />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">PKR {product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">PKR {product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : 'No products found in this category'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};