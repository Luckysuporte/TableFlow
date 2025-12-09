import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Bell, Lock, Palette, FileText, Database, Shield,
    X, Save, ChevronRight, Moon, Sun, Smartphone,
    Mail, DollarSign, TrendingUp, AlertCircle, Eye, EyeOff
} from 'lucide-react';

const SettingsPage = ({ onClose }) => {
    const { user, updatePassword } = useAuth();
    const [activeSection, setActiveSection] = useState('notifications');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Settings State
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        goalAlerts: true,
        withdrawalAlerts: true,
        dailyReports: false,
        weeklyReports: true,

        // Appearance
        theme: 'dark',
        compactMode: false,
        animations: true,

        // Reports
        defaultReportPeriod: '30days',
        autoGenerateReports: true,
        includeCharts: true,

        // Security
        twoFactorAuth: false,
        sessionTimeout: '30min'
    });

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        setLoading(true);
        try {
            const result = await updatePassword(passwordData.newPassword);
            if (result.success) {
                alert('Senha alterada com sucesso!');
                setPasswordData({ newPassword: '', confirmPassword: '' });
            } else {
                alert(result.message || 'Erro ao alterar senha');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 'notifications', label: 'Notificações', icon: Bell, color: '#00d2ff' },
        { id: 'appearance', label: 'Aparência', icon: Palette, color: '#a855f7' },
        { id: 'reports', label: 'Relatórios', icon: FileText, color: '#10b981' },
        { id: 'security', label: 'Segurança', icon: Shield, color: '#dc2430' },
        { id: 'data', label: 'Dados', icon: Database, color: '#f59e0b' }
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'notifications':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <SectionHeader
                            icon={<Bell size={24} />}
                            title="Preferências de Notificações"
                            description="Gerencie como você deseja receber atualizações"
                        />

                        <SettingGroup title="Canais de Notificação">
                            <ToggleSetting
                                icon={<Mail size={18} />}
                                label="Notificações por Email"
                                description="Receba atualizações importantes por email"
                                checked={settings.emailNotifications}
                                onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                            />
                            <ToggleSetting
                                icon={<Smartphone size={18} />}
                                label="Notificações Push"
                                description="Receba notificações no navegador"
                                checked={settings.pushNotifications}
                                onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                            />
                        </SettingGroup>

                        <SettingGroup title="Alertas Específicos">
                            <ToggleSetting
                                icon={<TrendingUp size={18} />}
                                label="Alertas de Metas"
                                description="Seja notificado sobre progresso de metas"
                                checked={settings.goalAlerts}
                                onChange={(checked) => setSettings({ ...settings, goalAlerts: checked })}
                            />
                            <ToggleSetting
                                icon={<DollarSign size={18} />}
                                label="Alertas de Saques"
                                description="Notificações sobre saques processados"
                                checked={settings.withdrawalAlerts}
                                onChange={(checked) => setSettings({ ...settings, withdrawalAlerts: checked })}
                            />
                        </SettingGroup>

                        <SettingGroup title="Relatórios Automáticos">
                            <ToggleSetting
                                icon={<FileText size={18} />}
                                label="Relatórios Diários"
                                description="Receba um resumo diário por email"
                                checked={settings.dailyReports}
                                onChange={(checked) => setSettings({ ...settings, dailyReports: checked })}
                            />
                            <ToggleSetting
                                icon={<FileText size={18} />}
                                label="Relatórios Semanais"
                                description="Receba um resumo semanal por email"
                                checked={settings.weeklyReports}
                                onChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                            />
                        </SettingGroup>
                    </div>
                );

            case 'appearance':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <SectionHeader
                            icon={<Palette size={24} />}
                            title="Aparência"
                            description="Personalize a interface do sistema"
                        />

                        <SettingGroup title="Tema">
                            <SelectSetting
                                icon={<Moon size={18} />}
                                label="Modo de Cor"
                                description="Escolha entre tema claro ou escuro"
                                value={settings.theme}
                                options={[
                                    { value: 'dark', label: 'Escuro' },
                                    { value: 'light', label: 'Claro' },
                                    { value: 'auto', label: 'Automático' }
                                ]}
                                onChange={(value) => setSettings({ ...settings, theme: value })}
                            />
                        </SettingGroup>

                        <SettingGroup title="Interface">
                            <ToggleSetting
                                icon={<Smartphone size={18} />}
                                label="Modo Compacto"
                                description="Reduz o espaçamento entre elementos"
                                checked={settings.compactMode}
                                onChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                            />
                            <ToggleSetting
                                icon={<Palette size={18} />}
                                label="Animações"
                                description="Ativar animações e transições"
                                checked={settings.animations}
                                onChange={(checked) => setSettings({ ...settings, animations: checked })}
                            />
                        </SettingGroup>
                    </div>
                );

            case 'reports':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <SectionHeader
                            icon={<FileText size={24} />}
                            title="Preferências de Relatórios"
                            description="Configure como os relatórios são gerados"
                        />

                        <SettingGroup title="Configurações Padrão">
                            <SelectSetting
                                icon={<FileText size={18} />}
                                label="Período Padrão"
                                description="Período padrão ao abrir relatórios"
                                value={settings.defaultReportPeriod}
                                options={[
                                    { value: '7days', label: 'Últimos 7 dias' },
                                    { value: '30days', label: 'Últimos 30 dias' },
                                    { value: '90days', label: 'Últimos 90 dias' },
                                    { value: 'year', label: 'Último ano' }
                                ]}
                                onChange={(value) => setSettings({ ...settings, defaultReportPeriod: value })}
                            />
                        </SettingGroup>

                        <SettingGroup title="Geração de Relatórios">
                            <ToggleSetting
                                icon={<TrendingUp size={18} />}
                                label="Gerar Automaticamente"
                                description="Gerar relatórios automaticamente ao acessar"
                                checked={settings.autoGenerateReports}
                                onChange={(checked) => setSettings({ ...settings, autoGenerateReports: checked })}
                            />
                            <ToggleSetting
                                icon={<FileText size={18} />}
                                label="Incluir Gráficos"
                                description="Incluir gráficos visuais nos relatórios"
                                checked={settings.includeCharts}
                                onChange={(checked) => setSettings({ ...settings, includeCharts: checked })}
                            />
                        </SettingGroup>
                    </div>
                );

            case 'security':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <SectionHeader
                            icon={<Shield size={24} />}
                            title="Segurança"
                            description="Proteja sua conta e dados"
                        />

                        <SettingGroup title="Alterar Senha">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                                        Nova Senha
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Digite a nova senha"
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                paddingRight: '45px',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'rgba(255,255,255,0.5)'
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                                        Confirmar Senha
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirme a nova senha"
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            color: 'white',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: (loading || !passwordData.newPassword || !passwordData.confirmPassword) ? 0.5 : 1,
                                        transition: 'all 0.3s'
                                    }}
                                    className="hover-neon"
                                >
                                    <Lock size={18} />
                                    {loading ? 'Alterando...' : 'Alterar Senha'}
                                </button>
                            </div>
                        </SettingGroup>

                        <SettingGroup title="Autenticação">
                            <ToggleSetting
                                icon={<Shield size={18} />}
                                label="Autenticação de Dois Fatores"
                                description="Adicione uma camada extra de segurança"
                                checked={settings.twoFactorAuth}
                                onChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                                badge="Em breve"
                            />
                        </SettingGroup>

                        <SettingGroup title="Sessão">
                            <SelectSetting
                                icon={<AlertCircle size={18} />}
                                label="Tempo de Sessão"
                                description="Tempo até logout automático"
                                value={settings.sessionTimeout}
                                options={[
                                    { value: '15min', label: '15 minutos' },
                                    { value: '30min', label: '30 minutos' },
                                    { value: '1hour', label: '1 hora' },
                                    { value: 'never', label: 'Nunca' }
                                ]}
                                onChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
                            />
                        </SettingGroup>
                    </div>
                );

            case 'data':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <SectionHeader
                            icon={<Database size={24} />}
                            title="Gerenciamento de Dados"
                            description="Controle seus dados e privacidade"
                        />

                        <SettingGroup title="Exportar Dados">
                            <ActionButton
                                icon={<FileText size={18} />}
                                label="Exportar Relatórios"
                                description="Baixe todos os seus relatórios em PDF"
                                action="export-reports"
                                color="#10b981"
                            />
                            <ActionButton
                                icon={<Database size={18} />}
                                label="Exportar Dados Completos"
                                description="Baixe todos os seus dados em JSON"
                                action="export-all"
                                color="#00d2ff"
                            />
                        </SettingGroup>

                        <SettingGroup title="Zona de Perigo">
                            <ActionButton
                                icon={<AlertCircle size={18} />}
                                label="Excluir Conta"
                                description="Exclua permanentemente sua conta e dados"
                                action="delete-account"
                                color="#dc2430"
                                danger
                            />
                        </SettingGroup>
                    </div>
                );

            default:
                return null;
        }
    };

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
                    maxWidth: '1000px',
                    width: '100%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #7b4397, #dc2430)',
                    padding: '25px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'white', fontSize: '1.8rem' }}>Configurações</h2>
                        <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                            Personalize sua experiência
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
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
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar */}
                    <div style={{
                        width: '250px',
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        padding: '20px 0',
                        overflowY: 'auto'
                    }}
                        className="hide-scrollbar"
                    >
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '15px 20px',
                                    background: activeSection === section.id ? `${section.color}20` : 'transparent',
                                    border: 'none',
                                    borderLeft: activeSection === section.id ? `3px solid ${section.color}` : '3px solid transparent',
                                    color: activeSection === section.id ? section.color : 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: activeSection === section.id ? '600' : 'normal',
                                    transition: 'all 0.3s',
                                    textAlign: 'left'
                                }}
                                className="hover-neon"
                            >
                                <section.icon size={20} />
                                {section.label}
                                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: activeSection === section.id ? 1 : 0 }} />
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div style={{
                        flex: 1,
                        padding: '30px',
                        overflowY: 'auto'
                    }}
                        className="hide-scrollbar"
                    >
                        {renderSectionContent()}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: '20px 30px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '15px'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.95rem'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            alert('Configurações salvas com sucesso!');
                            onClose();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                        }}
                        className="hover-neon"
                    >
                        <Save size={18} />
                        Salvar Alterações
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Helper Components
const SectionHeader = ({ icon, title, description }) => (
    <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ color: '#00d2ff' }}>{icon}</div>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.3rem' }}>{title}</h3>
        </div>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{description}</p>
    </div>
);

const SettingGroup = ({ title, children }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '20px'
    }}>
        <h4 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '1rem' }}>{title}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {children}
        </div>
    </div>
);

const ToggleSetting = ({ icon, label, description, checked, onChange, badge }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px',
        padding: '12px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ color: '#00d2ff' }}>{icon}</div>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>{label}</span>
                    {badge && (
                        <span style={{
                            background: 'rgba(0,210,255,0.2)',
                            color: '#00d2ff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                        }}>
                            {badge}
                        </span>
                    )}
                </div>
                <p style={{ margin: '3px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{description}</p>
            </div>
        </div>
        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', cursor: 'pointer' }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: checked ? '#00d2ff' : 'rgba(255,255,255,0.2)',
                transition: '0.4s',
                borderRadius: '26px'
            }}>
                <span style={{
                    position: 'absolute',
                    content: '',
                    height: '20px',
                    width: '20px',
                    left: checked ? '27px' : '3px',
                    bottom: '3px',
                    background: 'white',
                    transition: '0.4s',
                    borderRadius: '50%'
                }} />
            </span>
        </label>
    </div>
);

const SelectSetting = ({ icon, label, description, value, options, onChange }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px',
        padding: '12px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ color: '#00d2ff' }}>{icon}</div>
            <div>
                <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500', display: 'block' }}>{label}</span>
                <p style={{ margin: '3px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{description}</p>
            </div>
        </div>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer'
            }}
        >
            {options.map(option => (
                <option key={option.value} value={option.value} style={{ background: '#1a1a2e' }}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const ActionButton = ({ icon, label, description, action, color, danger }) => (
    <button
        onClick={() => alert(`Ação: ${action}`)}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '15px',
            padding: '15px',
            background: danger ? 'rgba(220,36,48,0.1)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${danger ? '#dc2430' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            width: '100%',
            textAlign: 'left'
        }}
        className="hover-neon"
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ color }}>{icon}</div>
            <div>
                <span style={{ color: danger ? '#dc2430' : 'white', fontSize: '0.95rem', fontWeight: '500', display: 'block' }}>
                    {label}
                </span>
                <p style={{ margin: '3px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    {description}
                </p>
            </div>
        </div>
        <ChevronRight size={20} color={color} />
    </button>
);

export default SettingsPage;
