import { useEffect, useState } from "react";
import axios from "axios";

function Footer() {
    const [contact, setContact] = useState({
        phone: "Loading...",
        email: "Loading...",
        address: "Loading..."
    });

    useEffect(() => {
        axios.get("http://localhost:5000/api/contact")
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
            <div>
                <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Admin
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
