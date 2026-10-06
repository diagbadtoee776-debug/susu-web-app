import React, { useState, useEffect } from 'react';

const MembersList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Fetch all members with their latest payment status
    fetch('http://localhost:5000/api/auth/members', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setMembers(data))
    .catch(err => console.error('Failed to load members:', err));
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>👥 Group Members</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Transparency builds trust. See who is active.
      </p>

      {members.length === 0 ? (
        <p>Loading members...</p>
      ) : (
        members.map(member => (
          <div key={member.MemberID} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderBottom: '1px solid #eee',
            background: 'white',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            {/* Status Badge */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: member.paidThisWeek ? '#2ecc71' : '#e74c3c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              marginRight: '15px'
            }}>
              {member.paidThisWeek ? '✅' : '⭕'}
            </div>

            {/* Member Info */}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {member.FullName}
              </div>
              <div style={{ color: '#888', fontSize: '14px' }}>
                {member.paidThisWeek ? 'Paid this week' : 'Payment pending'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MembersList;