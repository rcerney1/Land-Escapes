import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [about, setAbout] = useState("");
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch About Section
        axios.get("http://localhost:5000/api/about")
            .then((res) => setAbout(res.data.content))
            .catch((err) => console.error("Error fetching about:", err));

        // Fetch Services
        axios.get("http://localhost:5000/api/services")
            .then((res) => setServices(res.data))
            .catch((err) => console.error("Error fetching services:", err));

        // Fetch Featured Projects (limit to 3 for homepage)
        axios.get("http://localhost:5000/api/projects")
            .then((res) => setProjects(res.data.slice(0, 3)))
            .catch((err) => console.error("Error fetching projects:", err));
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gray-800 text-white h-screen flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold">Welcome to Land Escapes</h1>
                <p className="text-xl mt-4">Professional Landscaping Services</p>
                <button className="mt-6 px-6 py-3 bg-green-500 text-white text-lg rounded hover:bg-green-600">
                    Get a Free Estimate
                </button>
            </section>

            {/* About Section */}
            <section className="p-10 text-center">
                <h2 className="text-3xl font-bold">About Us</h2>
                <p className="mt-4 text-lg">{about || "Loading..."}</p>
            </section>

            {/* Services Section */}
            <section className="bg-gray-100 p-10 text-center">
                <h2 className="text-3xl font-bold">Our Services</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.length > 0 ? (
                        services.map((service) => (
                            <div key={service.id} className="p-6 bg-white shadow-lg rounded">
                                <h3 className="text-xl font-bold">{service.name}</h3>
                                <p className="mt-2">{service.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading services...</p>
                    )}
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="p-10 text-center">
                <h2 className="text-3xl font-bold">Featured Projects</h2>
                <p className="mt-4 text-lg">Check out some of our recent landscaping work.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project.id} className="p-6 bg-gray-300 h-40 rounded flex flex-col justify-center items-center">
                                <img src={project.image_url} alt={project.title} className="w-full h-32 object-cover rounded" />
                                <h3 className="text-lg font-bold mt-2">{project.title}</h3>
                            </div>
                        ))
                    ) : (
                        <p>Loading projects...</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;
