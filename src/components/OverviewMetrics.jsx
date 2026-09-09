import React from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import { TrendingUp, TrendingDown, Calendar, Wallet, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const OverviewMetrics = () => {
    const { getOverviewKPIs, privacyMode } = useData();
    const kpis = getOverviewKPIs();

    const formatBRL = (val) => {
        const num = Number(val || 0);
        return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatUSD = (val) => {
        const num = Number(val || 0);
        return `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Formatação de resultado com sinal + ou -
    const renderResultValue = (brlVal, usdVal) => {
        if (!privacyMode) return '••••••';

        const hasBRL = brlVal !== 0 || usdVal === 0;
        const hasUSD = usdVal !== 0;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {hasBRL && (
                    <span style={{
                        fontSize: '1.45rem',
                        fontWeight: '800',
                        color: brlVal > 0 ? '#00d2ff' : brlVal < 0 ? '#dc2430' : 'white',
                        textShadow: brlVal > 0 ? '0 0 12px rgba(0, 210, 255, 0.3)' : brlVal < 0 ? '0 0 12px rgba(220, 36, 48, 0.3)' : 'none'
                    }}>
                        {brlVal > 0 ? '+' : ''}{formatBRL(brlVal)}
                    </span>
                )}
                {hasUSD && (
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: usdVal > 0 ? '#a855f7' : usdVal < 0 ? '#dc2430' : 'rgba(255,255,255,0.85)',
                        textShadow: usdVal > 0 ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none'
                    }}>
                        {usdVal > 0 ? '+' : ''}{formatUSD(usdVal)}
                    </span>
                )}
            </div>
        );
    };

    // Formatação de saldo em corretora
    const renderBalanceValue = (brlVal, usdVal) => {
        if (!privacyMode) return '••••••';

        const hasBRL = brlVal > 0 || usdVal === 0;
        const hasUSD = usdVal > 0;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {hasBRL && (
                    <span style={{ fontSize: '1.45rem', fontWeight: '800', color: 'white' }}>
                        {formatBRL(brlVal)}
                    </span>
                )}
                {hasUSD && (
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#a855f7' }}>
                        {formatUSD(usdVal)}
                    </span>
                )}
            </div>
        );
    };

    const isTodayPositive = kpis.todayResultBRL > 0 || kpis.todayResultUSD > 0;
    const isTodayNegative = kpis.todayResultBRL < 0 || kpis.todayResultUSD < 0;

    const isMonthPositive = kpis.monthResultBRL > 0 || kpis.monthResultUSD > 0;
    const isMonthNegative = kpis.monthResultBRL < 0 || kpis.monthResultUSD < 0;

    const cards = [
        {
            title: 'Resultado de Hoje',
            badge: 'Diário Global',
            icon: isTodayPositive ? <TrendingUp size={20} /> : isTodayNegative ? <TrendingDown size={20} /> : <Activity size={20} />,
            iconBg: isTodayPositive ? 'rgba(0, 210, 255, 0.15)' : isTodayNegative ? 'rgba(220, 36, 48, 0.15)' : 'rgba(255, 255, 255, 0.08)',
            iconColor: isTodayPositive ? '#00d2ff' : isTodayNegative ? '#dc2430' : 'rgba(255,255,255,0.7)',
            borderColor: isTodayPositive ? 'rgba(0, 210, 255, 0.25)' : isTodayNegative ? 'rgba(220, 36, 48, 0.25)' : 'rgba(255,255,255,0.08)',
            value: renderResultValue(kpis.todayResultBRL, kpis.todayResultUSD),
            subtitle: isTodayPositive ? 'Dia no positivo 🟢' : isTodayNegative ? 'Dia no negativo 🔴' : 'Aguardando operações'
        },
        {
            title: 'Resultado do Mês',
            badge: 'Setembro/26',
            icon: <Calendar size={20} />,
            iconBg: isMonthPositive ? 'rgba(16, 185, 129, 0.15)' : isMonthNegative ? 'rgba(220, 36, 48, 0.15)' : 'rgba(168, 85, 247, 0.15)',
            iconColor: isMonthPositive ? '#10b981' : isMonthNegative ? '#dc2430' : '#a855f7',
            borderColor: isMonthPositive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(168, 85, 247, 0.25)',
            value: renderResultValue(kpis.monthResultBRL, kpis.monthResultUSD),
            subtitle: 'Lucro líquido do ciclo atual'
        },
        {
            title: 'Capital sob Gestão',
            badge: 'Contas Reais',
            icon: <Wallet size={20} />,
            iconBg: 'rgba(0, 210, 255, 0.15)',
            iconColor: '#00d2ff',
            borderColor: 'rgba(0, 210, 255, 0.2)',
            value: renderBalanceValue(kpis.totalBalanceBRL, kpis.totalBalanceUSD),
            subtitle: 'Saldo total em corretoras'
        },
        {
            title: 'Taxa de Acerto',
            badge: 'Win Rate',
            icon: <Target size={20} />,
            iconBg: kpis.winRate >= 50 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            iconColor: kpis.winRate >= 50 ? '#10b981' : '#f59e0b',
            borderColor: kpis.winRate >= 50 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
            value: (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{
                        fontSize: '1.65rem',
                        fontWeight: '800',
                        color: kpis.winRate >= 50 ? '#10b981' : '#f59e0b',
                        textShadow: kpis.winRate >= 50 ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}>
                        {privacyMode ? `${kpis.winRate}%` : '••%'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        {kpis.totalTradingDays > 0 ? `(${kpis.totalTradingDays} pregões)` : 'Sem trades'}
                    </span>
                </div>
            ),
            subtitle: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>{kpis.winDaysCount} Gain</span>
                    <span>•</span>
                    <span style={{ color: '#dc2430', fontWeight: 'bold' }}>{kpis.lossDaysCount} Loss</span>
                </div>
            )
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '18px',
            marginBottom: '30px'
        }}>
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ translateY: -3 }}
                >
                    <Card
                        className="glass-card"
                        style={{
                            padding: '18px 20px',
                            border: `1px solid ${card.borderColor}`,
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '140px',
                            background: 'rgba(255, 255, 255, 0.02)'
                        }}
                    >
                        {/* Linha Superior: Ícone + Título + Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: card.iconBg,
                                    color: card.iconColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {card.icon}
                                </div>
                                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.75)' }}>
                                    {card.title}
                                </span>
                            </div>

                            <span style={{
                                fontSize: '0.72rem',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: '500'
                            }}>
                                {card.badge}
                            </span>
                        </div>

                        {/* Valor Central */}
                        <div style={{ marginBottom: '8px' }}>
                            {card.value}
                        </div>

                        {/* Subtítulo do Rodapé */}
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                            {card.subtitle}
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default OverviewMetrics;
