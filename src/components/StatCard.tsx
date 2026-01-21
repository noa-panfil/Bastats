import { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: number | string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                background: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--border))',
                padding: '10px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <h4 style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{label}</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
            </div>
        </div>
    );
}
