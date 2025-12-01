import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [goal, setGoal] = useState(() => {
        const saved = localStorage.getItem(`tableflow_goal_${user?.email}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration: if it's a number, convert to object
            if (typeof parsed === 'number') {
                return { amount: parsed, name: 'Meu Objetivo' };
            }
            return parsed;
        }
        return { amount: 10000, name: 'Meu Objetivo' };
    });

    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem(`tableflow_accounts_${user?.email}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem(`tableflow_logs_${user?.email}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [withdrawals, setWithdrawals] = useState(() => {
        const saved = localStorage.getItem(`tableflow_withdrawals_${user?.email}`);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (user?.email) {
            localStorage.setItem(`tableflow_goal_${user.email}`, JSON.stringify(goal));
            localStorage.setItem(`tableflow_accounts_${user.email}`, JSON.stringify(accounts));
            localStorage.setItem(`tableflow_logs_${user.email}`, JSON.stringify(logs));
            localStorage.setItem(`tableflow_withdrawals_${user.email}`, JSON.stringify(withdrawals));
        }
    }, [goal, accounts, logs, withdrawals, user]);

    const updateGoal = (newGoalData) => {
        setGoal(prev => ({ ...prev, ...newGoalData }));
    };

    const addAccount = (account) => {
        setAccounts(prev => [...prev, { ...account, id: Date.now().toString() }]);
    };

    const updateAccount = (id, updatedData) => {
        setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...updatedData } : acc));
    };

    const deleteAccount = (id) => {
        setAccounts(prev => prev.filter(acc => acc.id !== id));
    };

    const addLog = (log) => {
        setLogs(prev => [...prev, { ...log, id: Date.now().toString() }]);
    };

    const deleteLog = (id) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    };

    const addWithdrawal = (withdrawal) => {
        setWithdrawals(prev => [...prev, { ...withdrawal, id: Date.now().toString() }]);
    };

    const deleteWithdrawal = (id) => {
        setWithdrawals(prev => prev.filter(w => w.id !== id));
    };

    const getSummary = (accountId = null) => {
        // Filter withdrawals by accountId if provided
        const filteredWithdrawals = accountId
            ? withdrawals.filter(w => w.accountId === accountId)
            : withdrawals;

        // Calculate total withdrawn
        const totalResult = filteredWithdrawals.reduce((acc, w) => acc + Number(w.netAmount), 0);

        let targetAmount = Number(goal.amount || 0);

        // If accountId is provided, try to use the account's specific goal
        if (accountId) {
            const account = accounts.find(a => a.id === accountId);
            if (account && account.goal !== undefined) {
                targetAmount = Number(account.goal);
            }
        }

        const remaining = targetAmount - totalResult;
        const progress = targetAmount > 0 ? (totalResult / targetAmount) * 100 : 0;

        return {
            totalResult,
            remaining: remaining > 0 ? remaining : 0,
            progress: Math.min(Math.max(progress, 0), 100),
            isGoalMet: totalResult >= targetAmount
        };
    };

    return (
        <DataContext.Provider value={{
            goal,
            accounts,
            logs,
            withdrawals,
            updateGoal,
            addAccount,
            updateAccount,
            deleteAccount,
            addLog,
            deleteLog,
            addWithdrawal,
            deleteWithdrawal,
            getSummary
        }}>
            {children}
        </DataContext.Provider>
    );
};
