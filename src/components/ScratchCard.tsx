import { useRef, useState, useEffect } from 'react';

interface ScratchCardProps {
  onComplete: () => void;
  discount: number;
}

export const ScratchCard = ({ onComplete, discount }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match CSS or container
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 300 * dpr;
    canvas.height = 150 * dpr;
    canvas.style.width = '300px';
    canvas.style.height = '150px';

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text with better contrast
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${20 * dpr}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to Reveal!', canvas.width / 2, canvas.height / 2);

    // Ensure canvas is fully opaque
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isScratching) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    let x, y;

    if ('touches' in e) {
      e.preventDefault();
      x = (e.touches[0].clientX - rect.left) * dpr;
      y = (e.touches[0].clientY - rect.top) * dpr;
    } else {
      x = (e.clientX - rect.left) * dpr;
      y = (e.clientY - rect.top) * dpr;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // Sample a smaller region for performance
    const sampleSize = 10;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4 * sampleSize) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const totalPixels = pixels.length / 4;
    const sampledPixels = totalPixels / sampleSize;
    const percentage = (transparentPixels / sampledPixels) * 100;
    setScratchedPercentage(percentage);

    if (percentage > 50 && scratchedPercentage <= 50) {
      onComplete();
    }
  };

  return (
    <div className="relative w-[300px] h-[150px] flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="text-center">
          <div className="text-6xl font-bold text-green-500">{discount}%</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">OFF</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="cursor-pointer rounded-lg relative z-10"
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseMove={scratch}
        onMouseLeave={() => setIsScratching(false)}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={scratch}
      />
    </div>
  );
};