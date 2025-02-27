import { useState, useEffect } from "react";
import axios from "axios";

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/services");
            setServices(res.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const formDataObj = new FormData();
            formDataObj.append("name", formData.name);
            formDataObj.append("description", formData.description);
            if (formData.image) {
                formDataObj.append("image", formData.image);
            }

            if (editMode) {
                await axios.put(`http://localhost:5000/api/services/${editId}`, formDataObj);
            } else {
                await axios.post("http://localhost:5000/api/services", formDataObj);
            }

            setStatus("success");
            setFormData({ name: "", description: "", image: null });
            setEditMode(false);
            fetchServices();
        } catch (error) {
            console.error("Error submitting service:", error);
            setStatus("error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const handleEdit = (service) => {
        setFormData({ name: service.name, description: service.description });
        setEditMode(true);
        setEditId(service.id);
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-heading mb-4">Manage Services</h2>

            {/* Service Form */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-6 shadow-lg rounded-lg">
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full p-3 border rounded-lg" placeholder="Service Name" required />

                <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                    className="w-full p-3 border rounded-lg" placeholder="Service Description" required />

                <input type="file" onChange={handleFileChange} className="w-full p-3 border rounded-lg" />

                <button type="submit" className="bg-green-600 text-white py-3 w-full rounded-lg hover:bg-green-700">
                    {editMode ? "Update Service" : "Add Service"}
                </button>

                {status === "success" && <p className="text-green-600 mt-2">✅ Success!</p>}
                {status === "error" && <p className="text-red-600 mt-2">❌ Error. Try again.</p>}
            </form>

            {/* List of Services */}
            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-4 shadow-lg rounded-lg flex justify-between">
                        <div>
                            <h3 className="text-xl font-bold">{service.name}</h3>
                            <p>{service.description}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => handleEdit(service)} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(service.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageServices;
