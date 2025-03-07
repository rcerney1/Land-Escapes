import { useState, useEffect } from "react";
import axios from "axios";

const ManageAbout = () => {
    const [about, setAbout] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable

        axios.get(`${API_BASE_URL}/api/about`)
            .then(res => {
                setAbout(res.data.content);
                setNewContent(res.data.content);
            })
            .catch(err => console.error("Error fetching about section:", err));
    }, []);

    const handleUpdate = () => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Ensure it's used in PUT request

        axios.put(`${API_BASE_URL}/api/about`, { content: newContent })
            .then(() => {
                alert('Section updated');
                setAbout(newContent);
            })
            .catch(err => console.error("Error updating about section:", err));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Manage About Section</h2>
            <textarea
                className="w-full p-2 border rounded-lg"
                rows="6"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
            ></textarea>
            <button onClick={handleUpdate} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Update About Section
            </button>
        </div>
    );
};

export default ManageAbout;
