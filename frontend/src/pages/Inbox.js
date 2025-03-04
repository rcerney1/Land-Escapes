import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/messages');
            setMessages(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("Failed to load messages.");
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/messages/${id}`);
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message.");
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/messages/${id}/read`);
            setMessages(messages.map(msg => msg.id === id ? { ...msg, is_read: true } : msg));
        } catch (error) {
            console.error("Error marking message as read:", error);
            alert("Failed to mark message as read.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-24 md:pt-32 px-6">
            <h2 className="text-4xl font-heading mb-6">Inbox</h2>

            {loading && <p>Loading messages...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {messages.length > 0 ? (
                <div className="w-full max-w-3xl">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`p-4 bg-white shadow-md rounded mb-4 ${msg.is_read ? 'opacity-70' : ''}`}>
                            <h3 className="text-xl font-bold">{msg.name}</h3>
                            <p className="text-sm text-gray-500">{msg.email}</p>
                            <p className="mt-2">{msg.message}</p>

                            <div className="mt-4 flex gap-4">
                                {!msg.is_read && (
                                    <button
                                        onClick={() => markAsRead(msg.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600">No messages yet.</p>
            )}
        </div>
    );
};

export default Inbox;
