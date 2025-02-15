import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";

const ProjectMasonry = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching projects:", err));
    }, []);

    // Responsive breakpoints for the masonry layout
    const breakpointColumns = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <section className="py-20 bg-gray-100 flex flex-col items-center text-center">
            <h2 className="text-4xl font-heading mb-8">Our Projects</h2>
            <Masonry breakpointCols={breakpointColumns} className="flex w-full max-w-6xl gap-4" columnClassName="masonry-column">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img src={project.image_url} alt={project.title} className="w-full h-auto object-cover" />
                            <div className="p-4">
                                <h3 className="text-2xl font-bold">{project.title}</h3>
                                <p className="mt-2 text-lg">{project.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-lg">Loading projects...</p>
                )}
            </Masonry>
        </section>
    );
};

export default ProjectMasonry;
