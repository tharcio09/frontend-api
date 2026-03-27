import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';


export function Dashboard() {
    const navigate = useNavigate();

    const { data: listaUsuarios, isLoading, isError } = useQuery({
        queryKey: ['lista-usuarios'],
        queryFn: async () => {
            const token = localStorage.getItem('meu_token_vip');
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuario`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resposta.ok) {
                if (respostastatus === 401) {
                    localStorage.removeItem('meu_token_vip');
                    navigate('/');
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao buscar usuários');
            }

            return resposta.json();
        },
        retry: false
    });

    const handleLogout = () => {
        localStorage.removeItem('meu_token_vip');
        navigate('/');
    };

    const queryClient = useQueryClient();

    const mutacaoExcluir = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('meu_token_vip');

            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuario/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resposta.ok) throw new Error('Erro ao excluir usuário');
            return resposta.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lista-usuarios'] });
            toast.success('Usuário excluído com sucesso!');
        },
        onError: (erro) => {
            toast.error(`Erro: ${erro.message}`);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-blue-600">Painel de Controle</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 border border-red-200 rounded shadow-sm transition-colors"
                        >
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">

                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Usuários Cadastrados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Lista completa de usuários retornada pela API segura.
                        </p>
                    </div>

                    <div className="p-6">
                        {listaUsuarios?.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                Carregando usuários...
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {isLoading && <p className="text-blue-500 font-semibold">Carregando usuários...</p>}
                                {isError && <p className="text-red-500 font-semibold">Erro ao carregar os dados.</p>}
                                {listaUsuarios?.map((usuario) => (
                                    <li key={usuario._id} className="py-4 flex hover:bg-gray-50 transition-colors px-2 rounded -mx-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{usuario.name}</p>
                                            <p className="text-sm text-gray-500">{usuario.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Ativo
                                            </span>
                                            <button
                                                onClick={() => mutacaoExcluir.mutate(usuario._id)}
                                                disabled={mutacaoExcluir.isPending}
                                                className="text-red-500 font-bold hover:text-red-700 disabled:opacity-50"
                                            >
                                                {mutacaoExcluir.isPending ? 'Excluindo...' : 'Excluir'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}