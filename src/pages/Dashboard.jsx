import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: perfil, isLoading, isError } = useQuery({
        queryKey: ['meu-perfil'],
        queryFn: async () => {
            const token = localStorage.getItem('meu_token_vip');
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/meu-perfil`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resposta.ok) {
                if (resposta.status === 401) {
                    localStorage.removeItem('meu_token_vip');
                    navigate('/');
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao buscar seu perfil');
            }
            return resposta.json();
        },
        retry: false
    });

    const handleLogout = () => {
        localStorage.removeItem('meu_token_vip');
        navigate('/');
    };

    const mutacaoUploadFoto = useMutation({
        mutationFn: async (arquivo) => {
            const token = localStorage.getItem('meu_token_vip');
            const formData = new FormData();
            formData.append('foto', arquivo);

            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuario/foto`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!resposta.ok) throw new Error('Erro ao enviar a foto');
            return resposta.json();
        },
        onSuccess: (dados) => {
            queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
            toast.success(dados.message || 'Sua foto foi atualizada!');
        },
        onError: (erro) => {
            toast.error(`Erro: ${erro.message}`);
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
            const token = localStorage.getItem('meu_token_vip');
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuario/link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoLink)
            });

            if (!resposta.ok) throw new Error('Erro ao adicionar o link');
            return resposta.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
            toast.success('Link adicionado!');
        },
        onError: (erro) => {
            toast.error(erro.message);
        }
    });

    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaUrl, setNovaUrl] = useState('');

    const handleAdicionarLink = (e) => {
        e.preventDefault();

        if (!novoTitulo || !novaUrl) {
            return toast.error('Preencha o título e a URL!');
        }
        mutacaoAdicionarLink.mutate({ titulo: novoTitulo, url: novaUrl });

        setNovoTitulo('');
        setNovaUrl('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-blue-600">Meu Painel</h1>

                        <div className="flex items-center space-x-4">
                            <label className={`cursor-pointer font-semibold py-2 px-4 border rounded shadow-sm transition-colors ${mutacaoUploadFoto.isPending ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}>
                                {mutacaoUploadFoto.isPending ? 'Enviando...' : 'Mudar Minha Foto'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={lidarComEscolhaDeFoto}
                                    disabled={mutacaoUploadFoto.isPending}
                                />
                            </label>

                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 border border-red-200 rounded shadow-sm transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-md mx-auto py-12 px-4 sm:px-6">

                {isLoading && <p className="text-center text-blue-500 font-semibold">Carregando seu perfil...</p>}
                {isError && <p className="text-center text-red-500 font-semibold">Erro ao carregar perfil.</p>}

                {!isLoading && !isError && perfil && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-blue-600 h-24"></div>

                        <div className="px-6 pb-8">
                            <div className="relative -mt-12 mb-4 flex justify-center">
                                {perfil.avatar ? (
                                    <img
                                        src={perfil.avatar}
                                        alt={`Avatar de ${perfil.name}`}
                                        className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-gray-400">
                                        {perfil.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">{perfil.name}</h2>
                                <p className="text-gray-500 mb-6">{perfil.email}</p>

                                <form onSubmit={handleAdicionarLink} className="mt-6 space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm text-left">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Título (ex: Meu GitHub)"
                                            value={novoTitulo}
                                            onChange={(e) => setNovoTitulo(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="url"
                                            placeholder="URL (ex: https://github.com/tharcio09)"
                                            value={novaUrl}
                                            onChange={(e) => setNovaUrl(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={mutacaoAdicionarLink.isPending}
                                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {mutacaoAdicionarLink.isPending ? 'Adicionando...' : 'Adicionar Link'}
                                    </button>
                                </form>

                                <div className="space-y-3 mt-6">
                                    {perfil.links && perfil.links.length > 0 ? (
                                        perfil.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full p-4 bg-white border border-gray-200 rounded-xl text-center font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                                            >
                                                {link.titulo}
                                            </a>
                                        ))
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 italic shadow-sm text-center">
                                            Nenhum link adicionado ainda.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}