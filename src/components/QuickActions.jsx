import React from 'react';
import Card from './Card';
import { Plus, Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions = ({ setActiveTab }) => {
    const actions = [
        {
            label: 'Nova Mesa',
            icon: <Plus size={24} />,
            color: '#a855f7',
            onClick: () => setActiveTab('accounts')
        },
        {
            label: 'Registrar Saque',
            icon: <Upload size={24} />,
            color: '#dc2430',
            onClick: () => setActiveTab('withdrawals')
        },
        {
            label: 'Ver Relatórios',
            icon: <FileText size={24} />,
            color: '#ffffff',
            onClick: () => setActiveTab('overview')
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {actions.map((action, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, translateY: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className="glass-card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        cursor: 'pointer',
                        border: `1px solid ${action.color}30`,
                        background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, ${action.color}10 100%)`,
                        textAlign: 'center',
                        gap: '15px',
                        minHeight: '120px'
                    }}
                >
                    <div style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: `${action.color}20`,
                        color: action.color,
                        boxShadow: `0 0 15px ${action.color}30`
                    }}>
                        {action.icon}
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
                        {action.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
};

export default QuickActions;
