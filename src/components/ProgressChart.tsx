"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
    date: string;
    value: number;
}

interface ProgressChartProps {
    data: DataPoint[];
    title: string;
    color?: string;
}

export function ProgressChart({ data, title, color = "hsl(var(--primary))" }: ProgressChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>No data available for {title}</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', width: '100%' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
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
                            contentStyle={{
                                backgroundColor: 'hsl(var(--surface))',
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: 'white'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                            dot={{ fill: color, strokeWidth: 2 }}
                            label={{ position: 'top', fill: color, fontSize: 12, fontWeight: 600, dy: -5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
