import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Button from './Button';
import NeonInput from './NeonInput';
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, Plus, Trash2, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';
import TradingCalendar from './TradingCalendar';

const DailyLog = ({ accountId, monthFilter = 'all' }) => {
    const { logs, addLog, deleteLog, accounts } = useData();
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [amount, setAmount] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'table'

    const currentAccount = accounts?.find(a => a.id === accountId);
    const currencySymbol = currentAccount?.currency === 'USD' ? '$' : 'R$';

    // Filter logs for this specific account
    const allAccountLogs = logs.filter(log => log.accountId === accountId || log.account_id === accountId);
    const accountLogs = monthFilter && monthFilter !== 'all'
        ? allAccountLogs.filter(log => log.date?.startsWith(monthFilter))
        : allAccountLogs;

    // Calcular mês inicial para o calendário com base no filtro ou data atual
    const initialCalendarYear = monthFilter && monthFilter !== 'all'
        ? parseInt(monthFilter.split('-')[0], 10)
        : undefined;
    const initialCalendarMonth = monthFilter && monthFilter !== 'all'
        ? parseInt(monthFilter.split('-')[1], 10) - 1
        : undefined;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !accountId) return;

        addLog({
            date,
            amount: parseFloat(amount),
            accountId,
            type: parseFloat(amount) >= 0 ? 'profit' : 'loss'
        });

        setAmount('');
        setShowForm(false);
    };

    const handleAddTradeForDate = (selectedDate) => {
        setDate(selectedDate);
        setShowForm(true);
    };

    const positiveDays = accountLogs.filter(l => l.amount > 0).length;
    const negativeDays = accountLogs.filter(l => l.amount < 0).length;
    const totalPeriod = accountLogs.reduce((acc, l) => acc + Number(l.amount), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.12)', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
                            <CalendarIcon size={20} color="#00d2ff" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Pregões Diários</h3>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                Histórico visual das operações e resultados por dia
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Seletor de Modo: Calendário vs Lista */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '3px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <button
                                type="button"
                                onClick={() => setViewMode('calendar')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: viewMode === 'calendar' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                                    color: viewMode === 'calendar' ? '#0f172a' : 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: viewMode === 'calendar' ? '700' : '500',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <LayoutGrid size={15} />
                                <span>Calendário</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: viewMode === 'table' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                                    color: viewMode === 'table' ? '#0f172a' : 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: viewMode === 'table' ? '700' : '500',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <List size={15} />
                                <span>Lista</span>
                            </button>
                        </div>

                        {/* Botão Novo Registro */}
                        <Button onClick={() => setShowForm(!showForm)} variant="secondary" style={{ padding: '8px 16px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)', color: '#00d2ff' }}>
                            <Plus size={16} /> Novo Registro
                        </Button>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <NeonInput
                                label="Data da Operação"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                            <NeonInput
                                label={`Resultado (${currencySymbol})`}
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ex: 500 ou -200"
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
                                Cancelar
                            </Button>
                            <Button type="submit" style={{ flex: 2, padding: '12px 24px', fontSize: '1rem', background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none', height: '54px', fontWeight: 'bold' }}>
                                Salvar Operação
                            </Button>
                        </div>
                    </form>
                )}

                {/* Exibição em Modo Calendário */}
                {viewMode === 'calendar' ? (
                    <TradingCalendar
                        logs={allAccountLogs}
                        currencySymbol={currencySymbol}
                        onAddTradeForDate={handleAddTradeForDate}
                        onDeleteTrade={deleteLog}
                        initialYear={initialCalendarYear}
                        initialMonth={initialCalendarMonth}
                    />
                ) : (
                    /* Exibição em Modo Tabela */
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <TrendingUp size={16} color="#00d2ff" />
                                <span style={{ fontSize: '0.85rem' }}>Gain: <strong style={{ color: '#00d2ff' }}>{positiveDays} dias</strong></span>
                            </div>
                            <div style={{ background: 'rgba(220, 36, 48, 0.1)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <TrendingDown size={16} color="#dc2430" />
                                <span style={{ fontSize: '0.85rem' }}>Loss: <strong style={{ color: '#dc2430' }}>{negativeDays} dias</strong></span>
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Total Período:</span>
                                <strong style={{ color: totalPeriod >= 0 ? '#00d2ff' : '#dc2430', fontSize: '0.95rem' }}>
                                    {totalPeriod >= 0 ? '+' : ''}{currencySymbol} {totalPeriod.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)' }}>Data</th>
                                        <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Resultado</th>
                                        <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Status</th>
                                        <th style={{ textAlign: 'right', padding: '12px', color: 'var(--color-text-muted)' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Nenhum registro ainda.</td>
                                        </tr>
                                    ) : (
                                        accountLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px' }}>
                                                    {(() => {
                                                        if (!log.date) return '-';
                                                        const [year, month, day] = log.date.split('-');
                                                        return `${day}/${month}/${year}`;
                                                    })()}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: log.amount >= 0 ? '#00d2ff' : '#dc2430' }}>
                                                    {currencySymbol} {Number(log.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                                    {log.amount >= 0 ? (
                                                        <span style={{ background: 'rgba(0, 210, 255, 0.2)', color: '#00d2ff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>WIN</span>
                                                    ) : (
                                                        <span style={{ background: 'rgba(220, 36, 48, 0.2)', color: '#dc2430', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>LOSS</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => deleteLog(log.id)}
                                                        title="Excluir pregão"
                                                        style={{ background: 'transparent', color: '#ef4444', cursor: 'pointer', border: 'none', padding: '4px' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default DailyLog;
