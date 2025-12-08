import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { format, parseISO, subDays, startOfDay, differenceInDays } from 'date-fns';

export const useReportData = () => {
    const { accounts, logs, withdrawals, goal } = useData();

    // Calculate general performance metrics
    const calculatePerformanceMetrics = useMemo(() => {
        const totalProfit = withdrawals.reduce((acc, w) => acc + Number(w.netAmount || w.net_amount || 0), 0);
        const totalGross = withdrawals.reduce((acc, w) => acc + Number(w.grossAmount || w.gross_amount || 0), 0);

        // Calculate profit per account
        const profitPerAccount = accounts.length > 0 ? totalProfit / accounts.length : 0;

        // Calculate daily/weekly/monthly averages
        const allLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstLogDate = allLogs.length > 0 ? new Date(allLogs[0].date) : new Date();
        const daysSinceStart = Math.max(1, differenceInDays(new Date(), firstLogDate));

        const dailyAverage = totalProfit / daysSinceStart;
        const weeklyAverage = dailyAverage * 7;
        const monthlyAverage = dailyAverage * 30;

        return {
            totalProfit,
            totalGross,
            profitPerAccount,
            dailyAverage,
            weeklyAverage,
            monthlyAverage,
            daysSinceStart
        };
    }, [accounts, logs, withdrawals]);

    // Calculate account-specific metrics
    const calculateAccountMetrics = (accountId) => {
        const accountLogs = logs.filter(log =>
            (log.accountId === accountId) || (log.account_id === accountId)
        );

        const totalDays = accountLogs.length;
        const totalAmount = accountLogs.reduce((acc, log) => acc + Number(log.amount || 0), 0);
        const averagePerDay = totalDays > 0 ? totalAmount / totalDays : 0;

        const positiveDays = accountLogs.filter(log => Number(log.amount) > 0);
        const negativeDays = accountLogs.filter(log => Number(log.amount) < 0);

        const positiveSum = positiveDays.reduce((acc, log) => acc + Number(log.amount), 0);
        const negativeSum = negativeDays.reduce((acc, log) => acc + Number(log.amount), 0);

        const avgPositive = positiveDays.length > 0 ? positiveSum / positiveDays.length : 0;
        const avgNegative = negativeDays.length > 0 ? negativeSum / negativeDays.length : 0;

        const winRate = totalDays > 0 ? (positiveDays.length / totalDays) * 100 : 0;

        return {
            totalDays,
            totalAmount,
            averagePerDay,
            positiveDays: positiveDays.length,
            negativeDays: negativeDays.length,
            positiveSum,
            negativeSum,
            avgPositive,
            avgNegative,
            winRate,
            logs: accountLogs
        };
    };

    // Calculate win/loss streaks
    const calculateStreaks = () => {
        const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

        let currentWinStreak = 0;
        let currentLossStreak = 0;
        let maxWinStreak = 0;
        let maxLossStreak = 0;

        sortedLogs.forEach(log => {
            const amount = Number(log.amount || 0);

            if (amount > 0) {
                currentWinStreak++;
                currentLossStreak = 0;
                maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
            } else if (amount < 0) {
                currentLossStreak++;
                currentWinStreak = 0;
                maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
            }
        });

        return {
            maxWinStreak,
            maxLossStreak,
            currentWinStreak,
            currentLossStreak
        };
    };

    // Group data by period
    const groupByPeriod = (data, period = 'day') => {
        const grouped = {};

        data.forEach(item => {
            let key;
            const date = new Date(item.date);

            if (period === 'day') {
                key = format(date, 'yyyy-MM-dd');
            } else if (period === 'week') {
                const weekStart = startOfDay(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = format(weekStart, 'yyyy-MM-dd');
            } else if (period === 'month') {
                key = format(date, 'yyyy-MM');
            }

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });

        return grouped;
    };

    // Generate automatic insights
    const generateInsights = () => {
        const insights = [];
        const streaks = calculateStreaks();
        const metrics = calculatePerformanceMetrics;

        // Best day of week analysis
        const dayOfWeekPerformance = {};
        logs.forEach(log => {
            const dayName = format(new Date(log.date), 'EEEE');
            if (!dayOfWeekPerformance[dayName]) {
                dayOfWeekPerformance[dayName] = { total: 0, count: 0 };
            }
            dayOfWeekPerformance[dayName].total += Number(log.amount || 0);
            dayOfWeekPerformance[dayName].count++;
        });

        let bestDay = null;
        let bestAvg = -Infinity;
        Object.keys(dayOfWeekPerformance).forEach(day => {
            const avg = dayOfWeekPerformance[day].total / dayOfWeekPerformance[day].count;
            if (avg > bestAvg) {
                bestAvg = avg;
                bestDay = day;
            }
        });

        if (bestDay && bestAvg > 0) {
            insights.push({
                type: 'positive',
                message: `Você opera melhor às ${bestDay}s.`,
                icon: '📈'
            });
        }

        // Win rate insight
        const totalTrades = logs.length;
        const positiveTrades = logs.filter(l => Number(l.amount) > 0).length;
        const winRate = totalTrades > 0 ? (positiveTrades / totalTrades) * 100 : 0;

        if (winRate > 60) {
            insights.push({
                type: 'positive',
                message: `Excelente winrate de ${winRate.toFixed(1)}%!`,
                icon: '🎯'
            });
        }

        // Average positive vs negative
        const posLogs = logs.filter(l => Number(l.amount) > 0);
        const negLogs = logs.filter(l => Number(l.amount) < 0);

        if (posLogs.length > 0 && negLogs.length > 0) {
            const avgPos = posLogs.reduce((acc, l) => acc + Number(l.amount), 0) / posLogs.length;
            const avgNeg = Math.abs(negLogs.reduce((acc, l) => acc + Number(l.amount), 0) / negLogs.length);

            if (avgPos > avgNeg) {
                const diff = ((avgPos - avgNeg) / avgNeg * 100).toFixed(0);
                insights.push({
                    type: 'positive',
                    message: `Sua média positiva está ${diff}% maior que a negativa.`,
                    icon: '💪'
                });
            }
        }

        // Streak insight
        if (streaks.maxWinStreak >= 5) {
            insights.push({
                type: 'info',
                message: `Sua maior sequência de vitórias foi de ${streaks.maxWinStreak} dias!`,
                icon: '🔥'
            });
        }

        // Consistency insight
        const last30Days = logs.filter(log => {
            const logDate = new Date(log.date);
            return differenceInDays(new Date(), logDate) <= 30;
        });

        if (last30Days.length >= 20) {
            insights.push({
                type: 'positive',
                message: 'Sua consistência operacional está excelente!',
                icon: '⭐'
            });
        }

        return insights;
    };

    // Calculate evolution data for charts
    const getEvolutionData = (days = 30) => {
        const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
        const evolutionData = [];
        let accumulated = 0;

        sortedLogs.forEach(log => {
            const logDate = new Date(log.date);
            if (differenceInDays(new Date(), logDate) <= days) {
                accumulated += Number(log.amount || 0);
                evolutionData.push({
                    date: format(logDate, 'dd/MM'),
                    value: accumulated,
                    fullDate: format(logDate, 'dd/MM/yyyy')
                });
            }
        });

        return evolutionData;
    };

    return {
        calculatePerformanceMetrics,
        calculateAccountMetrics,
        calculateStreaks,
        groupByPeriod,
        generateInsights,
        getEvolutionData,
        accounts,
        logs,
        withdrawals,
        goal
    };
};
