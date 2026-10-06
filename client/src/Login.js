import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Determine endpoint and payload based on mode
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignup 
        ? { fullName, email, password }
        : { email, password };

      // Send request to backend
      const response = await fetch(`http://10.37.113.23:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      // Handle errors from server
      if (!response.ok) {
        alert(data.error || 'Something went wrong.');
        return;
      }

      if (isSignup) {
        // ✅ REGISTRATION SUCCESS → Switch to login mode
        alert('Account created successfully! Please log in with your new credentials.');
        setIsSignup(false);
        setFullName('');
        setPassword('');
      } else {
        // ✅ LOGIN SUCCESS → Save token & redirect by role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('fullName', data.fullName);
        
        alert(`Welcome back, ${data.fullName}!`);
        
        // 🔑 CRITICAL REDIRECT LOGIC - MUST MATCH App.js ROUTES
        if (data.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Server connection failed. Please check your network or ensure the backend is running.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>🔐 Susu {isSignup ? 'Sign Up' : 'Login'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Full Name field only shows during signup */}
        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        )}
        
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}
        </button>
      </form>

      {/* Toggle between Login and Signup */}
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <span 
          onClick={() => setIsSignup(!isSignup)}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          {isSignup ? 'Login here' : 'Sign up here'}
        </span>
      </p>
    </div>
  );
};

export default Login;