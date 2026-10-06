import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatusCard from '../components/StatusCard';
import PaymentButton from '../components/PaymentButton';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [nextToEat, setNextToEat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all members with payment status
            const membersRes = await api.get('/users/members');
            setMembers(membersRes.data);
            
            // Fetch eligible members to eat next
            const nextRes = await api.get('/cycles/next-to-eat');
            setNextToEat(nextRes.data.eligibleMembers || []);
        } catch (err) {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleRecordPayment = async (userId) => {
        try {
            await api.post('/payments', {
                userId,
                amount: 50, // Default amount - can be made configurable
                paymentDate: new Date().toISOString().split('T')[0]
            });
            fetchData(); // Refresh data after payment
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to record payment.');
        }
    };

    const handleRecordEat = async (userId) => {
        if (!window.confirm(`Mark ${userId} as collecting the pot? This will reset the cycle.`)) {
            return;
        }
        
        try {
            await api.post('/cycles/eat', {
                userId,
                eatDate: new Date().toISOString().split('T')[0]
            });
            fetchData(); // Refresh data after eating
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to record collection.');
        }
    };

    if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '24px', color: '#c00' }}>{error}</div>;

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Admin Dashboard</h1>
                <button 
                    onClick={logout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Sign Out
                </button>
            </div>
            
            {/* Next to Eat Section */}
            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>
                    Who Eats Next? 
                </h2>
                {nextToEat.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>All members have eaten this cycle.</p>
                ) : (
                    nextToEat.map(member => (
                        <div key={member.UserID} style={{ marginBottom: '16px' }}>
                            <StatusCard 
                                status="pending" 
                                name={member.Username} 
                                amount="50" 
                            />
                            <PaymentButton 
                                onClick={() => handleRecordEat(member.UserID)}
                                label="🍲 Collect Pot"
                            />
                        </div>
                    ))
                )}
            </section>
            
            {/* Members Payment Status */}
            <section>
                <h2 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '8px' }}>
                    Member Payments 💰
                </h2>
                {members.map(member => (
                    <div key={member.UserID} style={{ marginBottom: '16px' }}>
                        <StatusCard 
                            status={member.hasPaid ? 'paid' : 'pending'} 
                            name={member.Username} 
                            amount={member.amount || '50'} 
                        />
                        {!member.hasPaid && (
                            <PaymentButton 
                                onClick={() => handleRecordPayment(member.UserID)}
                                label="✅ Mark as Paid"
                            />
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default AdminDashboard;