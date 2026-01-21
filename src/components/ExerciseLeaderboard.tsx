"use client";

import { Crown, Medal, Trophy } from "lucide-react";

interface Player {
    id: number;
    firstName: string;
    photoUrl: string | null;
}

interface Result {
    id: number;
    value: number;
    date: Date | string;
    player: Player;
}

interface ExerciseLeaderboardProps {
    results: Result[];
    unit: string | null;
}

export function ExerciseLeaderboard({ results, unit }: ExerciseLeaderboardProps) {
    const isSeconds = unit === 'seconds';

    const bestResultsByPlayer = new Map<number, Result>();

    results.forEach(r => {
        const existing = bestResultsByPlayer.get(r.player.id);
        if (!existing) {
            bestResultsByPlayer.set(r.player.id, r);
        } else {
            const isBetter = isSeconds
                ? r.value < existing.value
                : r.value > existing.value;

            if (isBetter) {
                bestResultsByPlayer.set(r.player.id, r);
            }
        }
    });

    const sortedLeaderboard = Array.from(bestResultsByPlayer.values()).sort((a, b) => {
        if (isSeconds) {
            return a.value - b.value;
        }
        return b.value - a.value;
    });

    const formatValue = (val: number) => {
        if (isSeconds) {
            const mins = Math.floor(val / 60);
            const secs = Math.round(val % 60);
            if (mins > 0) {
                const s = (val % 60).toFixed(2);
                const sDisplay = parseFloat(s) < 10 ? `0${parseFloat(s)}` : parseFloat(s);
                return `${mins}min${sDisplay}s`;
            }
            return `${val.toFixed(2)}s`;
        }
        return val.toString();
    };

    if (sortedLeaderboard.length === 0) {
        return null;
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Trophy size={32} color="hsl(var(--primary))" />
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Leaderboard</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedLeaderboard.map((result, index) => {
                    const rank = index + 1;
                    let rankIcon = null;
                    let borderColor = 'transparent';

                    if (rank === 1) {
                        rankIcon = <Crown size={24} color="#FFD700" fill="#FFD700" />;
                        borderColor = '#FFD700';
                    } else if (rank === 2) {
                        rankIcon = <Medal size={24} color="#C0C0C0" />;
                        borderColor = '#C0C0C0';
                    } else if (rank === 3) {
                        rankIcon = <Medal size={24} color="#CD7F32" />;
                        borderColor = '#CD7F32';
                    }

                    return (
                        <div
                            key={result.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                borderLeft: `4px solid ${borderColor}`,
                                transition: 'transform 0.2s',
                            }}
                            className="hover:translate-x-1"
                        >
                            <div style={{ width: '50px', display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: index < 3 ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))' }}>
                                {rankIcon || `#${rank}`}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: result.player.photoUrl ? `url(${result.player.photoUrl}) center/cover` : 'hsl(var(--surface-highlight))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', color: 'hsl(var(--text-secondary))'
                                }}>
                                    {!result.player.photoUrl && result.player.firstName[0]}
                                </div>
                                <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'hsl(var(--text-primary))' }}>
                                    {result.player.firstName}
                                </span>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: rank === 1 ? 'hsl(var(--primary))' : 'hsl(var(--text-primary))' }}>
                                    {formatValue(result.value)}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                                    {new Date(result.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
