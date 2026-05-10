'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Project } from '@/lib/projects';

interface MapSectionProps {
  project: Project;
}

export function MapSection({ project }: MapSectionProps) {
  const isKuburaya = project.shortName === 'Kuburaya';

  const mapData = isKuburaya ? {
    title: 'Kuburaya Project in Kalimantan, Indonesia',
    mapImage: '/Kuburaya map.png',
    location: 'Kalimantan',
    area: '18,042 ha',
    areaDescription: 'Mangrove & Forest',
    ecosystem: 'Coastal',
    ecosystemDescription: 'Mangrove Forest'
  } : {
    title: 'South Barito Kapuas Project in Central Kalimantan, Indonesia',
    mapImage: '/SBK Map.png',
    location: 'Central Kalimantan',
    area: '39,835 ha',
    areaDescription: 'Peatland & Forest',
    ecosystem: 'Tropical',
    ecosystemDescription: 'Peatland Forest'
  };
  return (
    <motion.section
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Project Location</h2>
          <p className="text-base sm:text-lg text-gray-600">
            {mapData.title}
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full h-auto min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
            <Image
              src={mapData.mapImage}
              alt={`${project.name} Project Location Map`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Location</p>
            <p className="text-lg sm:text-xl font-bold text-black mt-2">{mapData.location}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Indonesia</p>
          </div>

          <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Project Area</p>
            <p className="text-lg sm:text-xl font-bold text-black mt-2">{mapData.area}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{mapData.areaDescription}</p>
          </div>

          <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Ecosystem</p>
            <p className="text-lg sm:text-xl font-bold text-black mt-2">{mapData.ecosystem}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{mapData.ecosystemDescription}</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
