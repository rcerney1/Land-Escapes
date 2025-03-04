function Footer() {
    return (
        <footer className="bg-gray-800 text-white text-center p-6 mt-10">
            <div className="max-w-4xl mx-auto">
                {/* Business Contact Information */}
                <p className="text-lg font-semibold">Contact Us</p>
                <p className="mt-1">📞 (123) 456-7890</p>
                <p>✉️ info@landescapes.com</p>
                <p>📍 123 Greenway Ave, Landscapetown, USA</p>

                {/* Copyright */}
                <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Land Escapes. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
