import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Button from './Button';
import NeonInput from './NeonInput';
import DailyLog from './DailyLog';
import GoalTracker from './GoalTracker';
import Card from './Card';
import { Plus, Trash2, Monitor, Edit2, Eye, EyeOff, X, Target, DollarSign, Check, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountsManager = () => {
    const { accounts, addAccount, updateAccount, deleteAccount, getSummary } = useData();
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Privacy (Olho): controle global e por card individual
    const [globalShowBalances, setGlobalShowBalances] = useState(() => {
        const saved = localStorage.getItem('tableflow_privacy_balances');
        return saved !== 'false';
    });
    const [cardPrivacyMap, setCardPrivacyMap] = useState({});

    const isAccountVisible = (id) => {
        if (cardPrivacyMap[id] !== undefined) return cardPrivacyMap[id];
        return globalShowBalances;
    };

    const toggleGlobalBalances = () => {
        const next = !globalShowBalances;
        setGlobalShowBalances(next);
        localStorage.setItem('tableflow_privacy_balances', next.toString());
        setCardPrivacyMap({});
    };

    const toggleCardVisibility = (id) => {
        setCardPrivacyMap(prev => ({
            ...prev,
            [id]: !(prev[id] !== undefined ? prev[id] : globalShowBalances)
        }));
    };

    // Form State (Cadastro de Nova Mesa)
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountInitialBalance, setAccountInitialBalance] = useState('');
    const [accountGoal, setAccountGoal] = useState('');
    const [accountCurrency, setAccountCurrency] = useState('BRL'); // 'BRL' ou 'USD'
    const [accountType, setAccountType] = useState('demo'); // 'demo' ou 'real'
    const [accountPhase, setAccountPhase] = useState('1'); // '1', '2', ou 'unica'

    // Edit Modal State (Edição de Mesa Existente)
    const [editingAccount, setEditingAccount] = useState(null);
    const [editNumber, setEditNumber] = useState('');
    const [editName, setEditName] = useState('');
    const [editInitialBalance, setEditInitialBalance] = useState('');
    const [editGoal, setEditGoal] = useState('');
    const [editCurrency, setEditCurrency] = useState('BRL');
    const [editType, setEditType] = useState('demo');
    const [editPhase, setEditPhase] = useState('1');

    // Abre o modal de edição com os dados da conta preenchidos
    const openEditModal = (account) => {
        setEditingAccount(account);
        setEditNumber(account.number || '');
        setEditName(account.name || '');
        setEditInitialBalance(account.initial_balance !== undefined && account.initial_balance !== null ? account.initial_balance : '');
        setEditGoal(account.goal !== undefined && account.goal !== null ? account.goal : '');
        setEditCurrency(account.currency || 'BRL');
        setEditType(account.type || 'demo');
        setEditPhase(account.phase || '1');
    };

    const closeEditModal = () => {
        setEditingAccount(null);
    };

    // Submissão do cadastro
    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await addAccount({
            number: accountNumber,
            name: accountName,
            type: accountType,
            phase: accountType === 'demo' ? accountPhase : '1',
            initial_balance: accountInitialBalance ? parseFloat(accountInitialBalance) : 0,
            goal: accountGoal ? parseFloat(accountGoal) : 0,
            currency: accountCurrency,
            createdAt: new Date().toISOString()
        });

        if (success) {
            setShowAddForm(false);
            setAccountNumber('');
            setAccountName('');
            setAccountInitialBalance('');
            setAccountGoal('');
            setAccountCurrency('BRL');
            setAccountType('demo');
            setAccountPhase('1');
        }
    };

    // Submissão da edição
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingAccount) return;

        const updatedData = {
            number: editNumber,
            name: editName,
            type: editType,
            phase: editType === 'demo' ? editPhase : '1',
            initial_balance: editInitialBalance ? parseFloat(editInitialBalance) : 0,
            goal: editGoal ? parseFloat(editGoal) : 0,
            currency: editCurrency
        };

        const success = await updateAccount(editingAccount.id, updatedData);
        if (success !== false) {
            if (selectedAccount?.id === editingAccount.id) {
                setSelectedAccount(prev => ({ ...prev, ...updatedData }));
            }
            closeEditModal();
        }
    };

    // Formatação monetária de acordo com a moeda
    const formatMoney = (val, currency = 'BRL') => {
        const num = Number(val || 0);
        if (currency === 'USD') {
            return `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Header / Ações Principais */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Minhas Mesas</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Gerencie suas contas, saldos em corretora e metas individuais
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Botão Geral de Privacidade (Olho) */}
                    <button
                        onClick={toggleGlobalBalances}
                        title={globalShowBalances ? "Ocultar saldos de todos os cards" : "Exibir saldos de todos os cards"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            background: globalShowBalances ? 'rgba(255,255,255,0.06)' : 'rgba(0, 210, 255, 0.15)',
                            border: globalShowBalances ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0, 210, 255, 0.4)',
                            color: globalShowBalances ? 'rgba(255,255,255,0.8)' : '#00d2ff',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        {globalShowBalances ? <EyeOff size={18} /> : <Eye size={18} />}
                        <span>{globalShowBalances ? 'Ocultar Valores' : 'Exibir Valores'}</span>
                    </button>

                    {/* Botão Nova Mesa */}
                    <Button onClick={() => setShowAddForm(!showAddForm)} style={{ background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none' }}>
                        <Plus size={20} /> Nova Mesa
                    </Button>
                </div>
            </div>

            {/* Formulário de Cadastro de Nova Conta */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <Card>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ color: 'white', margin: 0 }}>Cadastrar Nova Conta</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                    <NeonInput
                                        label="Número da Conta (#)"
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Ex: 531197512"
                                        required
                                    />
                                    <NeonInput
                                        label="Nome / Corretora"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Ex: FTMO 100K, XP Pessoal"
                                        required
                                    />
                                </div>

                                {/* Saldo da Conta, Meta e Moeda */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <NeonInput
                                        label={`Saldo da Conta / Banca (${accountCurrency === 'USD' ? '$' : 'R$'})`}
                                        type="number"
                                        step="any"
                                        value={accountInitialBalance}
                                        onChange={(e) => setAccountInitialBalance(e.target.value)}
                                        placeholder="Ex: 5000 ou 100000"
                                    />
                                    <NeonInput
                                        label={`Meta / Objetivo (${accountCurrency === 'USD' ? '$' : 'R$'})`}
                                        type="number"
                                        step="any"
                                        value={accountGoal}
                                        onChange={(e) => setAccountGoal(e.target.value)}
                                        placeholder="Ex: 10000"
                                    />

                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Moeda da Conta</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setAccountCurrency('BRL')}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: accountCurrency === 'BRL' ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                                                    background: accountCurrency === 'BRL' ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: accountCurrency === 'BRL' ? 'bold' : 'normal'
                                                }}
                                            >
                                                🇧🇷 Real (R$)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAccountCurrency('USD')}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: accountCurrency === 'USD' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                                                    background: accountCurrency === 'USD' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: accountCurrency === 'USD' ? 'bold' : 'normal'
                                                }}
                                            >
                                                🇺🇸 Dólar ($)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                                    <div style={{ width: '100%' }}>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Tipo de Conta</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                type="button"
                                                onClick={() => setAccountType('demo')}
                                                style={{
                                                    flex: 1,
                                                    minWidth: '150px',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: accountType === 'demo' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                                                    background: accountType === 'demo' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Demo (Avaliação)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAccountType('real')}
                                                style={{
                                                    flex: 1,
                                                    minWidth: '150px',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: accountType === 'real' ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                                                    background: accountType === 'real' ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Real (Aprovada)
                                            </button>
                                        </div>
                                    </div>

                                    {accountType === 'demo' && (
                                        <div style={{ width: '100%' }}>
                                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Fase</label>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                {['1', '2', 'unica'].map((fase) => (
                                                    <button
                                                        key={fase}
                                                        type="button"
                                                        onClick={() => setAccountPhase(fase)}
                                                        style={{
                                                            flex: 1,
                                                            minWidth: '100px',
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            border: accountPhase === fase ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                                                            background: accountPhase === fase ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {fase === 'unica' ? 'Fase Única' : `Fase ${fase}`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" style={{ width: '100%', padding: '16px 24px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none' }}>
                                    Cadastrar Mesa
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Accounts List (Cards de Mesas) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {accounts.map(account => {
                    const isAccountSelected = selectedAccount?.id === account.id;
                    const isVisible = isAccountVisible(account.id);
                    const summary = getSummary(account.id);
                    const currency = account.currency || 'BRL';

                    return (
                        <motion.div
                            key={account.id}
                            layoutId={account.id}
                            onClick={() => setSelectedAccount(isAccountSelected ? null : account)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card style={{
                                border: isAccountSelected ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                                background: isAccountSelected ? 'rgba(168, 85, 247, 0.07)' : 'var(--glass-bg)',
                                transition: 'border-color 0.2s, background 0.2s'
                            }}>
                                {/* Cabeçalho do Card */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '42px', height: '42px', borderRadius: '10px',
                                            background: account.type === 'real' ? 'rgba(0, 210, 255, 0.18)' : 'rgba(168, 85, 247, 0.18)',
                                            border: account.type === 'real' ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Monitor size={22} color={account.type === 'real' ? '#00d2ff' : '#a855f7'} />
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.05rem', margin: 0 }}>{account.name}</h4>
                                            {/* Número da Conta com destaque */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '600' }}>
                                                    #{account.number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botões de Ação do Card: Olho, Editar e Excluir */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {/* Botão do Olho individual */}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleCardVisibility(account.id); }}
                                            title={isVisible ? "Ocultar saldo deste card" : "Exibir saldo deste card"}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                color: isVisible ? '#00d2ff' : 'rgba(255,255,255,0.4)',
                                                padding: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>

                                        {/* Botão de Edição (Lápis) */}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); openEditModal(account); }}
                                            title="Editar número e dados da mesa"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                color: 'rgba(255,255,255,0.8)',
                                                padding: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </button>

                                        {/* Botão de Excluir */}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); deleteAccount(account.id); }}
                                            title="Excluir mesa"
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.08)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                borderRadius: '8px',
                                                color: '#ef4444',
                                                padding: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Bloco do Saldo Total da Conta */}
                                <div style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: '12px',
                                    padding: '12px 14px',
                                    marginBottom: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.5)' }}>
                                            Saldo Total da Conta
                                        </span>
                                        {account.initial_balance > 0 && (
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                                                Banca: {isVisible ? formatMoney(account.initial_balance, currency) : '••••••'}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: '1.45rem',
                                        fontWeight: '800',
                                        color: 'white',
                                        letterSpacing: isVisible ? 'normal' : '2px',
                                        textShadow: '0 0 15px rgba(0,210,255,0.2)'
                                    }}>
                                        {isVisible ? formatMoney(summary.currentBalance, currency) : (currency === 'USD' ? '$ ••••••' : 'R$ ••••••')}
                                    </div>

                                    {/* Sublinha de Resultado Acumulado */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '8px',
                                        paddingTop: '6px',
                                        borderTop: '1px solid rgba(255,255,255,0.05)',
                                        fontSize: '0.8rem'
                                    }}>
                                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>Lucro/Prejuízo Acumulado:</span>
                                        <span style={{
                                            fontWeight: 'bold',
                                            color: summary.totalResult > 0 ? '#00d2ff' : summary.totalResult < 0 ? '#dc2430' : 'rgba(255,255,255,0.7)'
                                        }}>
                                            {isVisible ? (
                                                `${summary.totalResult > 0 ? '+' : ''}${formatMoney(summary.totalResult, currency)}`
                                            ) : '••••••'}
                                        </span>
                                    </div>
                                </div>

                                {/* Bloco da Meta e Quanto Falta (se configurado) */}
                                {summary.targetAmount > 0 && (
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '10px',
                                        padding: '10px 12px',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '6px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                Meta: {formatMoney(summary.targetAmount, currency)}
                                            </span>
                                            <span style={{
                                                fontWeight: '600',
                                                color: summary.isGoalMet ? '#10b981' : '#f59e0b'
                                            }}>
                                                {summary.isGoalMet ? (
                                                    'Meta Batida! 🎯'
                                                ) : isVisible ? (
                                                    `Falta: ${formatMoney(summary.remaining, currency)}`
                                                ) : 'Falta: ••••••'}
                                            </span>
                                        </div>

                                        {/* Barra de Progresso da Meta */}
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${summary.progress}%`,
                                                height: '100%',
                                                background: summary.isGoalMet ? 'linear-gradient(90deg, #10b981, #00d2ff)' : 'linear-gradient(90deg, #a855f7, #00d2ff)',
                                                borderRadius: '4px',
                                                transition: 'width 0.4s ease'
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Tags do Rodapé */}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
                                        background: account.type === 'real' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                                        color: account.type === 'real' ? '#00d2ff' : '#a855f7',
                                        border: account.type === 'real' ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)'
                                    }}>
                                        {account.type === 'real' ? 'Conta Real' : 'Conta Demo'}
                                    </span>

                                    {account.type === 'demo' && (
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.15)'
                                        }}>
                                            {account.phase === 'unica' ? 'Fase Única' : `Fase ${account.phase}`}
                                        </span>
                                    )}

                                    {/* Tag de Moeda */}
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        color: 'rgba(255,255,255,0.7)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {currency === 'USD' ? '🇺🇸 USD ($)' : '🇧🇷 BRL (R$)'}
                                    </span>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Modal de Edição de Mesa (permite editar número, nome, saldo, meta, moeda, etc.) */}
            <AnimatePresence>
                {editingAccount && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '20px'
                        }}
                        onClick={closeEditModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '560px' }}
                        >
                            <Card style={{ border: '1px solid rgba(168, 85, 247, 0.4)', background: '#131127' }}>
                                <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Editar Mesa</h3>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                                Atualize o número, corretora, banca ou meta da conta
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeEditModal}
                                            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <NeonInput
                                            label="Número da Conta (#)"
                                            type="text"
                                            value={editNumber}
                                            onChange={(e) => setEditNumber(e.target.value)}
                                            placeholder="Ex: 531197512"
                                            required
                                        />
                                        <NeonInput
                                            label="Nome / Corretora"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Ex: FTMO 100K, XP Pessoal"
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <NeonInput
                                            label={`Saldo da Conta / Banca (${editCurrency === 'USD' ? '$' : 'R$'})`}
                                            type="number"
                                            step="any"
                                            value={editInitialBalance}
                                            onChange={(e) => setEditInitialBalance(e.target.value)}
                                            placeholder="Ex: 5000 ou 100000"
                                        />
                                        <NeonInput
                                            label={`Meta / Objetivo (${editCurrency === 'USD' ? '$' : 'R$'})`}
                                            type="number"
                                            step="any"
                                            value={editGoal}
                                            onChange={(e) => setEditGoal(e.target.value)}
                                            placeholder="Ex: 10000"
                                        />
                                    </div>

                                    {/* Escolha da Moeda */}
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Moeda da Conta</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setEditCurrency('BRL')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: editCurrency === 'BRL' ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                                                    background: editCurrency === 'BRL' ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: editCurrency === 'BRL' ? 'bold' : 'normal'
                                                }}
                                            >
                                                🇧🇷 Real (R$)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditCurrency('USD')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: editCurrency === 'USD' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                                                    background: editCurrency === 'USD' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: editCurrency === 'USD' ? 'bold' : 'normal'
                                                }}
                                            >
                                                🇺🇸 Dólar ($)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tipo e Fase */}
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Tipo de Conta</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setEditType('demo')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: editType === 'demo' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                                                    background: editType === 'demo' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Demo (Avaliação)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditType('real')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: editType === 'real' ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                                                    background: editType === 'real' ? 'rgba(0, 210, 255, 0.2)' : 'transparent',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Real (Aprovada)
                                            </button>
                                        </div>
                                    </div>

                                    {editType === 'demo' && (
                                        <div>
                                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Fase</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {['1', '2', 'unica'].map((fase) => (
                                                    <button
                                                        key={fase}
                                                        type="button"
                                                        onClick={() => setEditPhase(fase)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px',
                                                            borderRadius: '8px',
                                                            border: editPhase === fase ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                                                            background: editPhase === fase ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                            color: 'white',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {fase === 'unica' ? 'Fase Única' : `Fase ${fase}`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={closeEditModal}
                                            style={{ flex: 1, padding: '12px' }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            style={{
                                                flex: 2,
                                                padding: '12px',
                                                background: 'linear-gradient(135deg, #7b4397, #00d2ff)',
                                                border: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detalhes da Conta Selecionada (GoalTracker e DailyLog) */}
            <AnimatePresence>
                {selectedAccount && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div style={{ marginBottom: '30px' }}>
                            <GoalTracker accountId={selectedAccount.id} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>
                                Diário de Trades: <span style={{ color: '#a855f7' }}>{selectedAccount.name}</span>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginLeft: '10px' }}>
                                    (#{selectedAccount.number})
                                </span>
                            </h3>
                        </div>
                        <DailyLog accountId={selectedAccount.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountsManager;
