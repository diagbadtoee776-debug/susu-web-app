import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatusCard from '../components/StatusCard';

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [myStatus, setMyStatus] = useState(null);
    const [groupProgress, setGroupProgress] = useState({ total: 0, paid: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Get my payment status
            const statusRes = await api.get(`/payments/status/${user.id}`);
            setMyStatus(statusRes.data);
            
            // Get group progress
            const progressRes = await api.get('/cycles/progress');
            setGroupProgress(progressRes.data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

    const progressPercent = groupProgress.total > 0 
        ? Math.round((groupProgress.paid / groupProgress.total) * 100) 
        : 0;

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Hello, {user?.username}!</h1>
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
            
            {/* My Status Card */}
            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>
                    My Status This Week
                </h2>
                {myStatus ? (
                    <StatusCard 
                        status={myStatus.hasPaid ? 'paid' : 'pending'} 
                        name="You" 
                        amount={myStatus.amount || '50'} 
                    />
                ) : (
                    <p>No payment recorded for this cycle yet.</p>
                )}
            </section>
            
            {/* Group Progress Bar */}
            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '8px' }}>
                    Group Progress 📊
                </h2>
                <div style={{ 
                    backgroundColor: '#ecf0f1', 
                    borderRadius: '12px', 
                    height: '32px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                }}>
                    <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: '#2ecc71',
                        transition: 'width 0.5s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: progressPercent > 0 ? '40px' : '0'
                    }}>
                        {progressPercent > 0 && `${progressPercent}%`}
                    </div>
                </div>
                <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
                    {groupProgress.paid} of {groupProgress.total} members have paid
                </p>
            </section>
            
            {/* My Payment History */}
            <section>
                <h2 style={{ borderBottom: '2px solid #9b59b6', paddingBottom: '8px' }}>
                    My History 📜
                </h2>
                {myStatus?.history?.length > 0 ? (
                    myStatus.history.map((record, index) => (
                        <div key={index} style={{ 
                            padding: '12px', 
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <span>Week {record.week}</span>
                            <span style={{ color: record.type === 'Collection' ? '#2ecc71' : '#e74c3c' }}>
                                {record.type === 'Collection' ? '🍲 Collected' : '⏳ Waiting'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#7f8c8d' }}>No history yet.</p>
                )}
            </section>
        </div>
    );
};

export default UserDashboard;