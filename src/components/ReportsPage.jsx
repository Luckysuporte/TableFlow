import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Monitor, FileText, Wallet, Target } from 'lucide-react';
import GeneralPerformanceReport from './reports/GeneralPerformanceReport';
import AccountDetailReport from './reports/AccountDetailReport';
import TradeJournalReport from './reports/TradeJournalReport';
import WithdrawalReport from './reports/WithdrawalReport';
import GoalsReport from './reports/GoalsReport';

const ReportsPage = () => {
    const [activeReport, setActiveReport] = useState('performance');

    const reports = [
        { id: 'performance', label: 'Performance Geral', icon: <BarChart3 size={18} />, color: '#00d2ff' },
        { id: 'account', label: 'Por Mesa', icon: <Monitor size={18} />, color: '#a855f7' },
        { id: 'trades', label: 'Diário de Trades', icon: <FileText size={18} />, color: '#10b981' },
        { id: 'withdrawals', label: 'Saques', icon: <Wallet size={18} />, color: '#f59e0b' },
        { id: 'goals', label: 'Metas', icon: <Target size={18} />, color: '#ec4899' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Sub-navigation */}
            <div style={{
                display: 'flex',
                gap: '15px',
                overflowX: 'auto',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                {reports.map(report => (
                    <button
                        key={report.id}
                        onClick={() => setActiveReport(report.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: activeReport === report.id
                                ? `1px solid ${report.color}`
                                : '1px solid rgba(255,255,255,0.1)',
                            background: activeReport === report.id
                                ? `${report.color}20`
                                : 'transparent',
                            color: activeReport === report.id ? report.color : 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: activeReport === report.id ? '600' : 'normal',
                            transition: 'all 0.3s',
                            whiteSpace: 'nowrap',
                            position: 'relative'
                        }}
                        className="hover-neon"
                    >
                        {report.icon}
                        {report.label}
                        {activeReport === report.id && (
                            <motion.div
                                layoutId="activeReportIndicator"
                                style={{
                                    position: 'absolute',
                                    bottom: '-11px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: report.color,
                                    boxShadow: `0 0 10px ${report.color}`
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Report Content */}
            <AnimatePresence mode="wait">
                {activeReport === 'performance' && (
                    <motion.div
                        key="performance"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GeneralPerformanceReport />
                    </motion.div>
                )}

                {activeReport === 'account' && (
                    <motion.div
                        key="account"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AccountDetailReport />
                    </motion.div>
                )}

                {activeReport === 'trades' && (
                    <motion.div
                        key="trades"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TradeJournalReport />
                    </motion.div>
                )}

                {activeReport === 'withdrawals' && (
                    <motion.div
                        key="withdrawals"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <WithdrawalReport />
                    </motion.div>
                )}

                {activeReport === 'goals' && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GoalsReport />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReportsPage;
