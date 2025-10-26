import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber: string;
  message?: string;
}

export const FloatingWhatsApp = ({ phoneNumber, message = 'Hi! I need help' }: FloatingWhatsAppProps) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-40 animate-bounce-slow"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
};
