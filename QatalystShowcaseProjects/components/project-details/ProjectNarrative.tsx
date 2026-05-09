'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projects';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ProjectNarrativeProps {
  project: Project;
}

export function ProjectNarrative({ project }: ProjectNarrativeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewLength = 400;
  const fullText = project.description;
  const isLongText = fullText.length > previewLength;
  const displayText = isExpanded ? fullText : fullText.substring(0, previewLength);

  return (
    <motion.section
      className="py-16 px-2 sm:px-3 lg:px-4 bg-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-black mb-3">About This Project</h2>
          <p className="text-lg text-gray-600">
            Detailed overview of the conservation initiative and its impact
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg font-light text-gray-700 mb-6">
              {displayText}
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <p className="text-lg font-light text-gray-700 mb-6">
                    {fullText.substring(previewLength)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {isLongText && (
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-8 border-gray-300 text-gray-700 hover:bg-gray-50 group"
              >
                {isExpanded ? 'Read Less' : 'Read More'}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Highlights */}
          <div>
            <h3 className="text-xl font-bold text-black mb-4">Key Highlights</h3>
            <ul className="space-y-3">
              {project.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  className="flex gap-3 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-[#F86501] font-bold mt-1">✓</span>
                  <span className="text-gray-700 font-light">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Co-benefits */}
          <div>
            <h3 className="text-xl font-bold text-black mb-4">Co-benefits</h3>
            <div className="flex flex-wrap gap-2">
              {project.cobenefits.map((benefit, idx) => (
                <motion.span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-full text-sm font-semibold text-gray-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {benefit}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Impact Areas */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Biodiversity Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <h4 className="text-lg font-bold text-black mb-3">🌿 Biodiversity Impact</h4>
            <p className="text-sm text-gray-700 font-light leading-relaxed">
              {project.biodiversityImpact}
            </p>
          </motion.div>

          {/* Community Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <h4 className="text-lg font-bold text-black mb-3">👥 Community Impact</h4>
            <p className="text-sm text-gray-700 font-light leading-relaxed">
              {project.communityImpact}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
