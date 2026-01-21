"use client";

import { useState } from 'react';
import { TeamProgressChart } from './TeamProgressChart';

interface Player {
    id: number;
    firstName: string;
}

interface Result {
    id: number;
    value: number;
    date: Date;
    player: Player;
}

interface ExerciseAnalyticsProps {
    exercise: {
        id: number;
        name: string;
        unit: string | null;
        results: Result[];
    };
    players: Player[];
}

function getPlayerColor(index: number) {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

export function ExerciseAnalytics({ exercise, players }: ExerciseAnalyticsProps) {
    const [showDailyAverage, setShowDailyAverage] = useState(false);

    const dayData = new Map<string, Record<string, number[]>>();
    const involvedPlayerIds = new Set<number>();

    const getDateKey = (d: Date | string) => new Date(d).toLocaleDateString();

    const sortedResults = [...exercise.results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedResults.forEach((r: any) => {
        const dateStr = getDateKey(r.date);

        if (!dayData.has(dateStr)) {
            dayData.set(dateStr, {});
        }

        const entry = dayData.get(dateStr)!;
        const playerName = r.player.firstName;

        if (!entry[playerName]) {
            entry[playerName] = [];
        }
        entry[playerName].push(r.value);

        involvedPlayerIds.add(r.player.id);
    });

    const chartData: any[] = [];

    dayData.forEach((playerValuesMap, dateStr) => {
        if (showDailyAverage) {
            const entry: any = { date: dateStr };
            let dailySum = 0;
            let dailyCount = 0;

            Object.entries(playerValuesMap).forEach(([pName, values]) => {
                const pSum = values.reduce((m, n) => m + n, 0);
                const pAvg = parseFloat((pSum / values.length).toFixed(2));

                entry[pName] = pAvg;

                dailySum += pAvg;
                dailyCount++;
            });

            entry.Average = dailyCount > 0 ? parseFloat((dailySum / dailyCount).toFixed(2)) : 0;
            chartData.push(entry);

        } else {
            let maxPassages = 0;
            Object.values(playerValuesMap).forEach(arr => {
                if (arr.length > maxPassages) maxPassages = arr.length;
            });

            for (let i = 0; i < maxPassages; i++) {
                const label = maxPassages > 1 ? `${dateStr} (${i + 1})` : dateStr;

                const entry: any = { date: label };
                let passageSum = 0;
                let passageCount = 0;

                Object.entries(playerValuesMap).forEach(([pName, values]) => {
                    if (values[i] !== undefined) {
                        entry[pName] = values[i];
                        passageSum += values[i];
                        passageCount++;
                    }
                });

                entry.Average = passageCount > 0 ? parseFloat((passageSum / passageCount).toFixed(2)) : 0;
                chartData.push(entry);
            }
        }
    });

    const playerColors = Array.from(involvedPlayerIds).map((pid, index) => {
        const p = players.find(pl => pl.id === pid);
        return {
            id: pid,
            name: p?.firstName || `Player ${pid}`,
            color: getPlayerColor(index)
        };
    });

    return (
        <div className="animate-fade-in" style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                    {showDailyAverage ? "Daily Average" : "All Passages (Detailed)"}
                </span>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input
                        type="checkbox"
                        checked={showDailyAverage}
                        onChange={(e) => setShowDailyAverage(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: showDailyAverage ? 'hsl(var(--primary))' : '#ccc',
                        transition: '.4s',
                        borderRadius: '34px'
                    }}></span>
                    <span style={{
                        position: 'absolute',
                        content: '',
                        height: '20px', width: '20px',
                        left: showDailyAverage ? '26px' : '4px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '.4s',
                        borderRadius: '50%'
                    }} />
                </label>
            </div>

            <TeamProgressChart
                title={showDailyAverage ? "Team Performance (Daily Average)" : "Team Performance (Detailed)"}
                data={chartData}
                players={playerColors}
                unit={exercise.unit}
            />
        </div>
    );
}
