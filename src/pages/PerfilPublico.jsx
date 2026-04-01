import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export function PerfilPublico() {
    const { id } = useParams();

    const { data: perfil, isLoading, isError } = useQuery({
        queryKey: ['perfil-publico', id],
        queryFn: async () => {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/p/${id}`);
            if (!resposta.ok) throw new Error('Perfil não encontrado');
            return resposta.json();
        },
        retry: false
    });

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-blue-600 font-semibold animate-pulse">Carregando perfil...</p></div>;
    }

    if (isError) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-500 font-bold">Perfil não encontrado ou indisponível.</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <main className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 pb-8">
                    <div className="bg-blue-600 h-24"></div>

                    <div className="px-6">
                        <div className="relative -mt-12 mb-4 flex justify-center">
                            {perfil?.avatar ? (
                                <img
                                    src={perfil.avatar}
                                    alt={`Avatar de ${perfil.name}`}
                                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-gray-400">
                                    {perfil?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">{perfil?.name}</h2>

                            <div className="space-y-4">
                                {perfil?.links && perfil.links.length > 0 ? (
                                    perfil.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full p-4 bg-white border border-gray-200 rounded-xl text-center font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all shadow-sm"
                                        >
                                            {link.titulo}
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">Nenhum link adicionado ainda.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}