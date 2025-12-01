import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Button from './Button';
import NeonInput from './NeonInput';
import { Target, Edit2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GoalTracker = ({ accountId }) => {
    const { goal, updateGoal, getSummary, accounts, updateAccount } = useData();
    const [isEditing, setIsEditing] = useState(false);

    // Determine initial values based on context (Global vs Account)
    const currentAccount = accountId ? accounts.find(a => a.id === accountId) : null;

    // State for editing
    const [tempGoalAmount, setTempGoalAmount] = useState(0);
    const [tempGoalName, setTempGoalName] = useState('');

    // Initialize state when entering edit mode or when dependencies change
    useEffect(() => {
        if (accountId && currentAccount) {
            setTempGoalAmount(currentAccount.goal || 0);
            setTempGoalName('Meta da Mesa'); // Fixed name for account goals usually, or allow editing? User just wants "Meta da Mesa".
        } else {
            setTempGoalAmount(goal.amount);
            setTempGoalName(goal.name);
        }
    }, [accountId, currentAccount, goal, isEditing]);

    const { totalResult, remaining, progress, isGoalMet } = getSummary(accountId);

    const handleSave = () => {
        if (accountId) {
            updateAccount(accountId, { goal: tempGoalAmount });
        } else {
            updateGoal({ amount: tempGoalAmount, name: tempGoalName });
        }
        setIsEditing(false);
    };

    // Title logic
    const title = accountId ? 'Meta da Mesa' : (goal.name || 'Objetivo Financeiro');
    const subtitle = accountId ? 'Progresso individual desta conta' : 'Progresso baseado em saques realizados';

    return (
        <Card className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="flex-center" style={{
                        width: '50px', height: '50px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(123, 67, 151, 0.2), rgba(220, 36, 48, 0.2))',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 0 15px rgba(123, 67, 151, 0.3)'
                    }}>
                        <Target size={24} color="#fff" style={{ filter: 'drop-shadow(0 0 5px #a855f7)' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                            {title}
                        </h3>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                            {subtitle}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="hover-neon"
                    style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }}
                >
                    <Edit2 size={18} />
                </button>
            </div>

            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!accountId && (
                        <NeonInput
                            label="Nome do Objetivo"
                            type="text"
                            value={tempGoalName}
                            onChange={(e) => setTempGoalName(e.target.value)}
                            placeholder="Ex: Comprar Carro"
                        />
                    )}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <NeonInput
                            label="Valor da Meta (R$)"
                            type="number"
                            value={tempGoalAmount}
                            onChange={(e) => setTempGoalAmount(e.target.value)}
                            placeholder="Ex: 50000"
                        />
                        <Button onClick={handleSave} style={{ marginBottom: '2px' }}>Salvar</Button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-end' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Progresso</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: isGoalMet ? '#00d2ff' : 'white', textShadow: isGoalMet ? '0 0 10px rgba(0,210,255,0.5)' : 'none' }}>
                            {progress.toFixed(1)}%
                        </span>
                    </div>

                    <div style={{ width: '100%', height: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{
                                height: '100%',
                                background: isGoalMet
                                    ? 'linear-gradient(90deg, #00d2ff, #3a7bd5)'
                                    : 'linear-gradient(90deg, #a855f7, #dc2430)',
                                borderRadius: '8px',
                                boxShadow: isGoalMet ? '0 0 20px rgba(0,210,255,0.4)' : '0 0 20px rgba(220, 36, 48, 0.4)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                        {/* Main Stats */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Meta Total</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                R$ {accountId ? (currentAccount?.goal || 0).toLocaleString() : Number(goal.amount).toLocaleString()}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Acumulado</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: totalResult > 0 ? '#00d2ff' : 'white' }}>
                                R$ {totalResult.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Falta</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                R$ {remaining.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {isGoalMet && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', color: '#00d2ff' }}
                        >
                            <div style={{ background: '#00d2ff', borderRadius: '50%', padding: '5px', color: '#000' }}>
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <strong style={{ display: 'block' }}>Parabéns! Meta atingida.</strong>
                                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Você atingiu o objetivo desta conta!</span>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </Card>
    );
};

export default GoalTracker;
