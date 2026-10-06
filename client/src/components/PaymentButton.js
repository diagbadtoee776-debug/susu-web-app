import React from 'react';

const PaymentButton = ({ onClick, disabled, label = "💰 Pay Now" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: disabled ? '#cccccc' : '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                minHeight: '48px', // Minimum touch target size (SRS §4)
                marginTop: '8px'
            }}
        >
            {label}
        </button>
    );
};

export default PaymentButton;