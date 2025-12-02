import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', size = 'default', ...props }) => {

    const getStyle = () => {
        switch (variant) {
            case 'secondary':
                return {
                    background: 'var(--color-bg-secondary)',
                    color: 'white',
                    border: '1px solid rgba(123, 67, 151, 0.3)'
                };
            case 'outline':
                return {
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white'
                };
            default:
                return {};
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm':
                return { padding: '10px 20px', fontSize: '0.95rem' };
            case 'lg':
                return { padding: '18px 36px', fontSize: '1.2rem' };
            default:
                return { padding: '14px 28px', fontSize: '1.05rem' };
        }
    };

    // For primary variant, use glass button effect
    if (variant === 'primary') {
        return (
            <div className={`glass-button-wrap ${className}`}>
                <button
                    className="glass-button"
                    onClick={onClick}
                    style={{
                        ...getSizeStyle(),
                        ...props.style
                    }}
                    {...props}
                >
                    <span className="glass-button-text">
                        {children}
                    </span>
                </button>
                <div className="glass-button-shadow"></div>
            </div>
        );
    }

    // For other variants, use regular button
    return (
        <button
            onClick={onClick}
            style={{
                ...getSizeStyle(),
                borderRadius: '9999px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                ...getStyle(),
                ...props.style
            }}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
