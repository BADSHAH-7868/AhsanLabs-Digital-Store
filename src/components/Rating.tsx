import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export const Rating = ({ rating, maxRating = 5, size = 20, onRate, readonly = false }: RatingProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isPartial = !isFilled && starValue - 0.5 <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readonly && onRate && onRate(starValue)}
            disabled={readonly}
            className={`relative transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : isPartial
                  ? 'fill-yellow-400 text-yellow-400 opacity-50'
                  : 'fill-none text-gray-400 dark:text-gray-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
