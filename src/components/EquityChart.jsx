import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, privacyMode }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const daily = Number(data.daily || 0);
        const accumulated = Number(data.accumulated || 0);

        return (
            <div style={{
                background: '#131127',
                border: '1px solid rgba(0, 210, 255, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                color: 'white'
            }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                    Pregão de {data.fullDate || label}
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>No dia: </span>
                    <strong style={{ color: daily >= 0 ? '#00d2ff' : '#dc2430' }}>
                        {privacyMode ? `${daily >= 0 ? '+' : ''}R$ ${daily.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••'}
                    </strong>
                </div>
                <div style={{ fontSize: '0.95rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Acumulado: </span>
                    <strong style={{ color: accumulated >= 0 ? '#10b981' : '#dc2430' }}>
                        {privacyMode ? `${accumulated >= 0 ? '+' : ''}R$ ${accumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••'}
                    </strong>
                </div>
            </div>
        );
    }
    return null;
};

const EquityChart = () => {
    const { getOverviewKPIs, privacyMode } = useData();
    const { equityCurveData, currentMonthStr } = getOverviewKPIs();
    const [period, setPeriod] = useState('month'); // 'month' ou 'all'

    // Filtrar dados conforme o período escolhido
    const filteredData = useMemo(() => {
        if (!equityCurveData || equityCurveData.length === 0) return [];

        if (period === 'month') {
            const monthFiltered = equityCurveData.filter(d => d.fullDate && d.fullDate.startsWith(currentMonthStr));
            // Recalcular o acumulado relativo ao mês
            let monthAccum = 0;
            return monthFiltered.map(d => {
                monthAccum += d.daily;
                return {
                    ...d,
                    accumulated: monthAccum
                };
            });
        }

        return equityCurveData;
    }, [equityCurveData, period, currentMonthStr]);

    const lastAccumulated = filteredData.length > 0 ? filteredData[filteredData.length - 1].accumulated : 0;
    const isPositive = lastAccumulated >= 0;

    return (
        <Card className="glass-card" style={{ padding: '24px', position: 'relative' }}>
            {/* Cabeçalho do Gráfico */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(168, 85, 247, 0.2))',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00d2ff'
                    }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                                Curva de Capital
                            </h3>
                            <span style={{
                                fontSize: '0.8rem',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 36, 48, 0.15)',
                                color: isPositive ? '#10b981' : '#dc2430',
                                fontWeight: 'bold'
                            }}>
                                {privacyMode ? (
                                    `${isPositive ? '+' : ''}R$ ${lastAccumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                ) : '••••••'}
                            </span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                            Evolução consistente do seu lucro acumulado
                        </span>
                    </div>
                </div>

                {/* Alternador de Período */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '4px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <button
                        type="button"
                        onClick={() => setPeriod('month')}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: period === 'month' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                            color: period === 'month' ? 'white' : 'rgba(255,255,255,0.6)',
                            fontSize: '0.82rem',
                            fontWeight: period === 'month' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Mês Atual
                    </button>
                    <button
                        type="button"
                        onClick={() => setPeriod('all')}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: period === 'all' ? 'linear-gradient(135deg, #a855f7, #7b4397)' : 'transparent',
                            color: period === 'all' ? 'white' : 'rgba(255,255,255,0.6)',
                            fontSize: '0.82rem',
                            fontWeight: period === 'all' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Histórico Geral
                    </button>
                </div>
            </div>

            {/* Gráfico Recharts */}
            {filteredData.length === 0 ? (
                <div style={{
                    height: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    gap: '10px'
                }}>
                    <Activity size={32} />
                    <span style={{ fontSize: '0.9rem' }}>Nenhum pregão registrado no período selecionado.</span>
                </div>
            ) : (
                <div style={{ width: '100%', height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="rgba(255,255,255,0.3)"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.3)"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickFormatter={(val) => privacyMode ? `${val >= 0 ? '+' : ''}${val}` : '••'}
                            />
                            <Tooltip content={<CustomTooltip privacyMode={privacyMode} />} />
                            <Area
                                type="monotone"
                                dataKey="accumulated"
                                stroke="#00d2ff"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorAccumulated)"
                                dot={{ fill: '#00d2ff', r: 3, strokeWidth: 1, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#fff', stroke: '#00d2ff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
};

export default EquityChart;
