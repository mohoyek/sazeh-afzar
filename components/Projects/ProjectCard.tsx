import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Project } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Reveal delay={index * 0.08}>
      <article className="group relative aspect-[4/3] overflow-hidden rounded-sm">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent transition-opacity duration-300 group-hover:from-primary/95" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-base font-bold text-white">{project.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
            <MapPin size={13} aria-hidden="true" />
            {project.location}
          </p>
          <p className="mt-2 text-xs leading-6 text-white/60 line-clamp-2">
            {project.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
