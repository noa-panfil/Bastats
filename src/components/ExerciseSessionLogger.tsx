"use client";

import { useState, useRef, useEffect } from 'react';
import { addResult } from '@/app/players/actions';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';

interface Player {
    id: number;
    firstName: string;
}

interface Exercise {
    id: number;
    name: string;
    unit: string | null;
}

export function ExerciseSessionLogger({ exercise, players }: { exercise: Exercise, players: Player[] }) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
    const [value, setValue] = useState<string>("");

    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const isTimerMode = exercise.unit === 'seconds';

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev + 10);
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const handleStart = () => setIsRunning(true);

    const handleStop = () => {
        setIsRunning(false);
        setValue((time / 1000).toFixed(2));
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setValue("");
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Log New Session</h2>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {isTimerMode ? (
                    <div style={{
                        background: 'hsl(var(--secondary))',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: 'clamp(3rem, 15vw, 4rem)',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            marginBottom: '1.5rem',
                            color: isRunning ? 'hsl(var(--primary))' : 'white'
                        }}>
                            {(time / 1000).toFixed(2)}<span style={{ fontSize: '1.5rem', color: 'hsl(var(--text-secondary))' }}>s</span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            {!isRunning ? (
                                <button onClick={handleStart} className="btn-primary" style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play fill="white" size={24} />
                                </button>
                            ) : (
                                <button onClick={handleStop} style={{
                                    background: 'hsl(var(--error))',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '60px',
                                    height: '60px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Pause fill="white" size={24} />
                                </button>
                            )}

                            <button onClick={handleReset} style={{
                                background: 'hsl(var(--surface-highlight))',
                                color: 'white',
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <RotateCcw size={24} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-secondary))', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
                        Manual Entry Mode
                    </div>
                )}

                <form
                    action={async (formData) => {
                        await addResult(formData);
                        setValue("");
                        handleReset();
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <input type="hidden" name="exerciseId" value={exercise.id} />

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                            Select Player
                        </label>
                        <select
                            name="playerId"
                            value={selectedPlayerId}
                            onChange={(e) => setSelectedPlayerId(e.target.value)}
                            required
                            style={{ fontSize: '1.1rem', padding: '1rem' }}
                        >
                            <option value="">-- Choose Player --</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>{p.firstName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            style={{ fontSize: '1.1rem', padding: '1rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                            Result Value ({exercise.unit || 'Score'})
                        </label>
                        <input
                            name="value"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: 'auto' }}>
                        <Save size={20} />
                        Save Result
                    </button>
                </form>
            </div>
        </div>
    );
}
