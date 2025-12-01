import React from 'react';

const NeonInput = ({ label, type = 'text', value, onChange, placeholder, required, inputMode, ...props }) => {
    return (
        <div style={{ marginBottom: '24px', width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                inputMode={inputMode}
                style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(139, 92, 246, 0)',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(139, 92, 246, 0.8)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.3)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(139, 92, 246, 0)';
                }}
                {...props}
            />
            <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
        </div>
    );
};

export default NeonInput;
