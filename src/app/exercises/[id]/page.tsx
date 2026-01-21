import { prisma } from '@/lib/prisma';
import { ExerciseAnalytics } from '@/components/ExerciseAnalytics';
import { ExerciseSessionLogger } from '@/components/ExerciseSessionLogger';
import { ExerciseLeaderboard } from '@/components/ExerciseLeaderboard';
import Link from 'next/link';

export default async function ExerciseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const exerciseId = parseInt(id);

    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
            results: {
                include: { player: true },
                orderBy: { date: 'asc' }
            }
        }
    });

    const playersList = await prisma.player.findMany({
        orderBy: { firstName: 'asc' }
    });

    if (!exercise) {
        return <div className="container" style={{ padding: '4rem' }}>Exercise not found</div>;
    }

    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <Link href="/exercises" style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
                    &larr; Back to Library
                </Link>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{exercise.name}</h1>
                <div style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    background: 'hsl(var(--primary))',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    Analytics
                </div>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <ExerciseAnalytics exercise={exercise} players={playersList} />
            </div>

            <ExerciseSessionLogger exercise={exercise} players={playersList} />

            <ExerciseLeaderboard results={exercise.results} unit={exercise.unit} />

        </main>
    );
}
