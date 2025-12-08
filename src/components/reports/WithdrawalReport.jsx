import React, { useState, useMemo } from 'react';
import Card from '../Card';
import ExportButton from './ExportButton';
import { useReportData } from '../../hooks/useReportData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Percent, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const WithdrawalReport = () => {
    const { withdrawals, accounts, goal } = useReportData();
    const [selectedAccountId, setSelectedAccountId] = useState('all');

    // Filter withdrawals by selected account
    const filteredWithdrawals = useMemo(() => {
        if (selectedAccountId === 'all') {
            return withdrawals;
        }
        return withdrawals.filter(w =>
            (w.accountId || w.account_id) === selectedAccountId
        );
    }, [withdrawals, selectedAccountId]);

    // Calculate totals based on filtered data
    const totalGross = filteredWithdrawals.reduce((acc, w) => acc + Number(w.grossAmount || w.gross_amount || 0), 0);
    const totalNet = filteredWithdrawals.reduce((acc, w) => acc + Number(w.netAmount || w.net_amount || 0), 0);
    const totalTax = totalGross - totalNet;
    const goalProgress = goal.amount > 0 ? (totalNet / goal.amount) * 100 : 0;

    // Group by month using filtered data
    const monthlyData = {};
    filteredWithdrawals.forEach(w => {
        const month = format(new Date(w.date), 'MM/yyyy');
        if (!monthlyData[month]) {
            monthlyData[month] = { gross: 0, net: 0 };
        }
        monthlyData[month].gross += Number(w.grossAmount || w.gross_amount || 0);
        monthlyData[month].net += Number(w.netAmount || w.net_amount || 0);
    });

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        gross: data.gross,
        net: data.net
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                        Relatório de Saques
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Histórico e análise de retiradas</p>
                </div>
                <ExportButton
                    data={{ withdrawals: filteredWithdrawals, accounts }}
                    reportType="withdrawals"
                    reportTitle="Relatório de Saques"
                />
            </div>

            {/* Account Selector */}
            <Card>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    Selecionar Mesa
                </label>
                <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="all" style={{ background: '#1a1a2e', color: 'white' }}>
                        Todas as Mesas
                    </option>
                    {accounts.map(account => (
                        <option
                            key={account.id}
                            value={account.id}
                            style={{ background: '#1a1a2e', color: 'white' }}
                        >
                            {account.name}
                        </option>
                    ))}
                </select>
            </Card>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <Card style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <DollarSign size={20} color="#10b981" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Bruto</p>
                    </div>
                    <h3 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>
                        R$ {totalGross.toFixed(2)}
                    </h3>
                </Card>

                <Card style={{ background: 'linear-gradient(145deg, rgba(0, 210, 255, 0.1) 0%, rgba(0, 210, 255, 0.05) 100%)', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <TrendingUp size={20} color="#00d2ff" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Líquido</p>
                    </div>
                    <h3 style={{ color: '#00d2ff', fontSize: '2rem', fontWeight: 'bold' }}>
                        R$ {totalNet.toFixed(2)}
                    </h3>
                </Card>

                <Card style={{ background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Percent size={20} color="#ef4444" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total em Impostos</p>
                    </div>
                    <h3 style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 'bold' }}>
                        R$ {totalTax.toFixed(2)}
                    </h3>
                </Card>

                <Card style={{ background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Calendar size={20} color="#a855f7" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>% do Objetivo</p>
                    </div>
                    <h3 style={{ color: '#a855f7', fontSize: '2rem', fontWeight: 'bold' }}>
                        {goalProgress.toFixed(1)}%
                    </h3>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                    Histórico de Saques por Mês
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="month"
                            stroke="rgba(255,255,255,0.5)"
                            style={{ fontSize: '0.85rem' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            style={{ fontSize: '0.85rem' }}
                            tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            formatter={(value) => `R$ ${value.toFixed(2)}`}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="gross"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                            name="Valor Bruto"
                        />
                        <Line
                            type="monotone"
                            dataKey="net"
                            stroke="#00d2ff"
                            strokeWidth={2}
                            dot={{ fill: '#00d2ff', r: 4 }}
                            name="Valor Líquido"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Detailed Table */}
            <Card>
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                    Histórico Detalhado
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '15px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Data</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Mesa</th>
                                <th style={{ padding: '15px', textAlign: 'right', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Valor Bruto</th>
                                <th style={{ padding: '15px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Imposto</th>
                                <th style={{ padding: '15px', textAlign: 'right', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Valor Líquido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                        {selectedAccountId === 'all'
                                            ? 'Nenhum saque registrado ainda'
                                            : 'Nenhum saque registrado para esta mesa'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                filteredWithdrawals.map((withdrawal, index) => {
                                    const account = accounts.find(a => a.id === withdrawal.accountId || a.id === withdrawal.account_id);

                                    return (
                                        <tr key={withdrawal.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px', color: 'white' }}>
                                                {new Date(withdrawal.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '15px', color: 'rgba(255,255,255,0.8)' }}>
                                                {account?.name || 'N/A'}
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>
                                                R$ {Number(withdrawal.grossAmount || withdrawal.gross_amount).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'center', color: '#ef4444' }}>
                                                {Number(withdrawal.taxPercentage || withdrawal.tax_percentage)}%
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'right', color: '#00d2ff', fontWeight: 'bold' }}>
                                                R$ {Number(withdrawal.netAmount || withdrawal.net_amount).toFixed(2)}
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

export default WithdrawalReport;
