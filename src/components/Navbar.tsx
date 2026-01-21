import Link from 'next/link';

export function Navbar() {
    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    BA<span className="text-gradient">STATS</span>
                </Link>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <Link href="/players" style={{ fontWeight: 500, color: 'hsl(var(--text-secondary))', transition: 'color 0.2s' }}>
                        Players
                    </Link>
                    <Link href="/exercises" style={{ fontWeight: 500, color: 'hsl(var(--text-secondary))', transition: 'color 0.2s' }}>
                        Exercises
                    </Link>
                </div>
            </div>
        </nav>
    );
}
