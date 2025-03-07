import { useEffect, useState } from "react";
import axios from "axios";

function Footer() {
    const [contact, setContact] = useState({
        phone: "Loading...",
        email: "Loading...",
        address: "Loading..."
    });

    useEffect(() => {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable

        axios.get(`${API_BASE_URL}/api/contact`)
            .then(res => setContact(res.data))
            .catch(err => console.error("Error fetching contact info:", err));
    }, []);

    return (
        <footer className="bg-gray-800 text-white text-center p-6 mt-10">
            <div className="max-w-4xl mx-auto">
                <p className="text-lg font-semibold">Contact Us</p>
                <p>📞 {contact.phone}</p>
                <p>✉️ {contact.email}</p>
                <p>📍 {contact.address}</p>
                <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Land Escapes. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
