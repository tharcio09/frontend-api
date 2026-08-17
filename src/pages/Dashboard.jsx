import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { SkeletonDashboard } from '../components/SkeletonDashboard';

const urlSegura = (url) => {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};

export function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaUrl, setNovaUrl] = useState('');

    const { data: perfil, isLoading, isError } = useQuery({
        queryKey: ['meu-perfil'],
        queryFn: async () => {
            const { data } = await api.get('/meu-perfil');
            return data;
        },
        retry: false
    });

    const handleLogout = () => {
        localStorage.removeItem('meu_token_vip');
        navigate('/');
    };

    const mutacaoUploadFoto = useMutation({
        mutationFn: async (arquivo) => {
            const formData = new FormData();
            formData.append('foto', arquivo);

            const { data } = await api.patch('/usuario/foto', formData);
            return data;
        },
        onSuccess: (dados) => {
            queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
            toast.success(dados.message || 'Sua foto foi atualizada!');
        }
    });

    const lidarComEscolhaDeFoto = (evento) => {
        const arquivoSelecionado = evento.target.files[0];
        if (arquivoSelecionado) {
            mutacaoUploadFoto.mutate(arquivoSelecionado);
        }
    };

    const mutacaoAdicionarLink = useMutation({
        mutationFn: async (novoLink) => {
            const { data } = await api.post('/usuario/link', novoLink);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
            toast.success('Link adicionado com sucesso!');
        }
    });

    const mutacaoProfissao = useMutation({
        mutationFn: async (novaProfissao) => {
            const { data } = await api.put(`/usuario/${perfil._id}`, { profession: novaProfissao });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
            toast.success('Profissão atualizada!');
        }
    });

    const handleSalvarProfissao = (e) => {
        mutacaoProfissao.mutate(e.target.value);
    };

    const handleAdicionarLink = (e) => {
        e.preventDefault();

        if (!novoTitulo.trim() || !novaUrl.trim()) {
            return toast.error('Preencha o título e a URL!');
        }

        if (!urlSegura(novaUrl)) {
            return toast.error('URL inválida. Use http:// ou https://');
        }

        mutacaoAdicionarLink.mutate({ titulo: novoTitulo.trim(), url: novaUrl.trim() });

        setNovoTitulo('');
        setNovaUrl('');
    };

    const mutacaoDeletarLink = useMutation({
        mutationFn: async (idDoLink) => {
            const { data } = await api.delete(`/usuario/link/${idDoLink}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
            toast.success('Link excluído com sucesso!');
        }
    });

    const idDoUsuarioLogado = perfil?._id || perfil?.id;
    const meuLinkPublico = idDoUsuarioLogado ? `${window.location.origin}/p/${idDoUsuarioLogado}` : '';

    const copiarLink = async () => {
        try {
            await navigator.clipboard.writeText(meuLinkPublico);
            toast.success('Link copiado para a área de transferência!', { id: 'copiar-link' });
        } catch (err) {
            console.error('Erro ao copiar o link: ', err);
            toast.error('Não foi possível copiar o link.', { id: 'copiar-link' });
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            {/* Top Navigation */}
            <header className="border-b border-[var(--color-border-default)]" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                <div className="max-w-4xl mx-auto px-4 py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🔗</span>
                        <span className="text-base font-bold tracking-tight" style={{ color: 'var(--color-accent)' }}>
                            DevLinks
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {meuLinkPublico && (
                            <a
                                href={meuLinkPublico}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                                <span>Ver perfil público</span>
                                <span>↗</span>
                            </a>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] transition-colors hover:border-[var(--color-error)] hover:text-[var(--color-error)] cursor-pointer"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8">
                {isLoading && <SkeletonDashboard />}

                {isError && (
                    <div className="text-center py-16 p-8 border border-[var(--color-border-default)] rounded-xl" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--color-error)' }}>
                            Não foi possível carregar seu perfil.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!isLoading && !isError && perfil && (
                    <>
                        {/* Header de Perfil */}
                        <div className="p-6 sm:p-8 border border-[var(--color-border-default)] rounded-xl relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Avatar com Botão de Troca */}
                                <div className="relative group">
                                    {perfil.avatar ? (
                                        <img
                                            src={perfil.avatar}
                                            alt={`Avatar de ${perfil.name}`}
                                            className="h-24 w-24 rounded-full object-cover border-2 border-[var(--color-accent)] shadow-md"
                                        />
                                    ) : (
                                        <div
                                            className="h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-[var(--color-accent)] shadow-md"
                                            style={{
                                                backgroundColor: 'var(--color-bg-elevated)',
                                                color: 'var(--color-accent)',
                                            }}
                                        >
                                            {perfil.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <label
                                        className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold text-white text-center p-1"
                                    >
                                        {mutacaoUploadFoto.isPending ? 'Enviando...' : 'Trocar Foto'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={lidarComEscolhaDeFoto}
                                            disabled={mutacaoUploadFoto.isPending}
                                        />
                                    </label>
                                </div>

                                {/* Informações do Usuário */}
                                <div className="flex-1 text-center sm:text-left space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                                                {perfil.name}
                                            </h1>
                                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {perfil.email}
                                            </p>
                                        </div>

                                        {/* Botão de Copiar Link */}
                                        <button
                                            onClick={copiarLink}
                                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer hover:opacity-90 self-center sm:self-start"
                                            style={{
                                                backgroundColor: 'var(--color-accent)',
                                                color: 'var(--color-bg-primary)',
                                            }}
                                        >
                                            <span>📋</span>
                                            <span>Copiar Link Público</span>
                                        </button>
                                    </div>

                                    {/* Campo de Profissão / Bio */}
                                    <div className="pt-2">
                                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                            Sua especialidade ou cargo:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Desenvolvedor Full Stack"
                                            defaultValue={perfil.profession || ''}
                                            onBlur={handleSalvarProfissao}
                                            className="w-full max-w-sm px-3 py-1.5 text-xs border rounded-lg transition-colors focus:border-[var(--color-accent)]"
                                            style={{
                                                backgroundColor: 'var(--color-bg-primary)',
                                                color: 'var(--color-text-primary)',
                                                borderColor: 'var(--color-border-default)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulário de Adicionar Link */}
                        <div className="p-6 border border-[var(--color-border-default)] rounded-xl" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                            <div className="mb-4">
                                <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                                    Adicionar Novo Link
                                </h2>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                    Insira o título da plataforma e a URL de destino
                                </p>
                            </div>

                            <form onSubmit={handleAdicionarLink} className="grid sm:grid-cols-[1fr_1.5fr_auto] gap-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Título (ex: GitHub)"
                                        value={novoTitulo}
                                        onChange={(e) => setNovoTitulo(e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm border rounded-lg transition-colors focus:border-[var(--color-accent)]"
                                        style={{
                                            backgroundColor: 'var(--color-bg-primary)',
                                            color: 'var(--color-text-primary)',
                                            borderColor: 'var(--color-border-default)',
                                        }}
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/usuario"
                                        value={novaUrl}
                                        onChange={(e) => setNovaUrl(e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm border rounded-lg transition-colors focus:border-[var(--color-accent)]"
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
                                    disabled={mutacaoAdicionarLink.isPending}
                                    className="py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1 shrink-0"
                                    style={{
                                        backgroundColor: 'var(--color-accent)',
                                        color: 'var(--color-bg-primary)',
                                    }}
                                >
                                    {mutacaoAdicionarLink.isPending ? 'Salvando...' : '+ Adicionar Link'}
                                </button>
                            </form>
                        </div>

                        {/* Lista de Links Cadastrados */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                                    Seus Links ({perfil.links?.length || 0})
                                </h3>
                                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                    Ativos no seu perfil público
                                </span>
                            </div>

                            {perfil.links && perfil.links.length > 0 ? (
                                <div className="grid gap-2.5">
                                    {perfil.links.map((link, index) => (
                                        <div
                                            key={link._id || index}
                                            className="flex items-center justify-between gap-4 p-4 border border-[var(--color-border-default)] rounded-xl transition-all hover:border-[var(--color-accent)]/60"
                                            style={{ backgroundColor: 'var(--color-bg-surface)' }}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}>
                                                    🔗
                                                </div>
                                                <div className="truncate">
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-bold block truncate transition-colors hover:text-[var(--color-accent)]"
                                                        style={{ color: 'var(--color-text-primary)' }}
                                                    >
                                                        {link.titulo}
                                                    </a>
                                                    <p className="text-[11px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                                                        {link.url}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs px-2.5 py-1 rounded border border-[var(--color-border-default)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                    title="Testar link em nova aba"
                                                >
                                                    Abrir ↗
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        const idParaDeletar = link._id || link.id;
                                                        if (window.confirm(`Tem certeza que deseja excluir o link "${link.titulo}"?`)) {
                                                            mutacaoDeletarLink.mutate(idParaDeletar);
                                                        }
                                                    }}
                                                    disabled={mutacaoDeletarLink.isPending}
                                                    className="text-xs px-2.5 py-1 rounded border border-transparent transition-colors hover:border-[var(--color-error)] hover:bg-[var(--color-error)]/10 cursor-pointer disabled:opacity-50"
                                                    style={{ color: 'var(--color-error)' }}
                                                    title="Excluir link"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border border-dashed border-[var(--color-border-default)] rounded-xl" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        Você ainda não cadastrou nenhum link. Use o formulário acima para adicionar o primeiro!
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
