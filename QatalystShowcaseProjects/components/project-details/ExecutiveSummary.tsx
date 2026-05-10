'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { Card } from '@/components/ui/card';

interface ExecutiveSummaryProps {
  project: Project;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ExecutiveSummary({ project }: ExecutiveSummaryProps) {
  const isKuburaya = project.shortName === 'Kuburaya';

  const kuburayaMetrics = [
    {
      value: '62.4M',
      label: 'TOTAL VCUs',
    },
    {
      value: '2M',
      label: 'ANNUAL AVG VCUs',
    },
    {
      value: 'Q2-Q3 2026',
      label: 'FIRST ISSUANCE',
    },
    {
      value: '2023',
      label: 'VINTAGE START YEAR',
    },
    {
      value: '30 years',
      label: 'LIFETIME',
    },
    {
      value: '18,041.62',
      label: 'PROJECT AREA (ha)',
    },
    {
      value: '19%',
      label: 'BUFFER POOL',
    },
    {
      value: 'REDD - IFM + CIW',
      label: 'PRIMARY METHOD',
    },
  ];

  const sbkMetrics = [
    {
      value: '58.8 M',
      label: 'TOTAL VCUs',
    },
    {
      value: '900K',
      label: 'ANNUAL AVG. VCUs',
    },
    {
      value: 'Q2-Q3 2026',
      label: 'FIRST ISSUANCE',
    },
    {
      value: '2022',
      label: 'VINTAGE START YEAR',
    },
    {
      value: '61 yrs',
      label: 'LIFETIME',
    },
    {
      value: '39.8K ha',
      label: 'PROJECT AREA',
    },
    {
      value: '12% non-perm.',
      label: 'BUFFER POOL',
    },
    {
      value: 'REDD - WRC',
      label: 'PRIMARY METHOD',
    },
  ];

  const metrics = isKuburaya ? kuburayaMetrics : sbkMetrics;

  return (
    <motion.section
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-white border-t border-gray-200"
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">Project Metrics</h2>
        </motion.div>

        {/* Metrics Grid - 2 rows x 4 columns */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {metrics.map((metric, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="p-3 sm:p-4 md:p-5 bg-gray-50 border-gray-300 hover:shadow-md transition-shadow duration-300 h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1 sm:mb-2 leading-tight line-clamp-1">
                    {metric.value}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide leading-snug line-clamp-2">
                    {metric.label}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
