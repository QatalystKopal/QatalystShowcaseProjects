'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projects';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryProps {
  project: Project;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const images = [
    {
      url: '/04%20-%20Economic%20Initiatives%20(2).jpg',
      caption: 'Economic Initiatives & Community Development'
    },
    {
      url: '/05%20-%20Construction%20of%20Drilled%20Wells%20(2).JPG',
      caption: 'Construction of Drilled Wells'
    },
    {
      url: '/Clouded%20Leopard.jpg',
      caption: 'Wildlife Conservation - Clouded Leopard'
    },
    {
      url: '/TK%20Tunas%20Harapan%20Desa%20Batapah%20(1)%20(1).jpg',
      caption: 'Community Engagement at Desa Batapah'
    },
    {
      url: '/TimePhoto_20250415_111704%20(1).jpg',
      caption: 'Project Field Operations'
    },
    {
      url: '/White-bearded%20gibbon%20(1).jpg',
      caption: 'Biodiversity - White-bearded Gibbon'
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  const goToPrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  return (
    <motion.section
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">Project Gallery</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Visual documentation of project activities and impact
          </p>
        </motion.div>

        {/* Main Gallery */}
        <div className="relative mb-4 sm:mb-6 md:mb-8">
          {/* Image Container */}
          <div className="relative w-full overflow-hidden rounded-lg bg-gray-200 aspect-video">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                alt={images[currentIndex].caption}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Image Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 sm:p-3 md:p-4">
              <p className="text-white text-xs sm:text-sm md:text-base font-semibold line-clamp-2">
                {images[currentIndex].caption}
              </p>
              <p className="text-gray-200 text-xs mt-0.5 sm:mt-1">
                {currentIndex + 1} / {images.length}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-1.5 sm:p-2 md:p-2.5 transition-all duration-200 z-10 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-1.5 sm:p-2 md:p-2.5 transition-all duration-200 z-10 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Thumbnail Strip - Horizontal Scroll */}
          <div className="mt-3 sm:mt-4 md:mt-5 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 sm:gap-2 pb-1.5 sm:pb-2">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    currentIndex === idx
                      ? 'border-[#f86501] ring-2 ring-[#f86501]/40'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={img.url}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 md:mt-5">
            {images.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-200 ${
                  currentIndex === idx
                    ? 'w-2 h-2 sm:w-3 sm:h-3 bg-[#f86501]'
                    : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="flex items-center justify-center mt-3 sm:mt-4 md:mt-5">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 ${
                autoPlay
                  ? 'bg-[#f86501] text-white hover:opacity-90'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {autoPlay ? '⏸ Auto-scroll: On' : '▶ Auto-scroll: Off'}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
