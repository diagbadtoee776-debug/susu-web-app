import React from 'react';

const UserDashboard = () => {
  const fullName = localStorage.getItem('fullName') || 'User';

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Welcome, {fullName}!</h2>
      <p>You are logged in as a regular member.</p>
      <p>Your payment status and history will appear here soon.</p>
      
      <button 
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;