"use client";

import { addResult } from '@/app/players/actions';
import { useRef } from 'react';

interface Exercise {
    id: number;
    name: string;
    unit: string | null;
}

export function AddResultForm({ playerId, exercises }: { playerId: number, exercises: Exercise[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Log New Result</h3>
            <form
                action={async (formData) => {
                    await addResult(formData);
                    formRef.current?.reset();
                }}
                ref={formRef}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}
            >
                <input type="hidden" name="playerId" value={playerId} />

                <div style={{ flex: '1 1 220px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'hsl(var(--text-secondary))' }}>
                        Exercise
                    </label>
                    <select name="exerciseId" required style={{ width: '100%' }}>
                        <option value="">Select Exercise...</option>
                        {exercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name} ({ex.unit || 'Score'})</option>
                        ))}
                    </select>
                </div>

                <div style={{ flex: '0 1 150px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'hsl(var(--text-secondary))' }}>
                        Date
                    </label>
                    <input
                        name="date"
                        type="date"
                        defaultValue={today}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ flex: '0 1 140px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'hsl(var(--text-secondary))' }}>
                        Value
                    </label>
                    <input
                        name="value"
                        type="number"
                        step="0.01"
                        placeholder="Result"
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ marginBottom: '1px' }}>
                    Log
                </button>
            </form>
        </div>
    );
}
