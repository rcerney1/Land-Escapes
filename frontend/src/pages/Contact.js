import { useState } from "react";
import axios from "axios";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState(null); // Track submission status

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            await axios.post("http://localhost:5000/api/messages", formData);
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus("error");
        }
    };

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 pt-24 md:pt-32">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-4xl font-heading text-center mb-4">Contact Us</h2>
                <p className="text-center text-gray-600 mb-6">
                    Have a question? Send us a message and we’ll get back to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Sending..." : "Send Message"}
                    </button>
                </form>

                {/* Status Messages */}
                {status === "success" && (
                    <p className="mt-4 text-green-600 text-center">
                        ✅ Message sent successfully!
                    </p>
                )}
                {status === "error" && (
                    <p className="mt-4 text-red-600 text-center">
                        ❌ Error sending message. Please try again.
                    </p>
                )}
            </div>
        </section>
    );
};

export default Contact;
