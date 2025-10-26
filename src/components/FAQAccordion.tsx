import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I purchase a product?',
    answer: 'Click on any product, review the details, and click the "Buy Now" button. You will be redirected to WhatsApp to complete your purchase with our support team.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods. Our support team will guide you through the payment process via WhatsApp.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all digital products. If you are not satisfied, contact us for a full refund.',
  },
  {
    question: 'How do I apply a coupon code?',
    answer: 'On the product page, look for the coupon code section. Enter your code and the discount will be applied automatically.',
  },
  {
    question: 'How quickly will I receive my digital product?',
    answer: 'Digital products are delivered instantly after payment confirmation. You will receive download links via WhatsApp or email.',
  },
  {
    question: 'Can I get support after purchase?',
    answer: 'Absolutely! We provide 24/7 customer support via WhatsApp. Just click the floating WhatsApp button to reach us anytime.',
  },
];

export const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <p className="p-4 pt-0 text-gray-600 dark:text-gray-400">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
