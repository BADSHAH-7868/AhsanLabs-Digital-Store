import { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Zap, Shield } from 'lucide-react';
import { Product } from '../types/product';
import { Rating } from '../components/Rating';
import { TypingText } from '../components/TypingText';
import { TestimonialsSlider } from '../components/TestimonialsSlider';
import { FAQAccordion } from '../components/FAQAccordion';

interface LandingPageProps {
  onProductClick: (productId: string) => void;
  onViewProducts: () => void;
}

export const LandingPage = ({ onProductClick, onViewProducts }: LandingPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              <TypingText
                texts={[
                  'Premium Digital Products',
                  'Boost Your Business',
                  'Transform Your Work',
                  'Unlock Your Potential',
                ]}
              />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover high-quality digital products designed to elevate your business and accelerate your success.
            </p>
            <button
              onClick={onViewProducts}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 mb-8"
            >
              Explore Products
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Instant Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Get your digital products immediately after purchase</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Money-Back Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400">30-day refund policy, no questions asked</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">Handpicked products for maximum value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-400">Limited time offers - grab them before they're gone!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => onProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={product.image || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Rating rating={product.rating} size={16} readonly />
                    <span className="text-sm text-gray-600 dark:text-gray-400">({product.reviews})</span>
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
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onViewProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">Join thousands of satisfied customers</p>
          <TestimonialsSlider />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">Everything you need to know</p>
          <FAQAccordion />
        </div>
      </section>
    </div>
  );
};