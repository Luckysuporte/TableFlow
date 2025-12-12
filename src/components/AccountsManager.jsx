import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Button from './Button';
import NeonInput from './NeonInput';
import DailyLog from './DailyLog';
import GoalTracker from './GoalTracker';
import Card from './Card';
import { Plus, Trash2, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountsManager = () => {
    const { accounts, addAccount, deleteAccount } = useData();
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Form State
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('demo'); // 'demo' or 'real'
    const [accountPhase, setAccountPhase] = useState('1'); // '1' or '2' (only for demo)

    const handleSubmit = (e) => {
        e.preventDefault();
        addAccount({
            number: accountNumber,
            name: accountName,
            type: accountType,
            phase: accountType === 'demo' ? accountPhase : '1', // Real accounts default to phase 1
            createdAt: new Date().toISOString()
        });
        setShowAddForm(false);
        setAccountNumber('');
        setAccountName('');
        setAccountType('demo');
        setAccountPhase('1');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Header / Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Minhas Mesas</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)} style={{ background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none' }}>
                    <Plus size={20} /> Nova Mesa
                </Button>
            </div>

            {/* Add Account Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <Card>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ color: 'white', marginBottom: '10px' }}>Cadastrar Nova Conta</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <NeonInput
                                        label="Número da Conta"
                                        type="number"
                                        inputMode="numeric"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Ex: 123456"
                                        required
                                    />
                                    <NeonInput
                                        label="Nome / Corretora"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Ex: FTMO, MyForexFunds"
                                        required
                                    />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    width: '100%'
                                }}>
                                    <div style={{ width: '100%' }}>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Tipo de Conta</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                type="button"
                                                onClick={() => setAccountType('demo')}
                                                style={{
                                                    flex: 1,
                                                    minWidth: '150px',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: accountType === 'demo' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                                                    background: accountType === 'demo' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Demo (Avaliação)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAccountType('real')}
                                                style={{
                                                    flex: 1,
                                                    minWidth: '150px',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: accountType === 'real' ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                                                    background: accountType === 'real' ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Real (Aprovada)
                                            </button>
                                        </div>
                                    </div>

                                    {accountType === 'demo' && (
                                        <div style={{ width: '100%' }}>
                                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Fase</label>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setAccountPhase('1')}
                                                    style={{
                                                        flex: 1,
                                                        minWidth: '120px',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: accountPhase === '1' ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                                                        background: accountPhase === '1' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    Fase 1
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAccountPhase('2')}
                                                    style={{
                                                        flex: 1,
                                                        minWidth: '120px',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: accountPhase === '2' ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                                                        background: accountPhase === '2' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    Fase 2
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAccountPhase('unica')}
                                                    style={{
                                                        flex: 1,
                                                        minWidth: '120px',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: accountPhase === 'unica' ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                                                        background: accountPhase === 'unica' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    Fase Única
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" style={{ width: '100%', padding: '16px 24px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none' }}>Cadastrar Mesa</Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Accounts List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {accounts.map(account => (
                    <motion.div
                        key={account.id}
                        layoutId={account.id}
                        onClick={() => setSelectedAccount(selectedAccount?.id === account.id ? null : account)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card style={{
                            border: selectedAccount?.id === account.id ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                            background: selectedAccount?.id === account.id ? 'rgba(168, 85, 247, 0.05)' : 'var(--glass-bg)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: account.type === 'real' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Monitor size={20} color={account.type === 'real' ? '#00d2ff' : '#a855f7'} />
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'white', fontWeight: 'bold' }}>{account.name}</h4>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>#{account.number}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteAccount(account.id); }}
                                    style={{ background: 'transparent', color: '#ef4444', padding: '5px' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem',
                                    background: account.type === 'real' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                                    color: account.type === 'real' ? '#00d2ff' : '#a855f7',
                                    border: account.type === 'real' ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)'
                                }}>
                                    {account.type === 'real' ? 'Conta Real' : 'Conta Demo'}
                                </span>
                                {account.type === 'demo' && (
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}>
                                        {account.phase === 'unica' ? 'Fase Única' : `Fase ${account.phase}`}
                                    </span>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Selected Account Details (Daily Log) */}
            <AnimatePresence>
                {selectedAccount && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div style={{ marginBottom: '30px' }}>
                            <GoalTracker accountId={selectedAccount.id} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>
                                Diário de Trades: <span style={{ color: '#a855f7' }}>{selectedAccount.name}</span>
                            </h3>
                        </div>
                        <DailyLog accountId={selectedAccount.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountsManager;
