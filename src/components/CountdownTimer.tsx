import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: string;
}

export const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg px-4 py-2">
      <Clock size={18} className="text-red-500" />
      <div className="flex gap-3 text-sm font-bold">
        <div className="flex flex-col items-center">
          <span className="text-red-500 text-lg">{timeLeft.days}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">Days</span>
        </div>
        <span className="text-red-500">:</span>
        <div className="flex flex-col items-center">
          <span className="text-red-500 text-lg">{timeLeft.hours}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">Hours</span>
        </div>
        <span className="text-red-500">:</span>
        <div className="flex flex-col items-center">
          <span className="text-red-500 text-lg">{timeLeft.minutes}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">Mins</span>
        </div>
        <span className="text-red-500">:</span>
        <div className="flex flex-col items-center">
          <span className="text-red-500 text-lg">{timeLeft.seconds}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">Secs</span>
        </div>
      </div>
    </div>
  );
};
