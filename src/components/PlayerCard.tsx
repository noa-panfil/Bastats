import Link from 'next/link';

interface Player {
    id: number;
    firstName: string;
    photoUrl: string | null;
}

export function PlayerCard({ player }: { player: Player }) {
    return (
        <Link href={`/players/${player.id}`} className="glass-panel" style={{
            display: 'block',
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'inherit'
        }}>
            <div style={{
                height: '200px',
                background: player.photoUrl ? `url(${player.photoUrl}) center/cover` : 'linear-gradient(45deg, hsl(var(--border)), hsl(var(--surface)))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'hsl(var(--text-secondary))'
            }}>
                {!player.photoUrl && player.firstName[0]}
            </div>
            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{player.firstName}</h3>
            </div>
        </Link>
    );
}
