import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');  // Get JWT token from storage
            const response = await axios.post(
                'http://localhost:5000/api/auth/change-password',
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/admin');  // Redirect back to admin page after success
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={handleChangePassword} className="p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Change Password</h2>

                {message && <div className="mb-4 text-green-500">{message}</div>}
                {error && <div className="mb-4 text-red-500">{error}</div>}

                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mb-4 p-2 border"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mb-4 p-2 border"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
