'use client';

import { motion } from 'framer-motion';
import { projects } from '@/lib/projects';
import { ProjectDetailsPage } from '@/components/ProjectDetailsPage';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
          <p className="text-slate-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ProjectDetailsPage project={project} />
    </motion.div>
  );
}
