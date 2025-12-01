import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import GoalTracker from '../components/GoalTracker';
import AccountsManager from '../components/AccountsManager';
import WithdrawalManager from '../components/WithdrawalManager';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import { ActiveTablesCard, AlertsCard, WithdrawalSummaryCard } from '../components/SummaryCards';
import { LogOut, LayoutDashboard, Monitor, Wallet, User, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'accounts', 'withdrawals'
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Vignette Overlay */}
            <div className="vignette-overlay"></div>

            {/* Navbar */}
            <nav style={{
                background: 'rgba(15, 12, 41, 0.7)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '15px 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #7b4397, #00d2ff)', padding: '8px', borderRadius: '8px' }}>
                            <LayoutDashboard size={20} color="white" />
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: '0.5px' }}>TableFlow</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '6px 12px', borderRadius: '30px', cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            className="hover-neon"
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                                {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span style={{ color: 'white', fontSize: '0.9rem' }}>{user?.user_metadata?.name || user?.email}</span>
                            <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
                        </button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute', top: '120%', right: 0,
                                        width: '200px', background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px', padding: '10px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        zIndex: 101
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'transparent', color: 'white', cursor: 'pointer', border: 'none', textAlign: 'left' }} className="hover-neon">
                                            <User size={16} /> Perfil
                                        </button>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'transparent', color: 'white', cursor: 'pointer', border: 'none', textAlign: 'left' }} className="hover-neon">
                                            <Settings size={16} /> Configurações
                                        </button>
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '5px 0' }}></div>
                                        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(220, 36, 48, 0.1)', color: '#dc2430', cursor: 'pointer', border: 'none', textAlign: 'left' }}>
                                            <LogOut size={16} /> Sair
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ marginTop: '40px' }}>
                {/* Tabs Navigation */}
                <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0px' }}>
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard size={18} />, color: '#00d2ff' },
                        { id: 'accounts', label: 'Mesas', icon: <Monitor size={18} />, color: '#a855f7' },
                        { id: 'withdrawals', label: 'Gestão de Saque', icon: <Wallet size={18} />, color: '#dc2430' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '15px 5px',
                                color: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.5)',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                                borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                        >
                            {tab.icon} {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabGlow"
                                    style={{
                                        position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px',
                                        background: tab.color, boxShadow: `0 -5px 15px ${tab.color}`
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Quick Actions Panel */}


                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Quick Actions Panel */}
                            <QuickActions setActiveTab={setActiveTab} />

                            {/* Dashboard Grid Layout */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ gridColumn: 'span 2' }}> {/* Goal Tracker takes 2 columns on wide screens */}
                                    <GoalTracker />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <ActiveTablesCard />
                                    <WithdrawalSummaryCard />
                                    <AlertsCard />
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <RecentActivity />
                        </motion.div>
                    )}

                    {activeTab === 'accounts' && (
                        <motion.div
                            key="accounts"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AccountsManager />
                        </motion.div>
                    )}

                    {activeTab === 'withdrawals' && (
                        <motion.div
                            key="withdrawals"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <WithdrawalManager />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
