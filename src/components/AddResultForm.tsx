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

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Log New Result</h3>
            <form
                action={async (formData) => {
                    await addResult(formData);
                    formRef.current?.reset();
                }}
                ref={formRef}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}
            >
                <input type="hidden" name="playerId" value={playerId} />

                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'hsl(var(--text-secondary))' }}>
                        Exercise
                    </label>
                    <select name="exerciseId" required>
                        <option value="">Select Exercise...</option>
                        {exercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name} ({ex.unit || 'Score'})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'hsl(var(--text-secondary))' }}>
                        Value
                    </label>
                    <input name="value" type="number" step="0.01" placeholder="Enter Result" required />
                </div>

                <button type="submit" className="btn-primary">
                    Log
                </button>
            </form>
        </div>
    );
}
