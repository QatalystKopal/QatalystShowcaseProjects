'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { Sidebar } from './Sidebar';
import { HeroSection } from './project-details/HeroSection';
import { ExecutiveSummary } from './project-details/ExecutiveSummary';
import { YieldAndVintageSection } from './project-details/YieldAndVintageSection';
import { MethodologySDGSection } from './project-details/MethodologySDGSection';
import { ProjectNarrative } from './project-details/ProjectNarrative';
import { DetailedReviewSection } from './project-details/DetailedReviewSection';
import { ProjectGallery } from './project-details/ProjectGallery';
import { ProjectTeam } from './project-details/ProjectTeam';

interface ProjectDetailsPageProps {
  project: Project;
}

export function ProjectDetailsPage({ project }: ProjectDetailsPageProps) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <motion.div
        className="flex-1 overflow-y-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <HeroSection project={project} />
        <ExecutiveSummary project={project} />
        <YieldAndVintageSection project={project} />
        <MethodologySDGSection project={project} />
        <ProjectNarrative project={project} />
        <DetailedReviewSection project={project} />
        <ProjectGallery project={project} />
        <ProjectTeam project={project} />
        <div className="h-20" />
      </motion.div>
    </div>
  );
}
