import React from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import { Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

const RecentActivity = () => {
    const { logs, accounts } = useData();

    // Get last 5 logs
    const recentLogs = [...logs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const getAccountName = (id) => {
        const account = accounts.find(a => a.id === id);
        return account ? account.name : 'Desconhecida';
    };

    return (
        <Card className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Clock size={20} color="#a855f7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Últimas Movimentações</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Data</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Mesa</th>
                            <th style={{ textAlign: 'right', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentLogs.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)' }}>
                                    Nenhuma atividade recente.
                                </td>
                            </tr>
                        ) : (
                            recentLogs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '15px 12px', fontSize: '0.9rem' }}>
                                        {(() => {
                                            if (!log.date) return '-';
                                            const [year, month, day] = log.date.split('-');
                                            return `${day}/${month}`;
                                        })()}
                                    </td>
                                    <td style={{ padding: '15px 12px' }}>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {getAccountName(log.accountId)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 12px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', fontWeight: 'bold', color: log.amount >= 0 ? '#00d2ff' : '#dc2430' }}>
                                            {log.amount >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            R$ {Math.abs(log.amount).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default RecentActivity;
