import React, { useState, useEffect } from 'react';

const AdminPayment = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [cycleWeek, setCycleWeek] = useState('1');

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/members', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setMembers(data))
    .catch(err => console.error(err));
  }, []);

  const handleRecordPayment = async () => {
    if (!selectedMember || !amount) return alert('Please fill all fields');
    
    try {
      await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          memberId: selectedMember, 
          amount: parseFloat(amount),
          cycleWeek: parseInt(cycleWeek)
        })
      });
      
      alert('✅ Payment Recorded!');
      setAmount('');
    } catch (err) {
      alert('❌ Failed to record payment');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>💰 Record Payment</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Select Member:</label>
        <select 
          value={selectedMember}
          onChange={e => setSelectedMember(e.target.value)}
          style={{ width: '100%', padding: '12px', marginTop: '5px', fontSize: '16px' }}
        >
          <option value="">-- Choose Member --</option>
          {members.map(m => (
            <option key={m.MemberID} value={m.MemberID}>{m.FullName}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Amount (GHS):</label>
        <input 
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="e.g., 50"
          style={{ width: '100%', padding: '12px', marginTop: '5px', fontSize: '16px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Cycle Week:</label>
        <input 
          type="number"
          value={cycleWeek}
          onChange={e => setCycleWeek(e.target.value)}
          min="1" max="52"
          style={{ width: '100%', padding: '12px', marginTop: '5px', fontSize: '16px' }}
        />
      </div>

      <button 
        onClick={handleRecordPayment}
        style={{
          width: '100%', padding: '15px', background: '#2ecc71', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        RECORD PAYMENT ✅
      </button>
    </div>
  );
};

export default AdminPayment;