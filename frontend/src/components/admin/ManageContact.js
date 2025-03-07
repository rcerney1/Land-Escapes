import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageContact = () => {
    const [contact, setContact] = useState({
        phone: "",
        email: "",
        address: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable

        axios.get(`${API_BASE_URL}/api/contact`)
            .then(res => setContact(res.data))
            .catch(err => console.error("Error fetching contact info:", err));
    }, []);

    const handleChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Ensure it's used in PUT request

        try {
            await axios.put(`${API_BASE_URL}/api/contact`, contact);
            setMessage("Contact information updated successfully!");
        } catch (error) {
            console.error("Error updating contact info:", error);
            setMessage("Failed to update contact info.");
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Edit Contact Information</h2>
            {message && <p className="text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={contact.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={contact.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={contact.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ManageContact;
