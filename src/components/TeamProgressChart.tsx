"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TeamProgressChartProps {
    data: any[];
    title: string;
    players: { id: number; name: string; color: string }[];
    unit?: string | null;
    stats?: { label: string; value: string; color?: string }[];
}

export function TeamProgressChart({ data, title, players, unit, stats }: TeamProgressChartProps) {
    const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>No data available for {title}</p>
            </div>
        );
    }

    return (
        <div
            className="glass-panel"
            style={{ padding: '1.5rem', width: '100%' }}
            onClick={() => setHighlightedPlayer(null)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h3>
                {stats && stats.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {stats.map((s, i) => (
                            <div key={i} style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>{s.label}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: s.color || 'inherit' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 30, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--text-secondary))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--text-secondary))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            itemSorter={(item) => -1 * Number(item.value)}
                            formatter={(value: any, name: any) => {
                                if (unit === 'seconds' && typeof value === 'number') {
                                    const val = value;
                                    const mins = Math.floor(val / 60);
                                    const secs = Math.round(val % 60);
                                    return [`${val} (${mins}min${secs}s)`, name];
                                }
                                return [value, name];
                            }}
                            wrapperStyle={{ zIndex: 1000 }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--surface))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--text-primary))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend
                            content={() => (
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '16px', height: '4px', backgroundColor: '#000000', borderRadius: '2px' }}></div>
                                            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', marginLeft: '-12px' }}></div>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>Average</span>
                                    </div>

                                    {players.sort((a, b) => a.name.localeCompare(b.name)).map(p => {
                                        const isDimmed = highlightedPlayer && highlightedPlayer !== p.name;
                                        return (
                                            <div
                                                key={p.id}
                                                onMouseEnter={() => setHighlightedPlayer(p.name)}
                                                onMouseLeave={() => setHighlightedPlayer(null)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setHighlightedPlayer(p.name);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer',
                                                    opacity: isDimmed ? 0.3 : 1,
                                                    transition: 'opacity 0.2s ease',
                                                    padding: '4px'
                                                }}
                                            >
                                                <div style={{ width: '10px', height: '10px', backgroundColor: p.color, borderRadius: '50%' }}></div>
                                                <span style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>{p.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        />

                        <Line
                            type="monotone"
                            dataKey="Average"
                            stroke="#000000"
                            strokeWidth={4}
                            dot={{ fill: "#000000", r: 4 }}
                            activeDot={{ r: 8 }}
                        />

                        {players.map((player) => (
                            <Line
                                key={player.id}
                                type="monotone"
                                dataKey={player.name}
                                stroke={player.color}
                                strokeWidth={highlightedPlayer === player.name ? 4 : 2}
                                strokeOpacity={highlightedPlayer && highlightedPlayer !== player.name ? 0.15 : 1}
                                dot={{ r: 3 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                                animationDuration={300}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
