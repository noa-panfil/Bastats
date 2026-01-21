import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Users, Activity, TrendingUp } from 'lucide-react';
import { Suspense } from 'react';

import { PlayerCard } from '@/components/PlayerCard';
import { StatCard } from '@/components/StatCard';

async function getStats() {
  try {
    const playerCount = await prisma.player.count();
    const exerciseCount = await prisma.exercise.count();
    const resultCount = await prisma.result.count();
    return { playerCount, exerciseCount, resultCount };
  } catch (error) {
    console.error("Database connection failed", error);
    return { playerCount: 0, exerciseCount: 0, resultCount: 0, error: true };
  }
}

async function getPlayers() {
  try {
    return await prisma.player.findMany({
      orderBy: { firstName: 'asc' }
    });
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const stats = await getStats();
  const players = await getPlayers();

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>

      {/* Header */}
      <header style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          BA<span className="text-gradient">STATS</span>
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.2rem' }}>
          Performance Tracking System
        </p>
      </header>

      {/* Stats Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem'
      }}>
        <StatCard
          icon={<Users size={24} color="hsl(var(--primary))" />}
          label="Total Players"
          value={stats.playerCount}
        />
        <StatCard
          icon={<Activity size={24} color="hsl(var(--accent))" />}
          label="Exercises"
          value={stats.exerciseCount}
        />
        <StatCard
          icon={<TrendingUp size={24} color="hsl(var(--success))" />}
          label="Total Records"
          value={stats.resultCount}
        />
      </section>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <Link href="/players" className="btn-primary">
          Manage Players
        </Link>
        <Link href="/exercises" className="glass-panel" style={{
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600
        }}>
          Exercises Library
        </Link>
      </div>

      {/* Recent Players Preview */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Team Roster</h2>
        </div>

        {stats.error && (
          <div style={{ padding: '2rem', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)' }}>
            Database not connected. Please configure your .env file with correct MySQL credentials.
          </div>
        )}

        {players.length === 0 && !stats.error ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
            No players added yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {players.map((player: any) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
