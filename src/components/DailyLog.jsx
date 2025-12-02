import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Button from './Button';
import NeonInput from './NeonInput';
import { Calendar, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const DailyLog = ({ accountId }) => {
    const { logs, addLog, deleteLog } = useData();
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [amount, setAmount] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Filter logs for this specific account
    const accountLogs = logs.filter(log => log.accountId === accountId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !accountId) return;

        addLog({
            date,
            amount: parseFloat(amount),
            accountId,
            type: parseFloat(amount) >= 0 ? 'profit' : 'loss'
        });

        setAmount('');
        setShowForm(false);
    };

    const positiveDays = accountLogs.filter(l => l.amount > 0).length;
    const negativeDays = accountLogs.filter(l => l.amount < 0).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)' }}>
                            <Calendar size={20} />
                        </div>
                        <h3>Pregões Diários</h3>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} variant="secondary" style={{ padding: '8px 16px' }}>
                        <Plus size={16} /> Novo Registro
                    </Button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <NeonInput
                                label="Data"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                            <NeonInput
                                label="Resultado (R$)"
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ex: 500 ou -200"
                                required
                            />
                        </div>
                        <Button type="submit" style={{ width: '100%', marginTop: '15px', padding: '12px 24px', fontSize: '1rem', background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none', height: '54px' }}>Adicionar Resultado</Button>
                    </form>
                )}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, background: 'rgba(0, 210, 255, 0.1)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={16} color="#00d2ff" />
                        <span style={{ fontSize: '0.9rem' }}>Dias Positivos: <strong>{positiveDays}</strong></span>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(220, 36, 48, 0.1)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingDown size={16} color="#dc2430" />
                        <span style={{ fontSize: '0.9rem' }}>Dias Negativos: <strong>{negativeDays}</strong></span>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)' }}>Data</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Resultado</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Nenhum registro ainda.</td>
                                </tr>
                            ) : (
                                accountLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px' }}>
                                            {(() => {
                                                if (!log.date) return '-';
                                                // Handle YYYY-MM-DD string directly to avoid timezone issues
                                                const [year, month, day] = log.date.split('-');
                                                return `${day}/${month}/${year}`;
                                            })()}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: log.amount >= 0 ? '#00d2ff' : '#dc2430' }}>
                                            R$ {log.amount.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            {log.amount >= 0 ? (
                                                <span style={{ background: 'rgba(0, 210, 255, 0.2)', color: '#00d2ff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>WIN</span>
                                            ) : (
                                                <span style={{ background: 'rgba(220, 36, 48, 0.2)', color: '#dc2430', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>LOSS</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => deleteLog(log.id)}
                                                style={{ background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DailyLog;
