import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { UserPlus, Eye, Edit } from 'lucide-react';

export default async function PlayersPage() {
    let players: any[] = [];
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

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                    display: 'flex',
                    padding: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.02)',
                    color: 'hsl(var(--text-secondary))',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                }}>
                    <div style={{ flex: 1 }}>Player</div>
                    <div style={{ width: '100px', textAlign: 'right' }}>Actions</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {players.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
                            No players found. Start by adding one to your team.
                        </div>
                    ) : (
                        players.map((player: any) => (
                            <div key={player.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        flexShrink: 0,
                                        borderRadius: '50%',
                                        background: player.photoUrl ? `url(${player.photoUrl}) center/cover` : 'hsl(var(--surface-highlight))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {!player.photoUrl && player.firstName[0]}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {player.firstName}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontFamily: 'monospace' }}>
                                            #{player.id} • Active
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <Link
                                        href={`/players/${player.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: 'rgba(50, 150, 255, 0.1)',
                                            color: 'hsl(var(--primary))',
                                            transition: '0.2s'
                                        }}
                                        title="View Stats"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        href={`/players/${player.id}/edit`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: 'hsl(var(--text-secondary))',
                                            transition: '0.2s'
                                        }}
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
