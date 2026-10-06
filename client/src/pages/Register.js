import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Client-side validation (PRD §4)
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        
        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            setSuccess('Registration successful! You can now sign in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Join Susu Group</h1>
            
            {error && (
                <div style={{ 
                    backgroundColor: '#fee', 
                    color: '#c00', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    {error}
                </div>
            )}
            
            {success && (
                <div style={{ 
                    backgroundColor: '#efe', 
                    color: '#060', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    {success}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {[
                    { name: 'username', label: 'Username', type: 'text' },
                    { name: 'email', label: 'Email Address', type: 'email' },
                    { name: 'password', label: 'Password', type: 'password' },
                    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' }
                ].map(field => (
                    <div key={field.name} style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                ))}
                
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        minHeight: '48px',
                        marginTop: '8px'
                    }}
                >
                    Create Account
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '24px' }}>
                Already a member?{' '}
                <a href="/login" style={{ color: '#3498db', fontWeight: 'bold' }}>
                    Sign In
                </a>
            </p>
        </div>
    );
};

export default Register;