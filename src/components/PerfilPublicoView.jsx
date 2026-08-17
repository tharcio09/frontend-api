const urlSegura = (url) => {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};

export function PerfilPublicoView({ perfil, nomeFallback }) {
    const obterIniciais = (nome) => {
        if (!nome) return '??';
        const partes = nome.trim().split(' ');
        if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    };

    const nome = perfil?.name || nomeFallback || 'Usuário';

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-between py-16 px-4"
            style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
            <main className="w-full max-w-sm space-y-6">
                {/* Header de Perfil Público */}
                <div className="text-center space-y-3">
                    {perfil?.avatar ? (
                        <img
                            src={perfil.avatar}
                            alt={`Avatar de ${nome}`}
                            className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-[var(--color-accent)] shadow-lg"
                        />
                    ) : (
                        <div
                            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center font-bold text-2xl border-2 border-[var(--color-accent)] shadow-lg"
                            style={{
                                backgroundColor: 'var(--color-bg-surface)',
                                color: 'var(--color-accent)',
                            }}
                        >
                            {obterIniciais(nome)}
                        </div>
                    )}

                    <div>
                        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                            {nome}
                        </h1>
                        {perfil?.profession && (
                            <p className="text-xs font-semibold mt-1 px-3 py-1 inline-block rounded-full border border-[var(--color-border-default)]" style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-accent)' }}>
                                {perfil.profession}
                            </p>
                        )}
                    </div>
                </div>

                {/* Lista de Links Públicos */}
                <div className="space-y-3 pt-4">
                    {perfil?.links && perfil.links.length > 0 ? (
                        perfil.links.map((link, index) => (
                            urlSegura(link.url) ? (
                                <a
                                    key={link._id || link.id || index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-3.5 border border-[var(--color-border-default)] rounded-xl transition-all duration-200 hover:border-[var(--color-accent)] hover:scale-[1.01]"
                                    style={{
                                        backgroundColor: 'var(--color-bg-surface)',
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <span className="text-sm">🔗</span>
                                        <span className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                                            {link.titulo}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs font-bold transition-transform group-hover:translate-x-1"
                                        style={{ color: 'var(--color-accent)' }}
                                    >
                                        ↗
                                    </span>
                                </a>
                            ) : null
                        ))
                    ) : (
                        <div className="text-center py-8 border border-dashed border-[var(--color-border-default)] rounded-xl" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                Nenhum link cadastrado no momento.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center">
                <span className="text-xs font-semibold tracking-tight inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
                    <span>🔗</span>
                    <span>Criado com DevLinks</span>
                </span>
            </footer>
        </div>
    );
}
