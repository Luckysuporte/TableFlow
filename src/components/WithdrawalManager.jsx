import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Button from './Button';
import NeonInput from './NeonInput';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const WithdrawalManager = () => {
    const { withdrawals, addWithdrawal, deleteWithdrawal, accounts, logs } = useData();
    const [amount, setAmount] = useState('');
    const [tax, setTax] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Filter only Real accounts for withdrawal
    const realAccounts = accounts.filter(acc => acc.type === 'real');

    // Calculate available balance for selected account
    const getAccountBalance = (accountId) => {
        if (!accountId) return 0;

        const accountLogs = logs.filter(l => l.accountId === accountId);
        const totalProfit = accountLogs.reduce((acc, log) => acc + Number(log.amount), 0);

        const accountWithdrawals = withdrawals.filter(w => w.accountId === accountId);
        const totalWithdrawn = accountWithdrawals.reduce((acc, w) => acc + Number(w.grossAmount), 0);

        return totalProfit - totalWithdrawn;
    };

    const availableBalance = getAccountBalance(selectedAccountId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !selectedAccountId) return;

        const grossAmount = parseFloat(amount);
        const taxPercentage = tax ? parseFloat(tax) : 0;
        const taxAmount = (grossAmount * taxPercentage) / 100;
        const netAmount = grossAmount - taxAmount;

        addWithdrawal({
            date: new Date().toISOString(),
            grossAmount,
            tax: taxAmount, // Storing the calculated amount in R$
            taxPercentage, // Storing the percentage for reference
            netAmount,
            accountId: selectedAccountId
        });

        setAmount('');
        setTax('');
        setSelectedAccountId('');
        setShowForm(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)' }}>
                            <Wallet size={20} />
                        </div>
                        <h3>Gestão de Saques</h3>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} variant="secondary" style={{ padding: '8px 16px' }}>
                        <Plus size={16} /> Novo Saque
                    </Button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontSize: '0.9rem' }}>Conta de Origem</label>
                                <select
                                    value={selectedAccountId}
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="" style={{ background: '#1a1a1a' }}>Selecione uma conta Real</option>
                                    {realAccounts.map(acc => (
                                        <option key={acc.id} value={acc.id} style={{ background: '#1a1a1a' }}>
                                            {acc.name} (#{acc.number})
                                        </option>
                                    ))}
                                </select>
                                {selectedAccountId && (
                                    <div style={{ marginTop: '8px', fontSize: '0.9rem', color: availableBalance >= 0 ? '#00d2ff' : '#dc2430' }}>
                                        Saldo Disponível: <strong>R$ {availableBalance.toLocaleString()}</strong>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <NeonInput
                                    label="Valor Bruto (R$)"
                                    type="text"
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Ex: 1000"
                                    required
                                />
                                <div>
                                    <NeonInput
                                        label="Taxa da Mesa (%)"
                                        type="text"
                                        inputMode="decimal"
                                        value={tax}
                                        onChange={(e) => setTax(e.target.value)}
                                        placeholder="Ex: 20"
                                    />
                                    {amount && tax && (
                                        <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
                                            Desconto: R$ {((parseFloat(amount) * parseFloat(tax)) / 100).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button type="submit" style={{ width: '100%', marginTop: '15px', background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none' }}>Registrar Saque</Button>
                    </form>
                )}

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)' }}>Data</th>
                                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)' }}>Conta</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Bruto</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Líquido</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Nenhum saque registrado.</td>
                                </tr>
                            ) : (
                                withdrawals.sort((a, b) => new Date(b.date) - new Date(a.date)).map(w => {
                                    const account = accounts.find(acc => acc.id === w.accountId);
                                    return (
                                        <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '12px' }}>{format(new Date(w.date), 'dd/MM/yyyy')}</td>
                                            <td style={{ padding: '12px' }}>
                                                {account ? (
                                                    <span style={{ color: '#00d2ff' }}>{account.name}</span>
                                                ) : (
                                                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>Conta excluída</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right', color: 'rgba(255,255,255,0.7)' }}>
                                                R$ {w.grossAmount.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#00d2ff' }}>
                                                R$ {w.netAmount.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => deleteWithdrawal(w.id)}
                                                    style={{ background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default WithdrawalManager;
