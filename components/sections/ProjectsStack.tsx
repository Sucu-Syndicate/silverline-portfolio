const projects = [
  { id: 1, label: 'PROJECT 01', title: 'Project One', description: 'Placeholder — project description goes here.' },
  { id: 2, label: 'PROJECT 02', title: 'Project Two', description: 'Placeholder — project description goes here.' },
  { id: 3, label: 'PROJECT 03', title: 'Project Three', description: 'Placeholder — project description goes here.' },
  { id: 4, label: 'PROJECT 04', title: 'Project Four', description: 'Placeholder — project description goes here.' },
];

export default function ProjectsStack() {
  return (
    <div className="projects-stack-outer" id="work">
      {projects.map((project, i) => (
        <div
          key={project.id}
          className="project-card"
          style={{ zIndex: i + 1 }}
        >
          <div className="project-card-inner">
            <p className="project-card-label">{project.label}</p>
            <h2 className="project-card-title">{project.title}</h2>
            <p className="project-card-desc">{project.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
