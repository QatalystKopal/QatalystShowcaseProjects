'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  url: string;
}

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-black rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">{video.title}</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                  <p>Loading video...</p>
                </div>
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-white text-center">
                  <p className="text-lg font-semibold mb-2">Error loading video</p>
                  <p className="text-sm text-gray-400">The video could not be loaded. Please try again later.</p>
                </div>
              </div>
            )}
            <video
              src={video.url}
              controls
              autoPlay
              preload="auto"
              crossOrigin="anonymous"
              className="w-full h-full max-h-[calc(90vh-60px)]"
              onCanPlay={() => setIsLoading(false)}
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              onLoadStart={() => setIsLoading(true)}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
