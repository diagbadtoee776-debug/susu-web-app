import React from 'react';

const StatusCard = ({ status, name, amount }) => {
    const getStatusConfig = () => {
        switch(status) {
            case 'paid': 
                return { icon: '✅', color: '#2ecc71', text: 'Paid' };
            case 'pending': 
                return { icon: '⏳', color: '#f39c12', text: 'Pending' };
            case 'defaulted': 
                return { icon: '❌', color: '#e74c3c', text: 'Missed' };
            default: 
                return { icon: '❓', color: '#95a5a6', text: 'Unknown' };
        }
    };

    const config = getStatusConfig();

    return (
        <div style={{
            border: `2px solid ${config.color}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            backgroundColor: 'white'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{config.icon}</span>
                <div>
                    <h3 style={{ margin: '0 0 4px 0', color: '#2c3e50' }}>{name}</h3>
                    <p style={{ margin: 0, color: config.color, fontWeight: 'bold' }}>
                        {config.text} {amount && `- $${amount}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatusCard;