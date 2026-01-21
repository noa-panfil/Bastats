import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Dumbbell, Plus } from 'lucide-react';

export default async function ExercisesPage() {
    let exercises: any[] = [];
    try {
        exercises = await prisma.exercise.findMany({
            include: { _count: { select: { results: true } } }
        });
    } catch (e) {
        console.error("Failed to fetch exercises", e);
    }

    return (
        <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Exercises</h1>
                    <p style={{ color: 'hsl(var(--text-secondary))' }}>Library of drills and workouts.</p>
                </div>
                <Link href="/exercises/new" className="btn-primary">
                    <Plus size={20} />
                    New Exercise
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {exercises.map((exercise: any) => (
                    <Link href={`/exercises/${exercise.id}`} key={exercise.id} className="glass-panel" style={{
                        padding: '1.5rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '10px',
                                borderRadius: '10px'
                            }}>
                                <Dumbbell color="hsl(var(--accent))" size={24} />
                            </div>
                            <span style={{
                                fontSize: '0.8rem',
                                color: 'hsl(var(--text-secondary))',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                            }}>
                                {exercise.unit || 'Score'}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{exercise.name}</h3>
                        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
                            {exercise._count.results} records logged
                        </p>
                    </Link>
                ))}
                {exercises.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-secondary))', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                        No exercises found. Add one to start tracking.
                    </div>
                )}
            </div>
        </main>
    );
}
