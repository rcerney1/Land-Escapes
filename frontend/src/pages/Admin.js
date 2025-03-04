import { useState } from "react";
import { Link } from "react-router-dom";
import ManageAbout from "../components/admin/ManageAbout";
import ManageServices from "../components/admin/ManageServices";
import ManageProjects from "../components/admin/ManageProjects";
import ViewMessages from "../components/admin/ViewMessages";
import ManageContact from "../components/admin/ManageContact"; // Import ManageContact

const Admin = () => {
    const [activeSection, setActiveSection] = useState("about");

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                <ul className="space-y-4">
                    <li><button onClick={() => setActiveSection("about")} className="w-full text-left">Manage About</button></li>
                    <li><button onClick={() => setActiveSection("services")} className="w-full text-left">Manage Services</button></li>
                    <li><button onClick={() => setActiveSection("projects")} className="w-full text-left">Manage Projects</button></li>
                    <li><button onClick={() => setActiveSection("contact")} className="w-full text-left">Manage Contact Info</button></li>
                </ul>

                {/* Home Button */}
                <div className="mt-6 border-t border-gray-700 pt-4">
                    <Link to="/" className="block text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                        Home
                    </Link>
                </div>

                <Link to="/change-password" className="block text-center mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                    Change Password
                </Link>

                <Link to="/inbox" className="block text-center mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    View Inbox
                </Link>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-10">
                {activeSection === "about" && <ManageAbout />}
                {activeSection === "services" && <ManageServices />}
                {activeSection === "projects" && <ManageProjects />}
                {activeSection === "messages" && <ViewMessages />}
                {activeSection === "contact" && <ManageContact />} {/* New Section for Contact Info */}
            </main>
        </div>
    );
};

export default Admin;
