import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default async function PlayersPage() {
    let players = [];
    try {
        players = await prisma.player.findMany({
            orderBy: { firstName: 'asc' }
        });
    } catch (error) {
        console.error("Failed to fetch players:", error);
    }

    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Roster</h1>
                    <p style={{ color: 'hsl(var(--text-secondary))' }}>Manage your team and track progress.</p>
                </div>
                <Link href="/players/new" className="btn-primary">
                    <UserPlus size={20} />
                    Add Player
                </Link>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>ID</th>
                            <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Player</th>
                            <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Status</th>
                            <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
                                    No players found. Start by adding one to your team.
                                </td>
                            </tr>
                        ) : (
                            players.map((player: any) => (
                                <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'hsl(var(--text-secondary))' }}>#{player.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: player.photoUrl ? `url(${player.photoUrl}) center/cover` : 'hsl(var(--surface-highlight))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {!player.photoUrl && player.firstName[0]}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{player.firstName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(150, 255, 150, 0.1)',
                                            color: 'hsl(var(--success))',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}>Active</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                            <Link href={`/players/${player.id}`} style={{
                                                color: 'hsl(var(--primary))',
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }}>
                                                View Stats
                                            </Link>
                                            <Link href={`/players/${player.id}/edit`} style={{
                                                color: 'hsl(var(--text-secondary))',
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }}>
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
