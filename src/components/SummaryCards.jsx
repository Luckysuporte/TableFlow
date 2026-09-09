import React from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import { Monitor, Bell, AlertTriangle, CheckCircle, Wallet, Trophy, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const ActiveTablesCard = () => {
    const { accounts } = useData();
    const realCount = accounts.filter(a => a.type === 'real').length;
    const demoCount = accounts.filter(a => a.type === 'demo').length;
    const totalCount = accounts.length;

    return (
        <Card className="glass-card" style={{ height: '100%', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.12)', color: '#00d2ff' }}>
                        <Monitor size={18} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Mesas Ativas</h3>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Total: {totalCount} {totalCount === 1 ? 'conta' : 'contas'}</span>
                    </div>
                </div>

                <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(0, 210, 255, 0.1)',
                    color: '#00d2ff',
                    border: '1px solid rgba(0, 210, 255, 0.25)',
                    fontWeight: '600'
                }}>
                    Em Operação
                </span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '10px',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ textAlign: 'center', padding: '4px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#00d2ff', textShadow: '0 0 10px rgba(0,210,255,0.3)' }}>
                        {realCount}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                        Contas Reais
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '4px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#a855f7', textShadow: '0 0 10px rgba(168,85,247,0.3)' }}>
                        {demoCount}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                        Contas Demo
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const TopAccountsCard = () => {
    const { getOverviewKPIs, privacyMode } = useData();
    const { accountsPerformance } = getOverviewKPIs();

    const topThree = (accountsPerformance || []).slice(0, 3);

    return (
        <Card className="glass-card" style={{ height: '100%', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <Trophy size={18} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Destaques do Mês</h3>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Melhor performance</span>
                    </div>
                </div>

                <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    fontWeight: '600'
                }}>
                    Ranking
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topThree.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '15px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        Nenhuma conta com trades este mês.
                    </div>
                ) : (
                    topThree.map((acc, index) => {
                        const isGain = acc.monthProfit >= 0;
                        const symbol = acc.currency === 'USD' ? '$' : 'R$';
                        const medals = ['🥇', '🥈', '🥉'];

                        return (
                            <div
                                key={acc.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{medals[index]}</span>
                                    <div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white', display: 'block' }}>
                                            {acc.name}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                                            {acc.tradesCount} {acc.tradesCount === 1 ? 'pregão' : 'pregões'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.88rem',
                                        fontWeight: 'bold',
                                        color: isGain ? '#00d2ff' : '#dc2430',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2px',
                                        justifyContent: 'flex-end'
                                    }}>
                                        {isGain ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {privacyMode ? (
                                            `${isGain ? '+' : ''}${symbol} ${acc.monthProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                        ) : '••••••'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

export const AlertsCard = () => {
    const { getSummary, withdrawals } = useData();
    const { isGoalMet, remaining } = getSummary();

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
        <Card className="glass-card" style={{ height: '100%', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(220, 36, 48, 0.1)', color: '#dc2430' }}>
                    <Bell size={18} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Alertas</h3>
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
    const { withdrawals, accounts, logs, privacyMode } = useData();

    // Calculate Total Withdrawn
    const totalWithdrawn = withdrawals.reduce((acc, w) => acc + Number(w.netAmount || w.net_amount || 0), 0);

    // Calculate Total Available (Sum of available balance from all REAL accounts)
    const realAccounts = accounts.filter(a => a.type === 'real');

    const totalAvailable = realAccounts.reduce((acc, account) => {
        const initial = Number(account.initial_balance || 0);
        const accountLogs = logs.filter(l => l.accountId === account.id || l.account_id === account.id);
        const accountProfit = accountLogs.reduce((sum, log) => sum + Number(log.amount || 0), 0);
        const accountWithdrawals = withdrawals.filter(w => w.accountId === account.id || w.account_id === account.id);
        const accountWithdrawn = accountWithdrawals.reduce((sum, w) => sum + Number(w.grossAmount || w.gross_amount || 0), 0);
        const available = initial + accountProfit - accountWithdrawn;
        return acc + (available > 0 ? available : 0);
    }, 0);

    return (
        <Card className="glass-card" style={{ height: '100%', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    <Wallet size={18} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Gestão de Saque</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Total Sacado</span>
                    <span style={{ fontWeight: 'bold', color: '#dc2430', fontSize: '1.1rem' }}>
                        {privacyMode ? `R$ ${totalWithdrawn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••'}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Disponível</span>
                    <span style={{ fontWeight: 'bold', color: '#00d2ff', fontSize: '1.1rem' }}>
                        {privacyMode ? `R$ ${totalAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••'}
                    </span>
                </div>
            </div>
        </Card>
    );
};
