import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddMember = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://10.37.113.23:5000/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ SUCCESS!\n\nEmail: ${data.loginCredentials.email}\nPassword: ${data.loginCredentials.password}\n\nShare these with the member.`);
        setFullName(''); setEmail(''); setPassword('');
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Ensure backend is running.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <h2>➕ Add New Member</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>For members without phones. Leave email blank to auto-generate.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name *" value={fullName} onChange={e => setFullName(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '10px', fontSize: '16px', boxSizing: 'border-box' }} required />
        <input type="email" placeholder="Email (Optional)" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '10px', fontSize: '16px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password *" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '10px', fontSize: '16px', boxSizing: 'border-box' }} required />
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '20px', fontSize: '16px', boxSizing: 'border-box' }}>
          <option value="User">Regular Member</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" style={{
          width: '100%', padding: '15px', background: '#2ecc71', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
        }}>ADD MEMBER</button>
      </form>
      {message && (
        <div style={{ marginTop: '20px', padding: '15px', background: message.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          borderRadius: '8px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{message}</div>
      )}
      <button onClick={() => navigate('/admin/payment')} style={{
        marginTop: '20px', width: '100%', padding: '12px', background: '#3498db', color: 'white',
        border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
      }}>← Back to Payment Dashboard</button>
    </div>
  );
};

export default AdminAddMember;