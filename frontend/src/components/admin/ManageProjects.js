import { useState, useEffect } from "react";
import axios from "axios";

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable
        try {
            const res = await axios.get(`${API_BASE_URL}/api/projects`);
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Ensure it's used in API requests

        try {
            const formDataObj = new FormData();
            formDataObj.append("title", formData.title);
            formDataObj.append("description", formData.description);
            if (formData.image) {
                formDataObj.append("image", formData.image);
            }

            if (editMode) {
                await axios.put(`${API_BASE_URL}/api/projects/${editId}`, formDataObj);
            } else {
                await axios.post(`${API_BASE_URL}/api/projects`, formDataObj);
            }

            setStatus("success");
            setFormData({ title: "", description: "", image: null });
            setEditMode(false);
            fetchProjects();
        } catch (error) {
            console.error("Error submitting project:", error);
            setStatus("error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Ensure it's used in DELETE request

        try {
            await axios.delete(`${API_BASE_URL}/api/projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleEdit = (project) => {
        setFormData({ title: project.title, description: project.description });
        setEditMode(true);
        setEditId(project.id);
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-heading mb-4">Manage Projects</h2>

            {/* Project Form */}
            <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 shadow-lg rounded-lg">
                <input type="text" name="title" value={formData.title} onChange={handleChange}
                    className="w-full p-3 border rounded-lg" placeholder="Project Title" required />

                <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                    className="w-full p-3 border rounded-lg" placeholder="Project Description" required />

                <input type="file" onChange={handleFileChange} className="w-full p-3 border rounded-lg" />

                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                    {editMode ? "Update Project" : "Add Project"}
                </button>
            </form>

            {/* List of Projects */}
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white p-4 shadow-lg rounded-lg flex justify-between">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <div className="flex space-x-3">
                            <button onClick={() => handleEdit(project)} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageProjects;
