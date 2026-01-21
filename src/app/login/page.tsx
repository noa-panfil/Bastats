import { login } from './actions';
import { Lock } from 'lucide-react';

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'hsl(var(--background))'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'hsl(var(--primary))',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <Lock color="white" size={30} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Team Access</h1>
                    <p style={{ color: 'hsl(var(--text-secondary))' }}>Please enter the passcode to continue</p>
                </div>

                <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter passcode"
                            required
                            style={{ fontSize: '1.1rem', textAlign: 'center' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </main>
    );
}
