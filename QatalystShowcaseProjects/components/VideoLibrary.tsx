'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { Sidebar } from './Sidebar';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Climate Impact - English',
    url: 'https://hai3k5tf4o77ziyv.public.blob.vercel-storage.com/SBK%20Videos/Climate_ENG.mp4',
  },
  {
    id: '2',
    title: 'Climate Impact - Japanese',
    url: 'https://hai3k5tf4o77ziyv.public.blob.vercel-storage.com/SBK%20Videos/Climate_JPN%20%281%29.mp4',
  },
];

export function VideoLibrary() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <motion.div
        className="flex-1 overflow-y-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Video Library</h1>
            <p className="text-lg text-slate-600 mb-12">
              Explore project videos and multimedia content
            </p>
          </motion.div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {videos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedVideo(video)}
                className="cursor-pointer group"
              >
                <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center hover:shadow-xl transition-shadow">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center z-10">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center text-white shadow-lg"
                      >
                        <Play className="w-8 h-8 fill-current" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {video.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-20" />
      </motion.div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
