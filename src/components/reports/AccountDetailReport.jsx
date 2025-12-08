import React, { useState } from 'react';
import Card from '../Card';
import ExportButton from './ExportButton';
import { useReportData } from '../../hooks/useReportData';
import { BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Monitor, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

const AccountDetailReport = () => {
    const { accounts, calculateAccountMetrics } = useReportData();
    const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || null);

    if (!selectedAccountId || accounts.length === 0) {
        return (
            <Card>
                <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '40px' }}>
                    Nenhuma mesa cadastrada. Adicione uma mesa para visualizar relatórios detalhados.
                </p>
            </Card>
        );
    }

    const metrics = calculateAccountMetrics(selectedAccountId);
    const selectedAccount = accounts.find(a => a.id === selectedAccountId);

    // Prepare data for charts
    const distributionData = [
        { name: 'Ganhos', value: metrics.positiveDays, color: '#10b981' },
        { name: 'Perdas', value: metrics.negativeDays, color: '#ef4444' }
    ];

    const radarData = [
        { metric: 'Win Rate', value: metrics.winRate, fullMark: 100 },
        { metric: 'Consistência', value: metrics.totalDays > 0 ? (metrics.totalDays / 30) * 100 : 0, fullMark: 100 },
        { metric: 'Média Positiva', value: metrics.avgPositive > 0 ? Math.min((metrics.avgPositive / 1000) * 100, 100) : 0, fullMark: 100 },
        { metric: 'Controle de Risco', value: metrics.avgNegative < 0 ? Math.min((Math.abs(metrics.avgNegative) / 1000) * 100, 100) : 100, fullMark: 100 }
    ];

    const dailyResults = metrics.logs
        .slice(0, 30)
        .reverse()
        .map(log => ({
            date: new Date(log.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            value: Number(log.amount)
        }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                        Relatório Detalhado por Mesa
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Análise completa de performance individual</p>
                </div>
                <ExportButton
                    data={{ ...metrics, accounts }}
                    reportType="account"
                    reportTitle={`Relatório - ${selectedAccount?.name}`}
                />
            </div>

            {/* Account Selector */}
            <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontSize: '0.9rem' }}>
                    Selecionar Mesa
                </label>
                <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    {accounts.map(account => (
                        <option key={account.id} value={account.id} style={{ background: '#1a1a2e' }}>
                            {account.name} - #{account.number}
                        </option>
                    ))}
                </select>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <Card style={{ background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Calendar size={20} color="#a855f7" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total de Dias</p>
                    </div>
                    <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>{metrics.totalDays}</h3>
                </Card>

                <Card style={{ background: 'linear-gradient(145deg, rgba(0, 210, 255, 0.1) 0%, rgba(0, 210, 255, 0.05) 100%)', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <TrendingUp size={20} color="#00d2ff" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Total Acumulado</p>
                    </div>
                    <h3 style={{ color: '#00d2ff', fontSize: '2rem', fontWeight: 'bold' }}>
                        R$ {metrics.totalAmount.toFixed(2)}
                    </h3>
                </Card>

                <Card style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Target size={20} color="#10b981" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Média por Pregão</p>
                    </div>
                    <h3 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>
                        R$ {metrics.averagePerDay.toFixed(2)}
                    </h3>
                </Card>

                <Card style={{ background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Monitor size={20} color="#f59e0b" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Win Rate</p>
                    </div>
                    <h3 style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 'bold' }}>
                        {metrics.winRate.toFixed(1)}%
                    </h3>
                </Card>
            </div>

            {/* Daily Results Chart */}
            <Card>
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                    Resultado Diário (Últimos 30 dias)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyResults}>
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
                        <Bar
                            dataKey="value"
                            fill="#a855f7"
                            radius={[8, 8, 0, 0]}
                        >
                            {dailyResults.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Distribution and Radar Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Pie Chart */}
                <Card>
                    <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                        Distribuição Ganhos vs Perdas
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {distributionData.map((entry, index) => (
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

                {/* Radar Chart */}
                <Card>
                    <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                        Radar de Consistência
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                            <PolarAngleAxis
                                dataKey="metric"
                                stroke="rgba(255,255,255,0.7)"
                                style={{ fontSize: '0.85rem' }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                stroke="rgba(255,255,255,0.5)"
                            />
                            <Radar
                                name="Performance"
                                dataKey="value"
                                stroke="#00d2ff"
                                fill="#00d2ff"
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                                formatter={(value) => `${value.toFixed(1)}%`}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Detailed Stats */}
            <Card>
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                    Estatísticas Detalhadas
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '8px' }}>Dias Positivos</p>
                        <p style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.positiveDays}</p>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '8px' }}>Dias Negativos</p>
                        <p style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.negativeDays}</p>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '8px' }}>Média Positiva</p>
                        <p style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>R$ {metrics.avgPositive.toFixed(2)}</p>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '8px' }}>Média Negativa</p>
                        <p style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold' }}>R$ {metrics.avgNegative.toFixed(2)}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AccountDetailReport;
