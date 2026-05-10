'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MethodologySDGSectionProps {
  project: Project;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function MethodologySDGSection({ project }: MethodologySDGSectionProps) {
  const isKuburaya = project.shortName === 'Kuburaya';
  const methodologyData = project.methodologyBreakdown || [];

  const kuburayaSDGs = [
    { number: 1, label: 'No Poverty', image: '/E-WEB-Goal-01.png' },
    { number: 2, label: 'Zero Hunger', image: '/E-WEB-Goal-02.png' },
    { number: 5, label: 'Gender Equality', image: '/E-WEB-Goal-05.png' },
    { number: 6, label: 'Clean Water & Sanitation', image: '/E-WEB-Goal-06.png' },
    { number: 8, label: 'Decent Work & Economic Growth', image: '/E-WEB-Goal-08.png' },
    { number: 12, label: 'Responsible Consumption', image: '/E-WEB-Goal-12.png' },
    { number: 13, label: 'Climate Action', image: '/E-WEB-Goal-13.png' },
    { number: 14, label: 'Life Below Water', image: '/E-WEB-Goal-14.png' },
    { number: 15, label: 'Life on Land', image: '/E-WEB-Goal-15.png' },
  ];

  const sdgs = isKuburaya ? kuburayaSDGs : project.sdgs;

  return (
    <motion.section
      className="py-16 px-2 sm:px-3 lg:px-4 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-black mb-3">Methodologies & Impact Alignment</h2>
          <p className="text-lg text-gray-600">
            Technical approach and Sustainable Development Goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Methodology Breakdown */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="p-8 border-gray-200 h-full">
              <h3 className="text-xl font-bold text-black mb-8">Methodology Mix</h3>

              {methodologyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={methodologyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="pct"
                      label={({ label, pct }: { label: string; pct: number }) => `${label} (${pct}%)`}
                    >
                      {methodologyData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} opacity={0.9} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}

              {/* Legend */}
              <div className="mt-8 space-y-3">
                {methodologyData.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {item.label}: <span className="text-gray-500">{item.pct}%</span>
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-8">
                {project.methodologies.join(' • ')}
              </p>
            </Card>
          </motion.div>

          {/* SDG Gallery */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8 border-gray-200 h-full">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-6 sm:mb-8">SDG Alignment ({sdgs.length} Goals)</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {sdgs.map((sdg, idx) => (
                  <motion.div
                    key={idx}
                    className="flex flex-col items-center text-center group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {sdg.image && (
                      <img
                        src={sdg.image}
                        alt={`SDG ${sdg.number}: ${sdg.label}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300 mb-2 sm:mb-3"
                      />
                    )}
                    <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
                      SDG {sdg.number}
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-gray-600 mt-1 line-clamp-2">{sdg.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-black font-semibold">
                  ✓ This project demonstrates clear alignment with multiple UN Sustainable Development Goals,
                  ensuring positive social and environmental impact beyond carbon mitigation.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
