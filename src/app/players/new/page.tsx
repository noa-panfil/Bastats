import { createPlayer } from '../actions';

export default function NewPlayerPage() {
    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Add New Player</h1>

            <form action={createPlayer} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                        First Name
                    </label>
                    <input name="firstName" type="text" placeholder="e.g. Michael" required />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                        Photo URL (Optional)
                    </label>
                    <input name="photoUrl" type="url" placeholder="https://..." />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                    Create Player
                </button>
            </form>
        </main>
    );
}
