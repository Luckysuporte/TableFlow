import React from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import { Monitor, Bell, AlertTriangle, CheckCircle, Wallet } from 'lucide-react';

export const ActiveTablesCard = () => {
    const { accounts } = useData();
    const realCount = accounts.filter(a => a.type === 'real').length;
    const demoCount = accounts.filter(a => a.type === 'demo').length;

    return (
        <Card className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff' }}>
                    <Monitor size={18} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Mesas Ativas</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00d2ff', textShadow: '0 0 10px rgba(0,210,255,0.3)' }}>{realCount}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Reais</div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a855f7', textShadow: '0 0 10px rgba(168,85,247,0.3)' }}>{demoCount}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Demo</div>
                </div>
            </div>
        </Card>
    );
};

export const AlertsCard = () => {
    const { getSummary, withdrawals } = useData();
    const { isGoalMet, remaining } = getSummary();

    // Simple alert logic
    const alerts = [];
    if (isGoalMet) {
        alerts.push({ type: 'success', message: 'Meta global atingida!', icon: <CheckCircle size={16} /> });
    } else if (remaining < 1000 && remaining > 0) {
        alerts.push({ type: 'warning', message: 'Falta pouco para a meta!', icon: <AlertTriangle size={16} /> });
    }

    if (withdrawals.length > 0) {
        const lastWithdrawal = withdrawals[withdrawals.length - 1];
        const daysSince = Math.floor((new Date() - new Date(lastWithdrawal.date)) / (1000 * 60 * 60 * 24));
        if (daysSince < 3) {
            alerts.push({ type: 'info', message: 'Saque recente registrado.', icon: <Bell size={16} /> });
        }
    }

    if (alerts.length === 0) {
        alerts.push({ type: 'neutral', message: 'Tudo tranquilo por aqui.', icon: <CheckCircle size={16} /> });
    }

    return (
        <Card className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(220, 36, 48, 0.1)', color: '#dc2430' }}>
                    <Bell size={18} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Alertas</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.slice(0, 2).map((alert, index) => (
                    <div key={index} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '0.85rem'
                    }}>
                        <span style={{
                            color: alert.type === 'success' ? '#00d2ff' : alert.type === 'warning' ? '#f59e0b' : alert.type === 'info' ? '#a855f7' : 'gray'
                        }}>
                            {alert.icon}
                        </span>
                        <span>{alert.message}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const WithdrawalSummaryCard = () => {
    const { withdrawals, accounts, logs } = useData();

    // Calculate Total Withdrawn
    const totalWithdrawn = withdrawals.reduce((acc, w) => acc + Number(w.netAmount), 0);

    // Calculate Total Available (Sum of available balance from all REAL accounts)
    const realAccounts = accounts.filter(a => a.type === 'real');

    const totalAvailable = realAccounts.reduce((acc, account) => {
        const accountLogs = logs.filter(l => l.accountId === account.id);
        const accountProfit = accountLogs.reduce((sum, log) => sum + Number(log.amount), 0);

        const accountWithdrawals = withdrawals.filter(w => w.accountId === account.id);
        const accountWithdrawn = accountWithdrawals.reduce((sum, w) => sum + Number(w.grossAmount), 0);

        const available = accountProfit - accountWithdrawn;
        return acc + (available > 0 ? available : 0);
    }, 0);

    return (
        <Card className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    <Wallet size={18} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Gestão de Saque</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Total Sacado</span>
                    <span style={{ fontWeight: 'bold', color: '#dc2430', fontSize: '1.1rem' }}>R$ {totalWithdrawn.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Disponível</span>
                    <span style={{ fontWeight: 'bold', color: '#00d2ff', fontSize: '1.1rem' }}>R$ {totalAvailable.toLocaleString()}</span>
                </div>
            </div>
        </Card>
    );
};
