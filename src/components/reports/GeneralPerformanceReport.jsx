value = {`R$ ${metrics.totalProfit.toFixed(2)}`}
color = "#10b981"
    />
                <MetricCard
                    icon={TrendingUp}
                    label="Lucro por Mesa"
                    value={`R$ ${metrics.profitPerAccount.toFixed(2)}`}
                    color="#00d2ff"
                />
                <MetricCard
                    icon={Calendar}
                    label="Média Diária"
                    value={`R$ ${metrics.dailyAverage.toFixed(2)}`}
                    color="#a855f7"
                />
                <MetricCard
                    icon={Calendar}
                    label="Média Semanal"
                    value={`R$ ${metrics.weeklyAverage.toFixed(2)}`}
                    color="#f59e0b"
                />
                <MetricCard
                    icon={Calendar}
                    label="Média Mensal"
                    value={`R$ ${metrics.monthlyAverage.toFixed(2)}`}
                    color="#ec4899"
                />
                <MetricCard
                    icon={Award}
                    label="Dias Operados"
                    value={metrics.daysSinceStart}
                    color="#8b5cf6"
                />
            </div >

    {/* Streaks */ }
    < div style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <Card style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem' }}>🔥</div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Maior Sequência de Wins</p>
                            <h3 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>{streaks.maxWinStreak}</h3>
                        </div>
                    </div>
                </Card>
                <Card style={{ background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem' }}>❄️</div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Maior Sequência de Losses</p>
                            <h3 style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 'bold' }}>{streaks.maxLossStreak}</h3>
                        </div>
                    </div>
                </Card>
            </div >

    {/* Evolution Chart */ }
    < Card >
                <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px' }}>
                    Evolução do Patrimônio
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.5)"
                            style={{ fontSize: '0.85rem' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            style={{ fontSize: '0.85rem' }}
                            tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Patrimônio']}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#00d2ff"
                            strokeWidth={3}
                            dot={{ fill: '#00d2ff', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Patrimônio Acumulado"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card >

    {/* Insights */ }
{
    insights.length > 0 && (
        <Card>
            <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>💡</span> Insights Automáticos
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {insights.map((insight, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            padding: '15px',
                            borderRadius: '8px',
                            background: insight.type === 'positive'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(59, 130, 246, 0.1)',
                            border: insight.type === 'positive'
                                ? '1px solid rgba(16, 185, 129, 0.3)'
                                : '1px solid rgba(59, 130, 246, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
                        <p style={{ color: 'white', margin: 0 }}>{insight.message}</p>
                    </motion.div>
                ))}
            </div>
        </Card>
    )
}
        </div >
    );
};

export default GeneralPerformanceReport;
