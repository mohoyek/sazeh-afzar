import { projects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="py-20 lg:py-28 bg-white scroll-mt-20">
      <div className="container-site">
        <SectionHeading eyebrow="پروژه‌ها" title="پروژه‌های اجراشده" />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
