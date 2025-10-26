import { useEffect, useState } from 'react';
import { Product, Coupon, CartItem } from '../types/product';
import { Rating } from '../components/Rating';
import { CountdownTimer } from '../components/CountdownTimer';
import { ShareButtons } from '../components/ShareButtons';
import { Modal } from '../components/Modal';
import { ScratchCard } from '../components/ScratchCard';
import { Confetti } from '../components/Confetti';
import { ArrowLeft, Check, Copy, MessageCircle, ShoppingCart, Home } from 'lucide-react';
import { getRating, saveRating, addToCart, getCart } from '../utils/localStorage';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

const COUPONS: Coupon[] = [
  { code: 'AHSANLABSMEGA', discount: 15, type: 'percentage' },
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'MEGA30', discount: 30, type: 'percentage' },
];

export const ProductDetailPage = ({ productId, onBack }: ProductDetailPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    fetch('/products.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data: Product[]) => {
        const found = data.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
          setFinalPrice(found.price);
          setUserRating(getRating(productId));
          if (found.price === 0) {
            setDownloadLink(found.productlink);
          }
        } else {
          setError(`Product with ID ${productId} not found`);
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load product data. Please try again later.');
      });
  }, [productId]);

  const applyCoupon = () => {
    setCouponError('');
    setDiscountMessage('');
    let coupon = COUPONS.find((c) => c.code.toLowerCase() === couponCode.toLowerCase());

    // Check for special code
    if (!coupon && product?.specialcode?.toLowerCase() === couponCode.toLowerCase() && product.specialdisc) {
      coupon = { code: product.specialcode, discount: product.specialdisc, type: 'percentage' };
    }

    // Check for scratch coupon
    if (
      !coupon &&
      product?.is_scratch &&
      product?.scratch_coupon &&
      couponCode.toLowerCase() === product.scratch_coupon.toLowerCase() &&
      product.scratch_disc
    ) {
      coupon = { code: product.scratch_coupon, discount: product.scratch_disc, type: 'percentage' };
    }

    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (appliedCoupon) {
      setCouponError('Coupon already applied');
      return;
    }

    setAppliedCoupon(coupon);
    const discount = coupon.type === 'percentage' ? (product!.price * coupon.discount) / 100 : coupon.discount;
    const newFinalPrice = product!.price - discount;
    setFinalPrice(newFinalPrice);

    if (coupon.discount === 100) {
      setDownloadLink(`${product!.productlink}`);
      setDiscountMessage(
        `Congratulations! You've applied a 100% discount with code ${coupon.code} for ${product!.name}.`
      );
    } else {
      setDownloadLink('');
      const isSpecialCode = product?.specialcode?.toLowerCase() === coupon.code.toLowerCase();
      const isScratchCoupon = product?.scratch_coupon?.toLowerCase() === coupon.code.toLowerCase();
      setDiscountMessage(
        `Congratulations! You've got a ${coupon.discount}% discount with ${
          isSpecialCode ? 'special code' : isScratchCoupon ? 'scratch coupon' : 'coupon'
        } ${coupon.code}. Original price: PKR ${product!.originalPrice.toFixed(
          2
        )}, Final price: PKR ${newFinalPrice.toFixed(2)}. I want to buy ${product!.name}!`
      );
    }

    setShowConfetti(true);
  };

  const handleBuyNow = () => {
    if (!product) return;

    let message = '';
    if (appliedCoupon && appliedCoupon.discount < 100) {
      message = `Hi! ${discountMessage}`;
    } else if (appliedCoupon && appliedCoupon.discount === 100) {
      message = `Hi! I applied a 100% discount coupon (${appliedCoupon.code}) for ${product.name} and received the download link.`;
    } else {
      message = `${product.whatsappMessage} (Price: PKR ${product.price.toFixed(2)})`;
    }
    const whatsappNumber = '923343926359';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyDownloadLink = () => {
    navigator.clipboard.writeText(downloadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRate = (rating: number) => {
    setUserRating(rating);
    saveRating(productId, rating);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: 1,
    };

    addToCart(cartItem);
    // Trigger cart update event for header
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: getCart().length }));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <p className="text-red-500 text-lg text-center">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div
              className="relative w-full aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setShowPreview(true)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.classList.remove('hidden');
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl sm:text-9xl font-bold opacity-20 hidden">
                {product.name[0]}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  Click to preview
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 border border-gray-200 dark:border-gray-700 sticky top-16">
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {product.category}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <Rating rating={product.rating} size={20} readonly />
                <span className="text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>

              <div className="mb-6">
                <CountdownTimer endDate={product.offerEndsAt} />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6 mb-6">
                <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    PKR {appliedCoupon ? finalPrice.toFixed(2) : product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">PKR {product.originalPrice}</span>
                  )}
                  {appliedCoupon && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {appliedCoupon.discount}% OFF
                    </span>
                  )}
                </div>

                {discountMessage && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">{discountMessage}</p>
                  </div>
                )}

                {!appliedCoupon && product.price !== 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                    {product.is_scratch && (
                      <button
                        onClick={() => setShowScratchCard(true)}
                        className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Reveal Secret Discount
                      </button>
                    )}
                  </div>
                )}

                {downloadLink && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Download Link:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={downloadLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      />
                      <button
                        onClick={copyDownloadLink}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {product.price !== 0 && (
                <div className="flex gap-3 mb-4">
                  {(!appliedCoupon || (appliedCoupon && appliedCoupon.discount < 100)) && (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
                    >
                      <ShoppingCart size={24} />
                      Add to Cart
                    </button>
                  )}

                  {!downloadLink && appliedCoupon && appliedCoupon.discount === 100 && (
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
                    >
                      <MessageCircle size={24} />
                      Get Free Download
                    </button>
                  )}

                  {!downloadLink && (!appliedCoupon || (appliedCoupon && appliedCoupon.discount < 100)) && (
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
                    >
                      <MessageCircle size={24} />
                      Buy Now
                    </button>
                  )}
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rate this product:</p>
                <Rating rating={userRating} size={28} onRate={handleRate} />
              </div>

              <ShareButtons url={window.location.href} title={product.name} />
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showScratchCard} onClose={() => setShowScratchCard(false)} title="Reveal Your Discount">
        <div className="flex flex-col items-center">
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Scratch the card below to reveal your exclusive discount!
          </p>
          <ScratchCard
            discount={product.scratch_disc}
            onComplete={() => {
              setTimeout(() => {
                setShowScratchCard(false);
                setCouponCode(product.scratch_coupon || `SCRATCH${product.scratch_disc}`);
                setCouponError('');
              }, 1000);
            }}
          />
        </div>
      </Modal>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Product Preview">
        <div className="h-64 sm:h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-6xl sm:text-9xl font-bold">
          {product.name[0]}
        </div>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          This is a preview of {product.name}
        </p>
      </Modal>
    </div>
  );
};