import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 My Dashboard</h2>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>Status This Week</h3>
        <p style={{ fontSize: '18px', color: '#2ecc71' }}>✅ Payment Recorded</p>
      </div>
      
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
        <h3>Group Progress</h3>
        <p>12 / 15 Members Paid</p>
        <div style={{ height: '10px', background: '#ddd', borderRadius: '5px', marginTop: '10px' }}>
          <div style={{ width: '80%', height: '100%', background: '#2ecc71', borderRadius: '5px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;