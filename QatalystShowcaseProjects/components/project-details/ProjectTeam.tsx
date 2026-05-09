'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { Card } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';

interface ProjectTeamProps {
  project: Project;
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  const team = [
    { label: 'Developer', value: project.developer, icon: Building2 },
    ...(project.operator ? [{ label: 'Operator', value: project.operator, icon: Users }] : []),
    ...(project.advisor ? [{ label: 'Advisor', value: project.advisor, icon: Building2 }] : []),
  ];

  return (
    <motion.section
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 md:mb-3">Project Participants</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Organizations driving the development and management of this project
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {team.map((member, idx) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <Card className="p-4 sm:p-6 md:p-8 border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-[#F86501]/10 to-[#0D9488]/10 rounded-lg flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F86501]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
                        {member.label}
                      </h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-black leading-snug line-clamp-2">
                    {member.value}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
