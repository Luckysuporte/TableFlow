import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [goal, setGoal] = useState({ amount: 10000, name: 'Meu Objetivo' });
    const [accounts, setAccounts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modo de Privacidade Global (ocultar/exibir valores em todo o app)
    const [privacyMode, setPrivacyMode] = useState(() => {
        const saved = localStorage.getItem('tableflow_privacy_balances');
        return saved !== 'false';
    });

    const togglePrivacyMode = () => {
        setPrivacyMode(prev => {
            const next = !prev;
            localStorage.setItem('tableflow_privacy_balances', next.toString());
            return next;
        });
    };

    // Load data from Supabase when user logs in
    useEffect(() => {
        if (user?.id) {
            loadUserData();
        } else {
            // Reset state when user logs out
            setGoal({ amount: 10000, name: 'Meu Objetivo' });
            setAccounts([]);
            setLogs([]);
            setWithdrawals([]);
            setLoading(false);
        }
    }, [user?.id]);

    const loadUserData = async () => {
        try {
            setLoading(true);

            // Load goal with better error handling
            const { data: goalData, error: goalError } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle(); // Use maybeSingle instead of single to avoid error when no rows

            if (goalError) {
                console.error('Error loading goal:', goalError);
            }

            if (goalData) {
                setGoal({ amount: goalData.amount, name: goalData.name });
            } else {
                // Create default goal if none exists
                try {
                    await createDefaultGoal();
                } catch (error) {
                    console.error('Error creating default goal:', error);
                    // Set default goal locally if creation fails
                    setGoal({ amount: 10000, name: 'Meu Objetivo' });
                }
            }

            // Load accounts
            const { data: accountsData, error: accountsError } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (accountsError) {
                console.error('Error loading accounts:', accountsError);
            } else {
                setAccounts(accountsData || []);
            }

            // Load logs
            const { data: logsData, error: logsError } = await supabase
                .from('logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (logsError) {
                console.error('Error loading logs:', logsError);
            } else {
                // Normalize field names to camelCase
                const normalizedLogs = (logsData || []).map(log => ({
                    ...log,
                    accountId: log.account_id
                }));
                setLogs(normalizedLogs);
            }

            // Load withdrawals
            const { data: withdrawalsData, error: withdrawalsError } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (withdrawalsError) {
                console.error('Error loading withdrawals:', withdrawalsError);
            } else {
                // Normalize field names to camelCase
                const normalizedWithdrawals = (withdrawalsData || []).map(w => ({
                    ...w,
                    accountId: w.account_id,
                    grossAmount: w.gross_amount,
                    taxPercentage: w.tax_percentage,
                    netAmount: w.net_amount
                }));
                setWithdrawals(normalizedWithdrawals);
            }

            // Migrate data from localStorage if exists
            await migrateFromLocalStorage();

        } catch (error) {
            console.error('Error loading user data:', error);
            // Set default values to prevent infinite loading
            setGoal({ amount: 10000, name: 'Meu Objetivo' });
            setAccounts([]);
            setLogs([]);
            setWithdrawals([]);
        } finally {
            setLoading(false);
        }
    };

    const createDefaultGoal = async () => {
        try {
            const { data, error } = await supabase
                .from('goals')
                .insert([
                    {
                        user_id: user.id,
                        name: 'Meu Objetivo',
                        amount: 10000
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error creating default goal:', error);
            } else {
                setGoal({ amount: data.amount, name: data.name });
            }
        } catch (error) {
            console.error('Error creating default goal:', error);
        }
    };

    const migrateFromLocalStorage = async () => {
        try {
            // Check if there's data in localStorage
            const localGoal = localStorage.getItem(`tableflow_goal_${user?.email}`);
            const localAccounts = localStorage.getItem(`tableflow_accounts_${user?.email}`);
            const localLogs = localStorage.getItem(`tableflow_logs_${user?.email}`);
            const localWithdrawals = localStorage.getItem(`tableflow_withdrawals_${user?.email}`);

            if (!localGoal && !localAccounts && !localLogs && !localWithdrawals) {
                return; // No data to migrate
            }

            console.log('Migrating data from localStorage to Supabase...');

            // Migrate goal
            if (localGoal) {
                const parsedGoal = JSON.parse(localGoal);
                const goalData = typeof parsedGoal === 'number'
                    ? { amount: parsedGoal, name: 'Meu Objetivo' }
                    : parsedGoal;

                await supabase
                    .from('goals')
                    .upsert([
                        {
                            user_id: user.id,
                            name: goalData.name || 'Meu Objetivo',
                            amount: goalData.amount || 10000
                        }
                    ]);
            }

            // Migrate accounts
            if (localAccounts) {
                const parsedAccounts = JSON.parse(localAccounts);
                if (parsedAccounts.length > 0) {
                    const accountsToInsert = parsedAccounts.map(acc => ({
                        user_id: user.id,
                        number: acc.number,
                        name: acc.name,
                        type: acc.type,
                        phase: acc.phase,
                        goal: acc.goal
                    }));

                    const { data: insertedAccounts } = await supabase
                        .from('accounts')
                        .insert(accountsToInsert)
                        .select();

                    // Create a mapping of old IDs to new IDs
                    const idMapping = {};
                    parsedAccounts.forEach((oldAcc, index) => {
                        if (insertedAccounts && insertedAccounts[index]) {
                            idMapping[oldAcc.id] = insertedAccounts[index].id;
                        }
                    });

                    // Migrate logs with updated account_id
                    if (localLogs) {
                        const parsedLogs = JSON.parse(localLogs);
                        if (parsedLogs.length > 0) {
                            const logsToInsert = parsedLogs.map(log => ({
                                user_id: user.id,
                                account_id: idMapping[log.accountId] || null,
                                date: log.date,
                                amount: log.amount
                            })).filter(log => log.account_id); // Only insert logs with valid account_id

                            if (logsToInsert.length > 0) {
                                await supabase.from('logs').insert(logsToInsert);
                            }
                        }
                    }

                    // Migrate withdrawals with updated account_id
                    if (localWithdrawals) {
                        const parsedWithdrawals = JSON.parse(localWithdrawals);
                        if (parsedWithdrawals.length > 0) {
                            const withdrawalsToInsert = parsedWithdrawals.map(w => ({
                                user_id: user.id,
                                account_id: idMapping[w.accountId] || null,
                                date: w.date,
                                gross_amount: w.grossAmount,
                                tax: w.tax,
                                tax_percentage: w.taxPercentage,
                                net_amount: w.netAmount
                            }));

                            await supabase.from('withdrawals').insert(withdrawalsToInsert);
                        }
                    }
                }
            }

            // Clear localStorage after successful migration
            localStorage.removeItem(`tableflow_goal_${user.email}`);
            localStorage.removeItem(`tableflow_accounts_${user.email}`);
            localStorage.removeItem(`tableflow_logs_${user.email}`);
            localStorage.removeItem(`tableflow_withdrawals_${user.email}`);

            console.log('Migration completed successfully!');

            // Reload data from Supabase
            await loadUserData();

        } catch (error) {
            console.error('Error migrating data from localStorage:', error);
        }
    };

    const updateGoal = async (newGoalData) => {
        try {
            const updatedGoal = { ...goal, ...newGoalData };
            setGoal(updatedGoal);

            const { error } = await supabase
                .from('goals')
                .upsert([
                    {
                        user_id: user.id,
                        name: updatedGoal.name,
                        amount: updatedGoal.amount
                    }
                ]);

            if (error) {
                console.error('Error updating goal:', error);
            }
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const addAccount = async (account) => {
        try {
            console.log('Tentando adicionar conta:', account);

            const accountPayload = {
                user_id: user.id,
                number: account.number,
                name: account.name,
                type: account.type,
                phase: account.phase,
                goal: account.goal !== undefined && account.goal !== '' ? Number(account.goal) : 0,
                initial_balance: account.initial_balance !== undefined && account.initial_balance !== '' ? Number(account.initial_balance) : 0,
                currency: account.currency || 'BRL',
                max_loss: account.max_loss !== undefined && account.max_loss !== '' ? Number(account.max_loss) : 0
            };

            let { data, error } = await supabase
                .from('accounts')
                .insert([accountPayload])
                .select()
                .single();

            // Se a coluna ainda não foi criada no Supabase pelo usuário, fazer fallback seguro
            if (error && (error.message?.includes('initial_balance') || error.message?.includes('currency') || error.message?.includes('max_loss'))) {
                console.warn('Colunas initial_balance/currency/max_loss ainda não criadas no Supabase. Salvando campos padrão.');
                const fallbackPayload = {
                    user_id: user.id,
                    number: account.number,
                    name: account.name,
                    type: account.type,
                    phase: account.phase,
                    goal: accountPayload.goal
                };
                const retry = await supabase.from('accounts').insert([fallbackPayload]).select().single();
                if (retry.error) {
                    throw retry.error;
                }
                data = {
                    ...retry.data,
                    initial_balance: accountPayload.initial_balance,
                    currency: accountPayload.currency,
                    max_loss: accountPayload.max_loss
                };
                error = null;
            }

            if (error) {
                console.error('Error adding account:', error);
                alert(`Erro ao adicionar conta: ${error.message}`);
                return false;
            } else {
                console.log('Conta adicionada com sucesso:', data);
                setAccounts(prev => [data, ...prev]);
                return true;
            }
        } catch (error) {
            console.error('Error adding account:', error);
            alert(`Erro ao adicionar conta: ${error.message}`);
            return false;
        }
    };

    const updateAccount = async (id, updatedData) => {
        try {
            let updatePayload = { ...updatedData };
            if (updatePayload.goal !== undefined && updatePayload.goal !== null && updatePayload.goal !== '') {
                updatePayload.goal = Number(updatePayload.goal);
            }
            if (updatePayload.initial_balance !== undefined && updatePayload.initial_balance !== null && updatePayload.initial_balance !== '') {
                updatePayload.initial_balance = Number(updatePayload.initial_balance);
            }
            if (updatePayload.max_loss !== undefined && updatePayload.max_loss !== null && updatePayload.max_loss !== '') {
                updatePayload.max_loss = Number(updatePayload.max_loss);
            }

            let { error } = await supabase
                .from('accounts')
                .update(updatePayload)
                .eq('id', id)
                .eq('user_id', user.id);

            // Fallback se colunas ainda não existirem no Supabase
            if (error && (error.message?.includes('initial_balance') || error.message?.includes('currency') || error.message?.includes('max_loss'))) {
                console.warn('Colunas initial_balance/currency/max_loss ausentes no Supabase. Atualizando campos compatíveis.');
                const { initial_balance, currency, max_loss, ...fallbackPayload } = updatePayload;
                const retry = await supabase
                    .from('accounts')
                    .update(fallbackPayload)
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (retry.error) throw retry.error;
                error = null;
            }

            if (error) {
                console.error('Error updating account:', error);
                alert(`Erro ao atualizar conta: ${error.message}`);
                return false;
            } else {
                setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...updatePayload } : acc));
                return true;
            }
        } catch (error) {
            console.error('Error updating account:', error);
            alert(`Erro ao atualizar conta: ${error.message}`);
            return false;
        }
    };

    const deleteAccount = async (id) => {
        try {
            const { error } = await supabase
                .from('accounts')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting account:', error);
            } else {
                setAccounts(prev => prev.filter(acc => acc.id !== id));
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const addLog = async (log) => {
        try {
            const { data, error } = await supabase
                .from('logs')
                .insert([
                    {
                        user_id: user.id,
                        account_id: log.accountId,
                        date: log.date,
                        amount: log.amount
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error adding log:', error);
            } else {
                // Normalize field names to camelCase
                const normalizedLog = {
                    ...data,
                    accountId: data.account_id
                };
                setLogs(prev => [normalizedLog, ...prev]);
            }
        } catch (error) {
            console.error('Error adding log:', error);
        }
    };

    const deleteLog = async (id) => {
        try {
            const { error } = await supabase
                .from('logs')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting log:', error);
            } else {
                setLogs(prev => prev.filter(log => log.id !== id));
            }
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };

    const addWithdrawal = async (withdrawal) => {
        try {
            const { data, error } = await supabase
                .from('withdrawals')
                .insert([
                    {
                        user_id: user.id,
                        account_id: withdrawal.accountId,
                        date: withdrawal.date,
                        gross_amount: withdrawal.grossAmount,
                        tax: withdrawal.tax,
                        tax_percentage: withdrawal.taxPercentage,
                        net_amount: withdrawal.netAmount
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error adding withdrawal:', error);
            } else {
                // Convert snake_case to camelCase for consistency with existing code
                const formattedData = {
                    ...data,
                    grossAmount: data.gross_amount,
                    taxPercentage: data.tax_percentage,
                    netAmount: data.net_amount,
                    accountId: data.account_id
                };
                setWithdrawals(prev => [formattedData, ...prev]);
            }
        } catch (error) {
            console.error('Error adding withdrawal:', error);
        }
    };

    const deleteWithdrawal = async (id) => {
        try {
            const { error } = await supabase
                .from('withdrawals')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting withdrawal:', error);
            } else {
                setWithdrawals(prev => prev.filter(w => w.id !== id));
            }
        } catch (error) {
            console.error('Error deleting withdrawal:', error);
        }
    };

    const mergeAccounts = async (sourceAccountId, targetAccountId) => {
        try {
            console.log(`Unificando mesa ${sourceAccountId} na mesa ${targetAccountId}...`);

            // 1. Mover logs para a conta destino
            const { error: logsError } = await supabase
                .from('logs')
                .update({ account_id: targetAccountId })
                .eq('account_id', sourceAccountId)
                .eq('user_id', user.id);

            if (logsError) throw logsError;

            // 2. Mover saques (se houver)
            const { error: wError } = await supabase
                .from('withdrawals')
                .update({ account_id: targetAccountId })
                .eq('account_id', sourceAccountId)
                .eq('user_id', user.id);

            if (wError) console.warn('Aviso ao mover saques:', wError);

            // 3. Deletar conta de origem
            const { error: delError } = await supabase
                .from('accounts')
                .delete()
                .eq('id', sourceAccountId)
                .eq('user_id', user.id);

            if (delError) throw delError;

            // 4. Atualizar estado local
            setAccounts(prev => prev.filter(acc => acc.id !== sourceAccountId));
            setLogs(prev => prev.map(log =>
                (log.accountId === sourceAccountId || log.account_id === sourceAccountId)
                    ? { ...log, accountId: targetAccountId, account_id: targetAccountId }
                    : log
            ));
            setWithdrawals(prev => prev.map(w =>
                (w.accountId === sourceAccountId || w.account_id === sourceAccountId)
                    ? { ...w, accountId: targetAccountId, account_id: targetAccountId }
                    : w
            ));

            return true;
        } catch (error) {
            console.error('Erro ao unificar mesas:', error);
            alert(`Erro ao unificar mesas: ${error.message}`);
            return false;
        }
    };

    const getSummary = (accountId = null, monthFilter = null) => {
        let totalResult = 0;
        let selectedMonthResult = 0;
        let currentMonthResult = 0;

        const now = new Date();
        const curYear = now.getFullYear();
        const curMonth = String(now.getMonth() + 1).padStart(2, '0');
        const curDay = String(now.getDate()).padStart(2, '0');
        const todayStr = `${curYear}-${curMonth}-${curDay}`;
        const currentMonthStr = `${curYear}-${curMonth}`;

        let accountLogs = [];

        if (accountId) {
            accountLogs = logs.filter(log =>
                (log.accountId === accountId) || (log.account_id === accountId)
            );
            totalResult = accountLogs.reduce((acc, log) => acc + Number(log.amount), 0);

            const curMonthLogs = accountLogs.filter(log => log.date?.startsWith(currentMonthStr));
            currentMonthResult = curMonthLogs.reduce((acc, log) => acc + Number(log.amount), 0);

            if (monthFilter && monthFilter !== 'all') {
                const filtered = accountLogs.filter(log => log.date?.startsWith(monthFilter));
                selectedMonthResult = filtered.reduce((acc, log) => acc + Number(log.amount), 0);
            } else {
                selectedMonthResult = totalResult;
            }
        } else {
            totalResult = withdrawals.reduce((acc, w) =>
                acc + Number(w.netAmount || w.net_amount || 0), 0
            );
            selectedMonthResult = totalResult;
        }

        let targetAmount = Number(goal.amount || 0);
        let initialBalance = 0;
        let currency = 'BRL';
        let accountWithdrawalsTotal = 0;
        let todayResult = 0;
        let maxLoss = 0;

        if (accountId) {
            const account = accounts.find(a => a.id === accountId);
            if (account) {
                if (account.goal !== undefined && account.goal !== null) {
                    targetAmount = Number(account.goal);
                }
                initialBalance = Number(account.initial_balance || 0);
                currency = account.currency || 'BRL';
                maxLoss = Number(account.max_loss || 0);
            }

            const todayLogs = accountLogs.filter(log => log.date === todayStr);
            todayResult = todayLogs.reduce((acc, log) => acc + Number(log.amount), 0);

            const accountWithdrawals = withdrawals.filter(w =>
                (w.accountId === accountId) || (w.account_id === accountId)
            );
            accountWithdrawalsTotal = accountWithdrawals.reduce((acc, w) =>
                acc + Number(w.grossAmount || w.gross_amount || 0), 0
            );
        }

        const currentBalance = initialBalance + totalResult - accountWithdrawalsTotal;
        const activeResultForGoal = (monthFilter && monthFilter !== 'all') ? selectedMonthResult : totalResult;
        const remaining = targetAmount - activeResultForGoal;
        const progress = targetAmount > 0 ? (activeResultForGoal / targetAmount) * 100 : 0;

        // Cálculo da barra de perda (drawdown) para prop firms
        const lossProgress = (maxLoss > 0 && activeResultForGoal < 0)
            ? Math.min((Math.abs(activeResultForGoal) / maxLoss) * 100, 100)
            : 0;
        const isAccountBlown = maxLoss > 0 && activeResultForGoal < 0 && Math.abs(activeResultForGoal) >= maxLoss;

        return {
            totalResult,
            selectedMonthResult,
            currentMonthResult,
            todayResult,
            initialBalance,
            currentBalance,
            accountWithdrawalsTotal,
            currency,
            targetAmount,
            maxLoss,
            remaining: remaining > 0 ? remaining : 0,
            progress: Math.min(Math.max(progress, 0), 100),
            lossProgress,
            isGoalMet: targetAmount > 0 && activeResultForGoal >= targetAmount,
            isAccountBlown
        };
    };

    // Métricas Agregadas de Alta Performance para a Visão Geral
    const getOverviewKPIs = () => {
        const now = new Date();
        const curYear = now.getFullYear();
        const curMonth = String(now.getMonth() + 1).padStart(2, '0');
        const curDay = String(now.getDate()).padStart(2, '0');
        const todayStr = `${curYear}-${curMonth}-${curDay}`;
        const currentMonthStr = `${curYear}-${curMonth}`;

        const accountMap = new Map();
        accounts.forEach(acc => accountMap.set(acc.id, acc));

        // 1. Hoje
        let todayResultBRL = 0;
        let todayResultUSD = 0;

        // 2. Mês Atual
        let monthResultBRL = 0;
        let monthResultUSD = 0;

        logs.forEach(log => {
            const accId = log.accountId || log.account_id;
            const acc = accountMap.get(accId);
            const currency = acc?.currency || 'BRL';
            const amount = Number(log.amount || 0);

            if (log.date === todayStr) {
                if (currency === 'USD') todayResultUSD += amount;
                else todayResultBRL += amount;
            }

            if (log.date && log.date.startsWith(currentMonthStr)) {
                if (currency === 'USD') monthResultUSD += amount;
                else monthResultBRL += amount;
            }
        });

        // 3. Capital Sob Gestão (Saldos em Corretora das Contas Reais)
        let totalBalanceBRL = 0;
        let totalBalanceUSD = 0;

        const realAccounts = accounts.filter(a => a.type === 'real');
        realAccounts.forEach(acc => {
            const initial = Number(acc.initial_balance || 0);
            const currency = acc.currency || 'BRL';
            const accLogs = logs.filter(l => (l.accountId === acc.id || l.account_id === acc.id));
            const accProfit = accLogs.reduce((sum, l) => sum + Number(l.amount || 0), 0);
            const accW = withdrawals.filter(w => (w.accountId === acc.id || w.account_id === acc.id));
            const accWithdrawn = accW.reduce((sum, w) => sum + Number(w.grossAmount || w.gross_amount || 0), 0);
            const available = initial + accProfit - accWithdrawn;
            const positiveAvailable = available > 0 ? available : 0;

            if (currency === 'USD') totalBalanceUSD += positiveAvailable;
            else totalBalanceBRL += positiveAvailable;
        });

        // 4. Win Rate do Mês Atual (Agrupado por dia de pregão)
        const monthLogs = logs.filter(l => l.date && l.date.startsWith(currentMonthStr));
        const dayPnlMap = {};
        monthLogs.forEach(l => {
            dayPnlMap[l.date] = (dayPnlMap[l.date] || 0) + Number(l.amount || 0);
        });

        const tradingDays = Object.keys(dayPnlMap);
        const winDaysCount = tradingDays.filter(d => dayPnlMap[d] > 0).length;
        const lossDaysCount = tradingDays.filter(d => dayPnlMap[d] < 0).length;
        const totalTradingDays = tradingDays.length;
        const winRate = totalTradingDays > 0 ? Math.round((winDaysCount / totalTradingDays) * 100) : 0;

        // 5. Dados da Curva de Capital (Equity Curve)
        const allDaysMap = {};
        logs.forEach(l => {
            if (!l.date) return;
            allDaysMap[l.date] = (allDaysMap[l.date] || 0) + Number(l.amount || 0);
        });

        const sortedDates = Object.keys(allDaysMap).sort();
        let runningAccumulated = 0;
        const equityCurveData = sortedDates.map(d => {
            const daily = allDaysMap[d];
            runningAccumulated += daily;
            const [y, m, day] = d.split('-');
            return {
                date: `${day}/${m}`,
                fullDate: d,
                daily,
                accumulated: runningAccumulated
            };
        });

        // 6. Ranking das Melhores Mesas do Mês
        const accountsPerformance = accounts.map(acc => {
            const accLogs = logs.filter(l => (l.accountId === acc.id || l.account_id === acc.id) && l.date && l.date.startsWith(currentMonthStr));
            const monthProfit = accLogs.reduce((sum, l) => sum + Number(l.amount || 0), 0);
            return {
                id: acc.id,
                name: acc.name,
                number: acc.number,
                type: acc.type,
                currency: acc.currency || 'BRL',
                monthProfit,
                tradesCount: accLogs.length
            };
        }).sort((a, b) => b.monthProfit - a.monthProfit);

        return {
            todayStr,
            currentMonthStr,
            todayResultBRL,
            todayResultUSD,
            monthResultBRL,
            monthResultUSD,
            totalBalanceBRL,
            totalBalanceUSD,
            winRate,
            winDaysCount,
            lossDaysCount,
            totalTradingDays,
            equityCurveData,
            accountsPerformance
        };
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                color: 'white'
            }}>
                Carregando dados...
            </div>
        );
    }

    return (
        <DataContext.Provider value={{
            goal,
            accounts,
            logs,
            withdrawals,
            privacyMode,
            togglePrivacyMode,
            updateGoal,
            addAccount,
            updateAccount,
            deleteAccount,
            mergeAccounts,
            addLog,
            deleteLog,
            addWithdrawal,
            deleteWithdrawal,
            getSummary,
            getOverviewKPIs
        }}>
            {children}
        </DataContext.Provider>
    );
};
