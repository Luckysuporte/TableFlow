import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import Button from './Button';

const TradingCalendar = ({
    logs = [],
    currencySymbol = 'R$',
    onAddTradeForDate,
    onDeleteTrade,
    initialYear,
    initialMonth // 0-indexed (0 = Jan, 11 = Dec)
}) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(() => {
        const y = initialYear !== undefined ? initialYear : today.getFullYear();
        const m = initialMonth !== undefined ? initialMonth : today.getMonth();
        return new Date(y, m, 1);
    });

    const [selectedDayDetails, setSelectedDayDetails] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

    // Map logs by date (YYYY-MM-DD)
    const logsByDate = React.useMemo(() => {
        const map = {};
        logs.forEach(log => {
            if (!log.date) return;
            // Garantir formato YYYY-MM-DD
            const d = log.date.split('T')[0];
            if (!map[d]) {
                map[d] = {
                    total: 0,
                    trades: []
                };
            }
            map[d].total += Number(log.amount || 0);
            map[d].trades.push(log);
        });
        return map;
    }, [logs]);

    // Calcular estatísticas do mês exibido
    const monthStats = React.useMemo(() => {
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        let total = 0;
        let tradingDays = 0;
        let winDays = 0;
        let lossDays = 0;

        Object.keys(logsByDate).forEach(d => {
            if (d.startsWith(prefix)) {
                tradingDays++;
                const dayTotal = logsByDate[d].total;
                total += dayTotal;
                if (dayTotal > 0) winDays++;
                else if (dayTotal < 0) lossDays++;
            }
        });

        return { total, tradingDays, winDays, lossDays };
    }, [logsByDate, year, month]);

    // Navegação
    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDayDetails(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDayDetails(null);
    };

    const handleGoToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setSelectedDayDetails(null);
    };

    // Montar os dias da grade (Monday-first)
    const calendarGrid = React.useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // getDay: 0 = Dom, 1 = Seg, ..., 6 = Sab
        // Queremos Seg = 0, ..., Dom = 6
        let firstDayIndex = firstDayOfMonth.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;

        const daysInMonth = lastDayOfMonth.getDate();
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        const grid = [];

        // Dias do mês anterior
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const d = prevMonthLastDay - i;
            const prevM = month === 0 ? 11 : month - 1;
            const prevY = month === 0 ? year - 1 : year;
            const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            grid.push({
                day: d,
                dateStr,
                isCurrentMonth: false
            });
        }

        // Dias do mês atual
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            grid.push({
                day: i,
                dateStr,
                isCurrentMonth: true
            });
        }

        // Dias do próximo mês para completar semanas de 7
        const remaining = 7 - (grid.length % 7);
        if (remaining < 7) {
            for (let i = 1; i <= remaining; i++) {
                const nextM = month === 11 ? 0 : month + 1;
                const nextY = month === 11 ? year + 1 : year;
                const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                grid.push({
                    day: i,
                    dateStr,
                    isCurrentMonth: false
                });
            }
        }

        return grid;
    }, [year, month]);

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const formatCurrency = (val) => {
        return Math.abs(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header de Controles do Calendário */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px'
            }}>
                {/* Lado Esquerdo: Botão Hoje e Setas */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={handleGoToday}
                        style={{
                            padding: '6px 14px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Hoje
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            title="Mês Anterior"
                            style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            title="Próximo Mês"
                            style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <h4 style={{
                        margin: '0 0 0 8px',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: 'white',
                        minWidth: '180px'
                    }}>
                        {monthNames[month]} <span style={{ color: '#00d2ff' }}>{year}</span>
                    </h4>
                </div>

                {/* Lado Direito: Resumo do Mês (Monthly Stats) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.85rem'
                    }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Resultado do Mês:</span>
                        <strong style={{
                            color: monthStats.total > 0 ? '#10b981' : monthStats.total < 0 ? '#ef4444' : 'rgba(255,255,255,0.7)',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: monthStats.total > 0 ? 'rgba(16, 185, 129, 0.15)' : monthStats.total < 0 ? 'rgba(239, 68, 68, 0.15)' : 'transparent'
                        }}>
                            {monthStats.total > 0 ? '+' : monthStats.total < 0 ? '-' : ''}
                            {currencySymbol} {formatCurrency(monthStats.total)}
                        </strong>
                    </div>

                    <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(0, 210, 255, 0.08)',
                        border: '1px solid rgba(0, 210, 255, 0.2)',
                        color: '#00d2ff',
                        fontSize: '0.82rem',
                        fontWeight: '600'
                    }}>
                        {monthStats.tradingDays} {monthStats.tradingDays === 1 ? 'dia operado' : 'dias operados'}
                    </div>
                </div>
            </div>

            {/* Container do Calendário */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                overflow: 'hidden'
            }}>
                {/* Linha dos Dias da Semana */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    {weekDays.map((wd, idx) => (
                        <div key={wd} style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            color: idx >= 5 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.65)',
                            letterSpacing: '0.5px'
                        }}>
                            {wd}
                        </div>
                    ))}
                </div>

                {/* Grade de Células de Dias */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '1px',
                    background: 'rgba(255, 255, 255, 0.05)'
                }}>
                    {calendarGrid.map((item, idx) => {
                        const dayLog = logsByDate[item.dateStr];
                        const hasTrade = Boolean(dayLog && dayLog.trades.length > 0);
                        const isWin = hasTrade && dayLog.total >= 0;
                        const isLoss = hasTrade && dayLog.total < 0;
                        const isToday = item.dateStr === todayStr;
                        const isSelected = selectedDayDetails?.dateStr === item.dateStr;

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (hasTrade) {
                                        setSelectedDayDetails(isSelected ? null : { dateStr: item.dateStr, data: dayLog });
                                    } else if (onAddTradeForDate && item.isCurrentMonth) {
                                        onAddTradeForDate(item.dateStr);
                                    }
                                }}
                                style={{
                                    minHeight: '92px',
                                    padding: '8px',
                                    background: isSelected
                                        ? 'rgba(0, 210, 255, 0.12)'
                                        : item.isCurrentMonth
                                            ? '#0f172a'
                                            : '#0b1120',
                                    opacity: item.isCurrentMonth ? 1 : 0.45,
                                    cursor: (hasTrade || (onAddTradeForDate && item.isCurrentMonth)) ? 'pointer' : 'default',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    transition: 'all 0.2s',
                                    border: isSelected ? '1px solid #00d2ff' : 'none'
                                }}
                            >
                                {/* Número do Dia */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.82rem',
                                        fontWeight: isToday ? '700' : '500',
                                        width: isToday ? '24px' : 'auto',
                                        height: isToday ? '24px' : 'auto',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        background: isToday ? '#00d2ff' : 'transparent',
                                        color: isToday ? '#0f172a' : item.isCurrentMonth ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                                        boxShadow: isToday ? '0 0 10px rgba(0,210,255,0.6)' : 'none'
                                    }}>
                                        {item.day}
                                    </span>

                                    {/* Indicador de clique para adicionar se estiver vazio no mês atual */}
                                    {!hasTrade && item.isCurrentMonth && onAddTradeForDate && (
                                        <span
                                            title="Clique para registrar pregão neste dia"
                                            style={{
                                                fontSize: '0.7rem',
                                                color: 'rgba(255,255,255,0.15)',
                                                opacity: 0,
                                                transition: 'opacity 0.2s'
                                            }}
                                            className="cal-add-hint"
                                        >
                                            +
                                        </span>
                                    )}
                                </div>

                                {/* Bloco de Trade do Dia (Estilo Card Verde / Vermelho) */}
                                {hasTrade && (
                                    <div style={{
                                        marginTop: '4px',
                                        padding: '6px 8px',
                                        borderRadius: '8px',
                                        background: isWin
                                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(5, 150, 105, 0.12))'
                                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(220, 38, 38, 0.12))',
                                        border: isWin
                                            ? '1px solid rgba(16, 185, 129, 0.35)'
                                            : '1px solid rgba(239, 68, 68, 0.35)',
                                        boxShadow: isWin
                                            ? '0 2px 8px rgba(16, 185, 129, 0.1)'
                                            : '0 2px 8px rgba(239, 68, 68, 0.1)'
                                    }}>
                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            color: isWin ? '#34d399' : '#f87171',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {isWin ? '+' : '-'}{currencySymbol} {formatCurrency(dayLog.total)}
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: isWin ? 'rgba(52, 211, 153, 0.8)' : 'rgba(248, 113, 113, 0.8)',
                                            marginTop: '2px'
                                        }}>
                                            {dayLog.trades.length} {dayLog.trades.length === 1 ? 'posição' : 'posições'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Painel de Detalhes ao Clicar em um Dia do Calendário */}
            {selectedDayDetails && (
                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarIcon size={18} color="#00d2ff" />
                            <strong style={{ color: 'white', fontSize: '1rem' }}>
                                Operações de {(() => {
                                    const [y, m, d] = selectedDayDetails.dateStr.split('-');
                                    return `${d}/${m}/${y}`;
                                })()}
                            </strong>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                color: selectedDayDetails.data.total >= 0 ? '#10b981' : '#ef4444'
                            }}>
                                Total: {selectedDayDetails.data.total >= 0 ? '+' : ''}{currencySymbol} {formatCurrency(selectedDayDetails.data.total)}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedDayDetails(null)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedDayDetails.data.trades.map(trade => (
                            <div key={trade.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        background: trade.amount >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: trade.amount >= 0 ? '#34d399' : '#f87171'
                                    }}>
                                        {trade.amount >= 0 ? 'WIN' : 'LOSS'}
                                    </span>
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                                        {trade.amount >= 0 ? '+' : ''}{currencySymbol} {formatCurrency(trade.amount)}
                                    </span>
                                </div>

                                {onDeleteTrade && (
                                    <button
                                        type="button"
                                        onClick={() => onDeleteTrade(trade.id)}
                                        title="Excluir este lançamento"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            padding: '4px'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradingCalendar;
