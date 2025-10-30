import { useEffect, useState } from 'react';
import {
  ArrowRight, TrendingUp, Zap, Shield, Mail, Phone, MapPin, Send,
  CheckCircle, Users, Target, Sparkles, Star
} from 'lucide-react';
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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Thank you! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">

      {/* === HERO SECTION - FULL 100VH WITH FEATURE BOXES === */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto relative z-10 text-center flex-1 flex flex-col justify-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 leading-tight">
            <TypingText
              texts={[
                'Premium Digital Products',
                'Boost Your Business',
                'Transform Your Work',
                'Unlock Your Potential',
              ]}
            />
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover handcrafted digital tools trusted by <span className="font-bold text-indigo-600 dark:text-indigo-400">10,000+</span> entrepreneurs and creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onViewProducts}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center"
            >
              Explore Products
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <a href="googel"></a>
            <button className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all">
              Watch Demo
            </button>
          </div>

          {/* === FEATURE BOXES INSIDE HERO === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
            {[
              { icon: Zap, title: 'Instant Delivery', desc: 'Get your digital products immediately after purchase', color: 'indigo' },
              { icon: Shield, title: 'Money-Back Guarantee', desc: '30-day refund policy, no questions asked', color: 'emerald' },
              { icon: TrendingUp, title: 'Premium Quality', desc: 'Handpicked products for maximum value', color: 'purple' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`text-${feature.color}-600 dark:text-${feature.color}-400`} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURED PRODUCTS === */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Featured Products
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Limited-time deals – don’t miss out!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={product.image || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Rating rating={product.rating} size={16} readonly />
                    <span className="text-sm text-slate-500 dark:text-slate-400">({product.reviews})</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">PKR {product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-slate-500 line-through ml-2">PKR {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <ArrowRight className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onViewProducts}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* === WHY CHOOSE US === */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Why Choose Us?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We don’t just sell products — we deliver <span className="font-bold text-indigo-600 dark:text-indigo-400">real growth</span>.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Built for Real Results</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every tool is battle-tested by top creators. No fluff. No filler. Just proven systems that scale your business.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: CheckCircle, label: 'Expert-Vetted', color: 'emerald' },
                  { icon: Users, label: '10K+ Users', color: 'indigo' },
                  { icon: Target, label: 'ROI-Focused', color: 'purple' },
                  { icon: Sparkles, label: 'Lifetime Updates', color: 'pink' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <div className={`w-10 h-10 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`text-${item.color}-600 dark:text-${item.color}-400`} size={20} />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold mb-8 text-center text-slate-900 dark:text-white">Trusted by Thousands</h3>
                <div className="space-y-6">
                  {[
                    { value: '98%', label: 'Customer Satisfaction', color: 'indigo' },
                    { value: '4.9', label: 'Average Rating', color: 'purple', suffix: <Star className="inline ml-1" size={16} /> },
                    { value: '24/7', label: 'Support Available', color: 'emerald' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                      <span className={`text-4xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                        {stat.value} {stat.suffix}
                      </span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Join <span className="font-bold text-indigo-600 dark:text-indigo-400">10,000+</span> happy customers today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Loved by Creators
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">Real results from real users</p>
          <TestimonialsSlider />
        </div>
      </section>

      {/* === CONTACT === */}
      <section id="contact" className="py-24 px-4 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Get in Touch
            </h2>
            <p className="text-slate-600 dark:text-slate-400">We’re here to help you succeed</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <Mail className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-slate-600 dark:text-slate-400">support@yourbrand.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Phone className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-slate-600 dark:text-slate-400">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <MapPin className="text-emerald-600 dark:text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-slate-600 dark:text-slate-400">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">Got questions? We’ve got answers.</p>
          <FAQAccordion />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">YourBrand</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Premium digital products to help you grow faster, work smarter, and achieve more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {['Products', 'About', 'Contact', 'FAQ'].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'License'].map(item => (
                  <li key={item}>
                    <a href="#" className="hover:text-indigo-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map(social => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                  >
                    <span className="text-xs font-bold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} YourBrand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};