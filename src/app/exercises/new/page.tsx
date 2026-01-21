import { createExercise } from '../actions';

export default function NewExercisePage() {
    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Create Exercise</h1>

            <form action={createExercise} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                        Exercise Name
                    </label>
                    <input name="name" type="text" placeholder="e.g. 3-Point Shooting" required />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                        Unit of Measurement
                    </label>
                    <select name="unit">
                        <option value="points">Points</option>
                        <option value="seconds">Seconds (Time)</option>
                        <option value="reps">Reps</option>
                        <option value="percentage">% Percentage</option>
                        <option value="meters">Meters</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                    Save Exercise
                </button>
            </form>
        </main>
    );
}
