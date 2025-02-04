import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <h1 className="text-xl font-bold">Land Escapes</h1>
            <div className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/contact" className="hover:underline">Contact</Link>
            </div>
        </nav>
    );
}

export default Navbar;
