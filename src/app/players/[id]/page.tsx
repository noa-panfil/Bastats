import { prisma } from '@/lib/prisma';
import { ProgressChart } from '@/components/ProgressChart';
import { AddResultForm } from '@/components/AddResultForm';
import Link from 'next/link';

interface DataPoint {
    date: string;
    value: number;
}

export default async function PlayerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const playerId = parseInt(id);

    const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
            results: {
                include: { exercise: true },
                orderBy: { date: 'asc' }
            }
        }
    });

    const exercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' }
    });

    if (!player) {
        return <div className="container" style={{ padding: '4rem' }}>Player not found</div>;
    }

    // Group results by exercise
    const resultsByExercise = player.results.reduce((acc: Record<string, DataPoint[]>, result: any) => {
        const exerciseName = result.exercise.name;
        if (!acc[exerciseName]) {
            acc[exerciseName] = [];
        }
        acc[exerciseName].push({
            date: result.date.toLocaleDateString(),
            value: result.value
        });
        return acc;
    }, {} as Record<string, DataPoint[]>);

    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Link href="/players" style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', display: 'inline-block' }}>
                        &larr; Back to Roster
                    </Link>
                    <Link href={`/players/${playerId}/edit`} className="glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        Edit Player
                    </Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        flexShrink: 0,
                        borderRadius: '50%',
                        background: player.photoUrl ? `url(${player.photoUrl}) center/cover` : 'hsl(var(--surface-highlight))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'hsl(var(--text-secondary))',
                        border: '2px solid hsl(var(--primary))',
                        boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
                    }}>
                        {!player.photoUrl && player.firstName[0]}
                    </div>
                    <div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{player.firstName}</h1>
                        <p style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>#{player.id} • Player</p>
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                Performance Analysis
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {Object.keys(resultsByExercise).length === 0 ? (
                    <p style={{ color: 'hsl(var(--text-secondary))' }}>No training data recorded yet.</p>
                ) : (
                    Object.entries(resultsByExercise).map(([exerciseName, data]) => (
                        <ProgressChart
                            key={exerciseName}
                            title={exerciseName}
                            data={data as DataPoint[]}
                        />
                    ))
                )}
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                <AddResultForm playerId={playerId} exercises={exercises} />
            </div>
        </main>
    );
}
