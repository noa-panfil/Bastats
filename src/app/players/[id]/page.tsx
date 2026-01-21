import { prisma } from '@/lib/prisma';
import { TeamProgressChart } from '@/components/TeamProgressChart';
import { AddResultForm } from '@/components/AddResultForm';
import Link from 'next/link';

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

    const allResults = await prisma.result.findMany({
        include: { exercise: true }
    });

    const exercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' }
    });

    if (!player) {
        return <div className="container" style={{ padding: '4rem' }}>Player not found</div>;
    }

    const uniqueExercises = Array.from(new Set(player.results.map(r => r.exerciseId)));

    const chartsData = uniqueExercises.map(exId => {
        const exercise = exercises.find(e => e.id === exId);
        const exerciseName = exercise?.name || 'Unknown';
        const isTime = exercise?.unit === 'seconds';

        const myResults = player.results.filter(r => r.exerciseId === exId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id);

        const teamResults = allResults.filter(r => r.exerciseId === exId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id);

        const teamDayMap = new Map<string, Record<string, number[]>>();
        teamResults.forEach(r => {
            const d = r.date.toLocaleDateString();
            if (!teamDayMap.has(d)) teamDayMap.set(d, {});
            const entry = teamDayMap.get(d)!;
            const pid = r.playerId.toString();
            if (!entry[pid]) entry[pid] = [];
            entry[pid].push(r.value);
        });

        const chartPoints: any[] = [];
        const processedDates = new Set<string>();

        myResults.forEach(pr => {
            const dateStr = pr.date.toLocaleDateString();
            if (processedDates.has(dateStr)) return;
            processedDates.add(dateStr);

            const myDailyResults = myResults.filter(r => r.date.toLocaleDateString() === dateStr);
            const teamDailyData = teamDayMap.get(dateStr) || {};

            const loops = myDailyResults.length;

            for (let i = 0; i < loops; i++) {
                const label = loops > 1 ? `${dateStr} (${i + 1})` : dateStr;
                const point: any = { date: label };

                point[player.firstName] = myDailyResults[i].value;

                let passageSum = 0;
                let passageCount = 0;
                Object.values(teamDailyData).forEach(pValues => {
                    if (pValues[i] !== undefined) {
                        passageSum += pValues[i];
                        passageCount++;
                    }
                });

                if (passageCount > 0) {
                    point.Average = parseFloat((passageSum / passageCount).toFixed(2));
                }

                chartPoints.push(point);
            }
        });

        const latest = myResults[myResults.length - 1];
        const stats: { label: string; value: string; color: string }[] = [];

        if (latest) {
            const periods = [
                { label: '2W', days: 14 },
                { label: '1M', days: 30 },
                { label: '3M', days: 90 }
            ];

            const refDate = new Date(latest.date);

            periods.forEach(p => {
                const targetDate = new Date(refDate);
                targetDate.setDate(refDate.getDate() - p.days);

                let closest: typeof latest | null = null;
                let minDiff = Infinity;

                myResults.forEach(r => {
                    if (r.id === latest.id) return;
                    const d = new Date(r.date);
                    const diff = Math.abs(d.getTime() - targetDate.getTime());

                    if (diff < minDiff) {
                        minDiff = diff;
                        closest = r;
                    }
                });

                const dayDiff = minDiff / (1000 * 3600 * 24);

                if (closest && dayDiff < p.days + 14) {
                    const current = latest.value;
                    const past = (closest as any).value;
                    let pct = ((current - past) / past) * 100;

                    let color = 'hsl(var(--text-secondary))';
                    const isGood = isTime ? pct < 0 : pct > 0;

                    if (Math.abs(pct) >= 0.1) {
                        color = isGood ? 'hsl(var(--success))' : 'hsl(var(--error))';
                    }

                    stats.push({
                        label: p.label,
                        value: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`,
                        color
                    });
                } else {
                    stats.push({ label: p.label, value: '-', color: 'hsl(var(--text-secondary))' });
                }
            });
        }

        return {
            title: exerciseName,
            data: chartPoints,
            unit: exercise?.unit,
            stats
        };
    });

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
                {chartsData.length === 0 ? (
                    <p style={{ color: 'hsl(var(--text-secondary))' }}>No training data recorded yet.</p>
                ) : (
                    chartsData.map((chart) => (
                        <TeamProgressChart
                            key={chart.title}
                            title={chart.title}
                            data={chart.data}
                            players={[{ id: player.id, name: player.firstName, color: 'hsl(var(--primary))' }]}
                            unit={chart.unit}
                            stats={chart.stats}
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
