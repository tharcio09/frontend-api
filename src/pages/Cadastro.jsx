import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        try {
            await api.post('/usuario', { name: nome, email, password });

            toast.success("Conta criada com sucesso! Você já pode fazer login.");
            navigate('/');

        } catch {
            // toast de erro já é exibido pelo interceptor da api.js
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <div className="max-w-md w-full space-y-8 p-8 border border-[var(--color-border-default)] rounded-xl" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)' }}>
                        <span className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>✨</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                        Criar Conta
                    </h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Comece a compartilhar seus links com o DevLinks
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            className="block text-xs font-semibold mb-1.5"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Seu nome"
                            className="w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:border-[var(--color-accent)]"
                            style={{
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-text-primary)',
                                borderColor: 'var(--color-border-default)',
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label
                            className="block text-xs font-semibold mb-1.5"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:border-[var(--color-accent)]"
                            style={{
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-text-primary)',
                                borderColor: 'var(--color-border-default)',
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label
                            className="block text-xs font-semibold mb-1.5"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:border-[var(--color-accent)]"
                            style={{
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-text-primary)',
                                borderColor: 'var(--color-border-default)',
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full py-3 px-4 text-sm font-bold rounded-lg transition-all mt-6 cursor-pointer hover:opacity-90 disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'var(--color-bg-primary)',
                        }}
                    >
                        {carregando ? 'Criando conta...' : 'Cadastrar e Começar'}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Já possui uma conta?{' '}
                        <Link
                            to="/"
                            className="font-semibold transition-colors hover:underline"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

