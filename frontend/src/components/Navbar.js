import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
    const [visible, setVisible] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const location = useLocation(); // Get current route

    useEffect(() => {
        // Check if user is logged in (has a token)
        const token = localStorage.getItem("token");
        setIsAdmin(!!token); // Convert to boolean (true if token exists)

        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    // 🔹 Hide navbar when on the Admin page
    if (location.pathname === "/admin") {
        return null; // Don't render the navbar at all
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-white shadow-lg transition-transform duration-300 z-50 ${
                visible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                {/* Logo & Tagline */}
                <div className="flex flex-col">
                    <Link to="/" className="text-3xl font-heading text-green-700">
                        Land Escapes
                    </Link>
                    <span className="text-sm text-gray-600 italic font-body">
                        A Premier Landscape Development Company
                    </span>
                </div>

                {/* Desktop Navigation Links */}
                <ul className="hidden md:flex space-x-6 text-lg font-body">
                    <li><Link to="/" className="hover:text-green-600">Home</Link></li>
                    <li><Link to="/contact" className="hover:text-green-600">Contact</Link></li>
                    {isAdmin && (
                        <li>
                            <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Admin
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Navigation Links */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col items-center space-y-4 py-4 text-lg font-body">
                        <li><Link to="/" className="hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/contact" className="hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                        {isAdmin && (
                            <li>
                                <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setMobileMenuOpen(false)}>
                                    Admin
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
