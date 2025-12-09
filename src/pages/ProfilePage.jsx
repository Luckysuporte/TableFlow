import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import {
    User, Mail, Calendar, TrendingUp, Target, Award,
    Camera, Save, X, Edit2, CheckCircle, Trophy, Zap
} from 'lucide-react';
import Button from '../components/Button';

const ProfilePage = ({ onClose }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [profileData, setProfileData] = useState({
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
        phone: '',
        bio: ''
    });

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            // Fetch accounts
            const { data: accounts } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id);

            // Fetch withdrawals
            const { data: withdrawals } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('user_id', user.id);

            // Fetch goals
            const { data: goals } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id);

            const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.current_balance || 0), 0) || 0;
            const totalWithdrawals = withdrawals?.reduce((sum, w) => sum + (w.amount || 0), 0) || 0;
            const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;
            const activeAccounts = accounts?.filter(a => a.status === 'active').length || 0;

            setStats({
                totalBalance,
                totalWithdrawals,
                completedGoals,
                activeAccounts,
                totalAccounts: accounts?.length || 0,
                memberSince: new Date(user.created_at).toLocaleDateString('pt-BR')
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    name: profileData.name,
                    phone: profileData.phone,
                    bio: profileData.bio
                }
            });

            if (error) throw error;
            setIsEditing(false);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const achievements = [
        { id: 1, title: 'Primeiro Saque', icon: Trophy, color: '#f59e0b', unlocked: stats?.totalWithdrawals > 0 },
        { id: 2, title: 'Meta Cumprida', icon: Target, color: '#10b981', unlocked: stats?.completedGoals > 0 },
        { id: 3, title: 'Trader Ativo', icon: Zap, color: '#00d2ff', unlocked: stats?.activeAccounts > 0 },
        { id: 4, title: 'Veterano', icon: Award, color: '#a855f7', unlocked: stats?.totalAccounts >= 5 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 12, 41, 0.95))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}
                className="hide-scrollbar"
            >
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                    padding: '30px',
                    borderRadius: '20px 20px 0 0',
                    position: 'relative'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        className="hover-neon"
                    >
                        <X size={20} color="white" />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                border: '4px solid white'
                            }}>
                                {(profileData.name || user?.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <button style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                <Camera size={16} color="#3a7bd5" />
                            </button>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.8rem' }}>
                                {profileData.name || 'Usuário'}
                            </h2>
                            <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                                {profileData.email}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                                <Calendar size={14} color="rgba(255,255,255,0.8)" />
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                    Membro desde {stats?.memberSince}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '30px' }}>
                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '30px'
                    }}>
                        <StatCard
                            icon={<TrendingUp size={20} />}
                            label="Saldo Total"
                            value={`R$ ${stats?.totalBalance?.toFixed(2) || '0.00'}`}
                            color="#10b981"
                        />
                        <StatCard
                            icon={<Target size={20} />}
                            label="Metas Concluídas"
                            value={stats?.completedGoals || 0}
                            color="#ec4899"
                        />
                        <StatCard
                            icon={<Award size={20} />}
                            label="Total de Saques"
                            value={`R$ ${stats?.totalWithdrawals?.toFixed(2) || '0.00'}`}
                            color="#f59e0b"
                        />
                        <StatCard
                            icon={<User size={20} />}
                            label="Mesas Ativas"
                            value={`${stats?.activeAccounts || 0}/${stats?.totalAccounts || 0}`}
                            color="#00d2ff"
                        />
                    </div>

                    {/* Achievements */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Trophy size={20} color="#f59e0b" />
                            Conquistas
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                            {achievements.map(achievement => (
                                <AchievementBadge key={achievement.id} {...achievement} />
                            ))}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: 'white', margin: 0 }}>Informações Pessoais</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        background: 'rgba(0,210,255,0.2)',
                                        border: '1px solid #00d2ff',
                                        color: '#00d2ff',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                    className="hover-neon"
                                >
                                    <Edit2 size={16} />
                                    Editar
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: 'rgba(220,36,48,0.2)',
                                            border: '1px solid #dc2430',
                                            color: '#dc2430',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <X size={16} />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: 'rgba(16,185,129,0.2)',
                                            border: '1px solid #10b981',
                                            color: '#10b981',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            fontSize: '0.9rem',
                                            opacity: loading ? 0.5 : 1
                                        }}
                                        className="hover-neon"
                                    >
                                        <Save size={16} />
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <InfoField
                                icon={<User size={18} />}
                                label="Nome"
                                value={profileData.name}
                                isEditing={isEditing}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                            <InfoField
                                icon={<Mail size={18} />}
                                label="Email"
                                value={profileData.email}
                                isEditing={false}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}30`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    }}>
        <div style={{ color, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon}
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{label}</span>
        </div>
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {value}
        </div>
    </div>
);

const AchievementBadge = ({ title, icon: Icon, color, unlocked }) => (
    <div style={{
        background: unlocked ? `${color}20` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${unlocked ? color : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: unlocked ? 1 : 0.4,
        transition: 'all 0.3s'
    }}>
        <Icon size={28} color={unlocked ? color : 'rgba(255,255,255,0.3)'} />
        <span style={{
            color: unlocked ? color : 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
            textAlign: 'center',
            fontWeight: unlocked ? '600' : 'normal'
        }}>
            {title}
        </span>
        {unlocked && <CheckCircle size={16} color={color} />}
    </div>
);

const InfoField = ({ icon, label, value, isEditing, onChange, disabled }) => (
    <div>
        <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>
            {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#00d2ff' }}>{icon}</div>
            {isEditing && !disabled ? (
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '10px',
                        color: 'white',
                        fontSize: '1rem'
                    }}
                />
            ) : (
                <span style={{ color: 'white', fontSize: '1rem' }}>{value || 'Não informado'}</span>
            )}
        </div>
    </div>
);

export default ProfilePage;
