import { prisma } from '@/lib/prisma';
import { ProgressChart } from '@/components/ProgressChart';
import { ExerciseSessionLogger } from '@/components/ExerciseSessionLogger';
import Link from 'next/link';

export default async function ExerciseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const exerciseId = parseInt(id);

    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
            results: {
                orderBy: { date: 'asc' }
            }
        }
    });

    const players = await prisma.player.findMany({
        orderBy: { firstName: 'asc' }
    });

    if (!exercise) {
        return <div className="container" style={{ padding: '4rem' }}>Exercise not found</div>;
    }

    // Calculate Team Average Progress
    // Group by date, average the values
    const dateMap = new Map<string, { sum: number, count: number }>();

    exercise.results.forEach((r: any) => {
        const dateStr = r.date.toLocaleDateString();
        if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, { sum: 0, count: 0 });
        }
        const entry = dateMap.get(dateStr)!;
        entry.sum += r.value;
        entry.count += 1;
    });

    const chartData = Array.from(dateMap.entries()).map(([date, { sum, count }]) => ({
        date,
        value: parseFloat((sum / count).toFixed(2))
    }));

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
                    Avg Breakdown
                </div>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <ProgressChart
                    title="Team Average Progress"
                    data={chartData}
                    color="hsl(var(--accent))"
                />
            </div>

            <ExerciseSessionLogger exercise={exercise} players={players} />

        </main>
    );
}
