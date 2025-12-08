import React, { useState } from 'react';
import Card from '../Card';
import ExportButton from './ExportButton';
import { useReportData } from '../../hooks/useReportData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Award, CalendarRange } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GeneralPerformanceReport = () => {
    const { calculatePerformanceMetrics, calculateStreaks, getEvolutionData, generateInsights } = useReportData();
    const [period, setPeriod] = useState(30);
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const metrics = calculatePerformanceMetrics;
    const streaks = calculateStreaks();
    const evolutionData = getEvolutionData(period);
    const insights = generateInsights();

    const handleCustomPeriod = () => {
        if (customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setPeriod(diffDays);
            setShowCustomPicker(false);
        }
    };

    const MetricCard = ({ icon: Icon, label, value, color, trend }) => (
        <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="glass-card"
            style={{
                padding: '20px',
                borderRadius: '12px',
                border: `1px solid ${color}30`,
                background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, ${color}10 100%)`
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: `${color}20`,
                    color: color
                }}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span style={{
                        fontSize: '0.85rem',
                        color: trend > 0 ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '5px' }}>{label}</p>
                <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</h3>
            </div>
        </motion.div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                        Relatório de Performance Geral
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Visão consolidada do seu desempenho</p>
                </div>
                <ExportButton
                    data={metrics}
                    reportType="performance"
                    reportTitle="Relatório de Performance Geral"
                />
            </div>

            {/* Period Filter */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Hoje button */}
                <button
                    onClick={() => {
                        setPeriod(1);
                        setShowCustomPicker(false);
                    }}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: period === 1 ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                        background: period === 1 ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                        color: period === 1 ? '#00d2ff' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s',
                        fontWeight: period === 1 ? '600' : 'normal'
                    }}
                    className="hover-neon"
                >
                    Hoje
                </button>

                {/* Other period buttons */}
                {[7, 30, 90, 365].map(days => (
                    <button
                        key={days}
                        onClick={() => {
                            setPeriod(days);
                            setShowCustomPicker(false);
                        }}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: period === days ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                            background: period === days ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                            color: period === days ? '#00d2ff' : 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s',
                            fontWeight: period === days ? '600' : 'normal'
                        }}
                        className="hover-neon"
                    >
                        {days === 365 ? 'Todo período' : `${days} dias`}
                    </button>
                ))}

                {/* Custom period button */}
                <button
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: showCustomPicker ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                        background: showCustomPicker ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                        color: showCustomPicker ? '#a855f7' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: showCustomPicker ? '600' : 'normal'
                    }}
                    className="hover-neon"
                >
                    <CalendarRange size={16} />
                    Selecionar período
                </button>
            </div>

            {/* Custom Date Picker */}
            <AnimatePresence>
                {showCustomPicker && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                        Data Inicial
                                    </label>
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                        Data Final
                                    </label>
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleCustomPeriod}
                                    disabled={!customStartDate || !customEndDate}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: customStartDate && customEndDate
                                            ? 'linear-gradient(135deg, #a855f7, #8b5cf6)'
                                            : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        cursor: customStartDate && customEndDate ? 'pointer' : 'not-allowed',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        opacity: customStartDate && customEndDate ? 1 : 0.5
                                    }}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <MetricCard
                    icon={DollarSign}
                    label="Lucro Total"
                    value={`R$ ${metrics.totalProfit.toFixed(2)}`}
                    color="#10b981"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Lucro por Mesa"
                    value={`R$ ${metrics.profitPerAccount.toFixed(2)}`}
                    color="#00d2ff"
                />
                <MetricCard
                    icon={Calendar}
                    label="Média Diária"
                    value={`R$ ${metrics.dailyAverage.toFixed(2)}`}
                    color="#a855f7"
                />
                <MetricCard
                    icon={Calendar}
                    label="Média Semanal"
                    value={`R$ ${metrics.weeklyAverage.toFixed(2)}`}
                    color="#f59e0b"
                />
                <MetricCard
                    icon={Calendar}
                    label="Média Mensal"
                    value={`R$ ${metrics.monthlyAverage.toFixed(2)}`}
                    color="#ec4899"
                />
                <MetricCard
                    icon={Award}
                    label="Dias Operados"
                    value={metrics.daysSinceStart}
                    color="#8b5cf6"
                />
            </div>

            {/* Streaks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <Card style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem' }}>🔥</div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Maior Sequência de Wins</p>
                            <h3 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>{streaks.maxWinStreak}</h3>
                        </div>
                    </div>
                </Card>
                <Card style={{ background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem' }}>❄️</div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Maior Sequência de Losses</p>
                            <h3 style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 'bold' }}>{streaks.maxLossStreak}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Evolution Chart */}
            <Card>
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                    Evolução do Patrimônio
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
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
                            formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Patrimônio']}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#00d2ff"
                            strokeWidth={3}
                            dot={{ fill: '#00d2ff', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Patrimônio Acumulado"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Insights */}
            {insights.length > 0 && (
                <Card>
                    <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>💡</span> Insights Automáticos
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {insights.map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    padding: '15px',
                                    borderRadius: '8px',
                                    background: insight.type === 'positive'
                                        ? 'rgba(16, 185, 129, 0.1)'
                                        : 'rgba(59, 130, 246, 0.1)',
                                    border: insight.type === 'positive'
                                        ? '1px solid rgba(16, 185, 129, 0.3)'
                                        : '1px solid rgba(59, 130, 246, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
                                <p style={{ color: 'white', margin: 0 }}>{insight.message}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GeneralPerformanceReport;
