import React from 'react';
import Card from '../Card';
import { useReportData } from '../../hooks/useReportData';
import { Target, TrendingUp, Calendar, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { differenceInDays } from 'date-fns';

const GoalsReport = () => {
    const { goal, accounts, calculateAccountMetrics, withdrawals, logs, calculatePerformanceMetrics } = useReportData();

    const metrics = calculatePerformanceMetrics;
    const totalWithdrawn = withdrawals.reduce((acc, w) => acc + Number(w.netAmount || w.net_amount || 0), 0);
    const remaining = goal.amount - totalWithdrawn;
    const progress = goal.amount > 0 ? (totalWithdrawn / goal.amount) * 100 : 0;

    // Calculate estimated completion date
    const daysOperating = metrics.daysSinceStart || 1;
    const dailyRate = totalWithdrawn / daysOperating;
    const daysRemaining = dailyRate > 0 ? Math.ceil(remaining / dailyRate) : 0;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);

    // Account progress
    const accountProgress = accounts.map(account => {
        const accountMetrics = calculateAccountMetrics(account.id);
        const accountGoal = account.goal || goal.amount;
        const accountProgress = accountGoal > 0 ? (accountMetrics.totalAmount / accountGoal) * 100 : 0;

        return {
            id: account.id,
            name: account.name,
            current: accountMetrics.totalAmount,
            goal: accountGoal,
            progress: Math.min(accountProgress, 100),
            remaining: Math.max(0, accountGoal - accountMetrics.totalAmount)
        };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                    Relatório de Metas
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Acompanhamento e previsões de objetivos</p>
            </div>

            {/* Global Goal Card */}
            <Card style={{ background: 'linear-gradient(145deg, rgba(0, 210, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Target size={24} color="#00d2ff" />
                            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{goal.name}</h3>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Meta Global do Sistema</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '5px' }}>Objetivo</p>
                        <h3 style={{ color: '#00d2ff', fontSize: '2rem', fontWeight: 'bold' }}>
                            R$ {goal.amount.toFixed(2)}
                        </h3>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Progresso</span>
                        <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>{progress.toFixed(1)}%</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '12px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #00d2ff, #a855f7)',
                                boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '5px' }}>Acumulado</p>
                        <p style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 'bold' }}>R$ {totalWithdrawn.toFixed(2)}</p>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '5px' }}>Falta</p>
                        <p style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: 'bold' }}>R$ {remaining.toFixed(2)}</p>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '5px' }}>Taxa Diária</p>
                        <p style={{ color: '#a855f7', fontSize: '1.3rem', fontWeight: 'bold' }}>R$ {dailyRate.toFixed(2)}</p>
                    </div>
                </div>
            </Card>

            {/* Prediction Card */}
            {dailyRate > 0 && remaining > 0 && (
                <Card style={{ background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{
                            padding: '12px',
                            borderRadius: '10px',
                            background: 'rgba(168, 85, 247, 0.2)',
                            color: '#a855f7'
                        }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '5px' }}>Previsão de Conclusão</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Baseado na média atual</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '5px' }}>Data Estimada</p>
                            <p style={{ color: '#a855f7', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {estimatedDate.toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '5px' }}>Dias Restantes</p>
                            <p style={{ color: '#00d2ff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {daysRemaining} dias
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Progress by Account */}
            <Card>
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={20} color="#00d2ff" />
                    Progresso por Mesa
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {accountProgress.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
                            Nenhuma mesa cadastrada
                        </p>
                    ) : (
                        accountProgress.map((account, index) => (
                            <motion.div
                                key={account.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    padding: '20px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '5px' }}>{account.name}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                            R$ {account.current.toFixed(2)} / R$ {account.goal.toFixed(2)}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: account.progress >= 100 ? '#10b981' : '#00d2ff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                            {account.progress.toFixed(1)}%
                                        </p>
                                        {account.progress >= 100 && (
                                            <span style={{ color: '#10b981', fontSize: '0.85rem' }}>✓ Meta atingida!</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${account.progress}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        style={{
                                            height: '100%',
                                            background: account.progress >= 100
                                                ? 'linear-gradient(90deg, #10b981, #059669)'
                                                : 'linear-gradient(90deg, #00d2ff, #3a7bd5)'
                                        }}
                                    />
                                </div>
                                {account.remaining > 0 && (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '8px' }}>
                                        Faltam R$ {account.remaining.toFixed(2)}
                                    </p>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </Card>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <Card style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <TrendingUp size={18} color="#10b981" />
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Mesas com Meta Atingida</p>
                    </div>
                    <h3 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>
                        {accountProgress.filter(a => a.progress >= 100).length}
                    </h3>
                </Card>

                <Card style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Zap size={18} color="#f59e0b" />
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Mesas em Progresso</p>
                    </div>
                    <h3 style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 'bold' }}>
                        {accountProgress.filter(a => a.progress > 0 && a.progress < 100).length}
                    </h3>
                </Card>
            </div>
        </div>
    );
};

export default GoalsReport;
