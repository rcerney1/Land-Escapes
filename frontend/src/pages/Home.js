import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCarousel from "../components/ProjectCarousel";
import { Link } from "react-router-dom";  // Import Link from React Router

function Home() {
    const [about, setAbout] = useState("");
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);

    console.log(projects);

    useEffect(() => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable

        // Fetch About Section
        axios.get(`${API_BASE_URL}/api/about`)
            .then((res) => setAbout(res.data.content))
            .catch((err) => console.error("Error fetching about:", err));

        // Fetch Services
        axios.get(`${API_BASE_URL}/api/services`)
            .then((res) => setServices(res.data))
            .catch((err) => console.error("Error fetching services:", err));

        // Fetch Featured Projects (limit to 3 for homepage)
        axios.get(`${API_BASE_URL}/api/projects`)
            .then((res) => setProjects(res.data.slice(0, 3)))
            .catch((err) => console.error("Error fetching projects:", err));
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative h-screen flex flex-col justify-center items-center text-white text-center"
                style={{
                    backgroundImage: "url('/land-escapes-hero-image-3.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    zIndex: "0", // Ensures hero stays behind navbar
                }}
            >

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                {/* Content */}
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold drop-shadow-2xl">Welcome to Land Escapes</h1>
                    <p className="text-xl mt-4 drop-shadow-2xl">Professional Landscaping Services</p>
                    <Link to="/contact">
                        <button className="mt-6 px-6 py-3 bg-green-500 text-white text-lg rounded hover:bg-green-600 shadow-lg">
                            Get a Free Estimate
                        </button>
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-[#b8cbb8] text-black flex flex-col items-center text-center">
                <h2 className="text-4xl font-heading">About Us</h2>
                <p className="mt-4 text-lg max-w-3xl font-body">{about || "Loading..."}</p>
            </section>

            {/* Services Section */}
            <section className="bg-[#f5f5f5] p-16 min-h-screen flex flex-col justify-center items-center text-center">
                <h2 className="text-4xl font-heading">Our Services</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.length > 0 ? (
                        services.map((service) => (
                            <div
                                key={service.id}
                                className="p-8 bg-white shadow-lg rounded-lg transition-all duration-300 hover:bg-gray-100"
                            >
                                <img
                                    src={service.image_url}
                                    alt={service.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <h3 className="text-2xl font-heading mt-4">{service.name}</h3>
                                <p className="mt-2 text-lg font-body">{service.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-lg">Loading services...</p>
                    )}
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="py-20 bg-white">
                <ProjectCarousel />
            </section>
        </div>
    );
}

export default Home;
