import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://10.37.113.23:5000/api/admin/members', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          localStorage.clear();
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div style={{padding: '20px'}}>Loading members...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ 
          padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', 
          border: 'none', borderRadius: '4px', cursor: 'pointer' 
        }}>
          Logout
        </button>
      </div>

      <p>Total Members: {members.length}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Role</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.MemberID}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{member.FullName}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{member.Email}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{member.Role}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {new Date(member.JoinDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;