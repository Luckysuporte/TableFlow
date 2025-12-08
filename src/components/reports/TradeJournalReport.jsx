import React, { useState } from 'react';
import Card from '../Card';
import ExportButton from './ExportButton';
import { useReportData } from '../../hooks/useReportData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

const TradeJournalReport = () => {
    const { logs, accounts } = useReportData();
    const [filterAccount, setFilterAccount] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'positive', 'negative'
    const [searchDate, setSearchDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter logs
    const filteredLogs = logs.filter(log => {
        const matchesAccount = filterAccount === 'all' || log.accountId === filterAccount || log.account_id === filterAccount;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'positive' && Number(log.amount) > 0) ||
            (filterStatus === 'negative' && Number(log.amount) < 0);
        const matchesDate = !searchDate || log.date.includes(searchDate);

        return matchesAccount && matchesStatus && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Chart data - Results by day
    const dailyResults = {};
    logs.forEach(log => {
        const date = format(new Date(log.date), 'dd/MM');
        if (!dailyResults[date]) {
            dailyResults[date] = 0;
        }
        dailyResults[date] += Number(log.amount);
    });

    const dailyChartData = Object.entries(dailyResults)
        .slice(-15)
        .map(([date, value]) => ({ date, value }));

    // Donut data - Positive vs Negative days
    const positiveDays = logs.filter(l => Number(l.amount) > 0).length;
    const negativeDays = logs.filter(l => Number(l.amount) < 0).length;

    const donutData = [
        { name: 'Dias Positivos', value: positiveDays, color: '#10b981' },
        { name: 'Dias Negativos', value: negativeDays, color: '#ef4444' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                        Diário de Trades
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Registro completo de todas as operações</p>
                </div>
                <ExportButton
                    data={{ logs: filteredLogs, accounts }}
                    reportType="trades"
                    reportTitle="Diário de Trades"
                />
            </div>

            {/* Filters */}
            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <Filter size={14} style={{ display: 'inline', marginRight: '5px' }} />
                            Mesa
                        </label>
                        <select
                            value={filterAccount}
                            onChange={(e) => { setFilterAccount(e.target.value); setCurrentPage(1); }}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="all" style={{ background: '#1a1a2e' }}>Todas as Mesas</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id} style={{ background: '#1a1a2e' }}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <Filter size={14} style={{ display: 'inline', marginRight: '5px' }} />
                            Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="all" style={{ background: '#1a1a2e' }}>Todos</option>
                            <option value="positive" style={{ background: '#1a1a2e' }}>Positivos</option>
                            <option value="negative" style={{ background: '#1a1a2e' }}>Negativos</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <Search size={14} style={{ display: 'inline', marginRight: '5px' }} />
                            Data
                        </label>
                        <input
                            type="date"
                            value={searchDate}
                            onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>
            </Card>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {/* Bar Chart */}
                <Card>
                    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>
                        Resultados por Dia (Últimos 15 dias)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dailyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="date"
                                stroke="rgba(255,255,255,0.5)"
                                style={{ fontSize: '0.75rem' }}
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
                                formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Resultado']}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {dailyChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Donut Chart */}
                <Card>
                    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>
                        Dias Positivos vs Negativos
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '15px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Data</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Mesa</th>
                                <th style={{ padding: '15px', textAlign: 'right', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Resultado</th>
                                <th style={{ padding: '15px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.map((log, index) => {
                                const amount = Number(log.amount);
                                const account = accounts.find(a => a.id === log.accountId || a.id === log.account_id);

                                return (
                                    <tr key={log.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px', color: 'white' }}>
                                            {new Date(log.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td style={{ padding: '15px', color: 'rgba(255,255,255,0.8)' }}>
                                            {account?.name || 'N/A'}
                                        </td>
                                        <td style={{
                                            padding: '15px',
                                            textAlign: 'right',
                                            color: amount >= 0 ? '#10b981' : '#ef4444',
                                            fontWeight: 'bold'
                                        }}>
                                            R$ {amount.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            {amount >= 0 ? (
                                                <TrendingUp size={20} color="#10b981" />
                                            ) : (
                                                <TrendingDown size={20} color="#ef4444" />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 16px',
                                background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(0, 210, 255, 0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : 'white',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Anterior
                        </button>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 16px',
                                background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(0, 210, 255, 0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TradeJournalReport;
