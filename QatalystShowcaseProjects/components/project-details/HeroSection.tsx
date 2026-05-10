'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Award } from 'lucide-react';
import { Project } from '@/lib/projects';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  project: Project;
}

export function HeroSection({ project }: HeroSectionProps) {
  const isKuburaya = project.shortName === 'Kuburaya';

  return (
    <>
      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${project.images.hero}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Title */}
          <motion.h1
            className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {project.name}
          </motion.h1>

          {/* VCS ID and Tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Badge variant="secondary" className="bg-white/90 text-black font-semibold">
              {project.vcsId}
            </Badge>
            <Badge variant="secondary" className="bg-[#0D9488]/90 text-white font-semibold">
              {project.type}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-black font-semibold">
              {project.country}
            </Badge>
            <Badge variant="secondary" className="bg-[#F86501]/90 text-white font-semibold">
              {project.status}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Trust Bar - Floating at Bottom - Desktop only */}
        <motion.div
          className="hidden sm:block absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-6">
              {/* Rating Section */}
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-[#0D9488] to-[#006B63] rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{isKuburaya ? '✓' : 'A'}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {isKuburaya ? 'CCB Gold Rating' : 'BeZero Carbon Rating'}
                  </p>
                  <p className="text-lg font-bold text-black">{isKuburaya ? 'Gold' : 'Grade A'}</p>
                  <p className="text-xs text-[#0D9488] font-semibold">{isKuburaya ? 'Climate, Community & Biodiversity' : 'Highest Additionality (AAA)'}</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-200" />

              {/* Verification Status */}
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0D9488]" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Verification Status
                  </p>
                  <p className="text-sm font-bold text-black">{isKuburaya ? 'Under Validation' : 'Registration Requested'}</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-200" />

              {/* Methodology & Version */}
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#F86501]" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {isKuburaya ? 'Methodology & Version' : 'Methodology & Version'}
                  </p>
                  {isKuburaya ? (
                    <div className="text-xs text-black font-light leading-tight">
                      <p className="font-semibold">Verra Verified Carbon Standard (VCS) v4.4</p>
                      <p>VM0011 IFM v1.0 | VM0007 REDD+ v1.6</p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-black">VM0007 v1.6</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile-only Trust Cards - shown below hero on mobile */}
      <div className="sm:hidden bg-gray-50 px-4 py-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Rating Card */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#0D9488] to-[#006B63] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{isKuburaya ? '✓' : 'A'}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{isKuburaya ? 'CCB Gold' : 'BeZero Rating'}</p>
                <p className="text-sm font-bold text-black">{isKuburaya ? 'Gold' : 'Grade A'}</p>
                <p className="text-xs text-[#0D9488] font-semibold">{isKuburaya ? 'Climate, Community & Biodiversity' : 'Highest Additionality'}</p>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</p>
                <p className="text-sm font-bold text-black">{isKuburaya ? 'Under Validation' : 'Registration Requested'}</p>
              </div>
            </div>
          </div>

          {/* Methodology & Version Card */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#F86501] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Methodology & Version</p>
                {isKuburaya ? (
                  <div className="text-xs text-black font-light leading-tight">
                    <p className="font-semibold">VCS v4.4</p>
                    <p>VM0011 IFM v1.0 | VM0007 REDD+ v1.6</p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-black">VM0007 v1.6</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
