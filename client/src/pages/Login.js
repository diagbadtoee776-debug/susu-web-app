import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.user, response.data.token);
            navigate(response.data.user.role === 'Admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h1>
            
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
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        minHeight: '48px'
                    }}
                >
                    Sign In
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '24px' }}>
                New member?{' '}
                <a href="/register" style={{ color: '#3498db', fontWeight: 'bold' }}>
                    Join Susu Group
                </a>
            </p>
        </div>
    );
};

export default Login;