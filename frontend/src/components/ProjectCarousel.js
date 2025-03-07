import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProjectCarousel = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable

        fetch(`${API_BASE_URL}/api/projects`)
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching projects:", err));
    }, []);

    return (
        <section className="py-20 flex flex-col items-center text-center">
            <h2 className="text-4xl font-heading mb-8">Our Projects</h2>
            <div className="w-full max-w-5xl">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="rounded-lg shadow-lg"
                >
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <SwiperSlide key={project.id} className="relative">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-[500px] object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                                    <h3 className="text-2xl font-bold">{project.title}</h3>
                                    <p className="text-lg">{project.description}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <p className="text-lg">Loading projects...</p>
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default ProjectCarousel;
