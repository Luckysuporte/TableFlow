import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Button from './Button';
import NeonInput from './NeonInput';
import { Clock, ArrowUpRight, ArrowDownRight, Plus, X, Check, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecentActivity = () => {
    const { logs, accounts, addLog, privacyMode } = useData();

    // Modal de Registro Rápido de Trade na Tela Inicial
    const [showQuickTradeModal, setShowQuickTradeModal] = useState(false);
    const [tradeAccountId, setTradeAccountId] = useState('');
    const [tradeDate, setTradeDate] = useState(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    });
    const [tradeAmount, setTradeAmount] = useState('');
    const [tradeType, setTradeType] = useState('gain'); // 'gain' ou 'loss'
    const [tradeNotes, setTradeNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Pegar os últimos 7 logs ordenados por data
    const recentLogs = [...logs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7);

    const getAccount = (id) => {
        return accounts.find(a => a.id === id);
    };

    const handleOpenQuickTrade = () => {
        if (accounts.length > 0 && !tradeAccountId) {
            setTradeAccountId(accounts[0].id);
        }
        setShowQuickTradeModal(true);
    };

    const handleSaveTrade = async (e) => {
        e.preventDefault();
        if (!tradeAccountId || !tradeAmount) return;

        const val = parseFloat(tradeAmount.replace(',', '.'));
        if (isNaN(val) || val === 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }

        const finalAmount = tradeType === 'loss' ? -Math.abs(val) : Math.abs(val);

        setIsSaving(true);
        const success = await addLog({
            account_id: tradeAccountId,
            accountId: tradeAccountId,
            date: tradeDate,
            amount: finalAmount,
            notes: tradeNotes || (finalAmount >= 0 ? 'Gain do dia' : 'Loss do dia')
        });
        setIsSaving(false);

        if (success) {
            setShowQuickTradeModal(false);
            setTradeAmount('');
            setTradeNotes('');
        }
    };

    const selectedAcc = accounts.find(a => a.id === tradeAccountId);
    const currencySymbol = selectedAcc?.currency === 'USD' ? '$' : 'R$';

    return (
        <Card className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(168, 85, 247, 0.15)',
                        color: '#a855f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                            Últimas Movimentações
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                            Histórico recente dos seus pregões
                        </span>
                    </div>
                </div>

                {/* Botão de Registro Rápido de Trade */}
                {accounts.length > 0 && (
                    <button
                        type="button"
                        onClick={handleOpenQuickTrade}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(168, 85, 247, 0.2))',
                            border: '1px solid rgba(0, 210, 255, 0.4)',
                            color: '#00d2ff',
                            fontSize: '0.88rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Plus size={16} />
                        <span>Registrar Trade</span>
                    </button>
                )}
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mesa</th>
                            <th style={{ textAlign: 'center', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                            <th style={{ textAlign: 'right', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentLogs.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '35px', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
                                    Nenhuma movimentação registrada recentemente.
                                </td>
                            </tr>
                        ) : (
                            recentLogs.map(log => {
                                const acc = getAccount(log.accountId || log.account_id);
                                const isGain = Number(log.amount) >= 0;
                                const currency = acc?.currency || 'BRL';
                                const sym = currency === 'USD' ? '$' : 'R$';

                                return (
                                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        {/* Data */}
                                        <td style={{ padding: '14px 12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
                                            {(() => {
                                                if (!log.date) return '-';
                                                const parts = log.date.split('-');
                                                if (parts.length === 3) {
                                                    return `${parts[2]}/${parts[1]}`;
                                                }
                                                return log.date;
                                            })()}
                                        </td>

                                        {/* Mesa */}
                                        <td style={{ padding: '14px 12px' }}>
                                            <span style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.82rem',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: 'white',
                                                fontWeight: '500'
                                            }}>
                                                {acc ? acc.name : 'Mesa Desconhecida'}
                                            </span>
                                        </td>

                                        {/* Status Gain / Loss */}
                                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '3px 10px',
                                                borderRadius: '12px',
                                                background: isGain ? 'rgba(0, 210, 255, 0.12)' : 'rgba(220, 36, 48, 0.12)',
                                                color: isGain ? '#00d2ff' : '#dc2430',
                                                border: isGain ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid rgba(220, 36, 48, 0.3)',
                                                fontWeight: '600'
                                            }}>
                                                {isGain ? 'GAIN' : 'LOSS'}
                                            </span>
                                        </td>

                                        {/* Resultado com a Moeda Correta */}
                                        <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                gap: '5px',
                                                fontWeight: 'bold',
                                                fontSize: '0.98rem',
                                                color: isGain ? '#00d2ff' : '#dc2430'
                                            }}>
                                                {isGain ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                                                {privacyMode ? (
                                                    `${isGain ? '+' : '-'} ${sym} ${Math.abs(Number(log.amount)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                ) : '••••••'}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Registro Rápido de Trade */}
            <AnimatePresence>
                {showQuickTradeModal && (
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
                        onClick={() => setShowQuickTradeModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '480px' }}
                        >
                            <Card style={{ border: '1px solid rgba(0, 210, 255, 0.4)', background: '#131127', padding: '24px' }}>
                                <form onSubmit={handleSaveTrade} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Plus size={20} color="#00d2ff" />
                                            </div>
                                            <div>
                                                <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Registrar Trade do Dia</h3>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Lançamento rápido direto na mesa</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowQuickTradeModal(false)}
                                            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Escolha da Mesa */}
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            Selecione a Mesa:
                                        </label>
                                        <select
                                            value={tradeAccountId}
                                            onChange={(e) => setTradeAccountId(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.6)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontSize: '0.95rem',
                                                outline: 'none'
                                            }}
                                        >
                                            {accounts.map(acc => (
                                                <option key={acc.id} value={acc.id} style={{ background: '#1a1a2e' }}>
                                                    {acc.name} ({acc.currency === 'USD' ? 'USD $' : 'BRL R$'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tipo: Gain ou Loss */}
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            Tipo de Operação:
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setTradeType('gain')}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: tradeType === 'gain' ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                                                    background: tradeType === 'gain' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                                                    color: tradeType === 'gain' ? '#00d2ff' : 'rgba(255,255,255,0.7)',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <ArrowUpRight size={16} /> GAIN (Lucro)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTradeType('loss')}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: tradeType === 'loss' ? '1px solid #dc2430' : '1px solid rgba(255,255,255,0.1)',
                                                    background: tradeType === 'loss' ? 'rgba(220, 36, 48, 0.2)' : 'rgba(255,255,255,0.03)',
                                                    color: tradeType === 'loss' ? '#dc2430' : 'rgba(255,255,255,0.7)',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <ArrowDownRight size={16} /> LOSS (Prejuízo)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Data e Valor */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <NeonInput
                                            label="Data do Pregão"
                                            type="date"
                                            value={tradeDate}
                                            onChange={(e) => setTradeDate(e.target.value)}
                                            required
                                        />
                                        <NeonInput
                                            label={`Valor (${currencySymbol})`}
                                            type="number"
                                            step="any"
                                            value={tradeAmount}
                                            onChange={(e) => setTradeAmount(e.target.value)}
                                            placeholder="Ex: 450.00"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowQuickTradeModal(false)}
                                            style={{ flex: 1, padding: '12px' }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving || !tradeAmount}
                                            style={{
                                                flex: 2,
                                                padding: '12px',
                                                background: tradeType === 'gain' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'linear-gradient(135deg, #dc2430, #7b4397)',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                opacity: (isSaving || !tradeAmount) ? 0.6 : 1
                                            }}
                                        >
                                            {isSaving ? 'Salvando...' : 'Salvar Pregão'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default RecentActivity;
