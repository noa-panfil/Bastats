import { prisma } from '@/lib/prisma';
import { updatePlayer, deletePlayer } from '@/app/players/actions';
import Link from 'next/link';

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const playerId = parseInt(id);

    const player = await prisma.player.findUnique({
        where: { id: playerId }
    });

    if (!player) {
        return <div className="container" style={{ padding: '4rem' }}>Player not found</div>;
    }

    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/players/${playerId}`} style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
                    &larr; Cancel & Back
                </Link>
                <h1>Edit Player</h1>
            </div>

            <form action={updatePlayer} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input type="hidden" name="id" value={player.id} />

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                        First Name
                    </label>
                    <input
                        name="firstName"
                        type="text"
                        placeholder="e.g. Michael"
                        defaultValue={player.firstName}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                        Photo URL (Optional)
                    </label>
                    <input
                        name="photoUrl"
                        type="url"
                        placeholder="https://..."
                        defaultValue={player.photoUrl || ''}
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                    Save Changes
                </button>
            </form>

            <form action={deletePlayer} className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', borderColor: 'hsl(var(--error))', background: 'rgba(255, 0, 0, 0.05)' }}>
                <input type="hidden" name="id" value={player.id} />
                <h3 style={{ color: 'hsl(var(--error))', marginBottom: '1rem' }}>Danger Zone</h3>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                    Permanently remove this player and all their training history. This action cannot be undone.
                </p>
                <button
                    type="submit"
                    style={{
                        background: 'hsl(var(--error))',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Delete Player
                </button>
            </form>
        </main>
    );
}
