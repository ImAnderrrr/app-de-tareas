import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export function ImageCarousel({ slides, autoPlay = true, interval = 5000 }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-full">
      {/* Image Container */}
      <div className="relative w-full h-80 overflow-hidden rounded-2xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <motion.button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="mt-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide 
                ? 'bg-primary' 
                : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}