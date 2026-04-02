import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

export function PublicProfile() {

    const { username } = useParams();
    const [links, setLinks] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarLinksDoUsuario = async () => {
            try {
                const response = await fetch(`https://minha-api-lih7.onrender.com/p/${username}`);
                if (!response.ok) {
                    throw new Error('Usuário não encontrado ou erro na API');
                }

                const data = await response.json();
                setLinks(data);
            } catch (error) {
                console.error("Erro ao buscar links:", error);
            } finally {
                setCarregando(false);
            }
        };

        buscarLinksDoUsuario();
    }, [username]);

    if (carregando) {
        return <div className="flex justify-center mt-20 font-semibold text-gray-500">Carregando perfil...</div>;
    }

    return (
        <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4">
                {/* Espaço para a foto de perfil (pode ser uma imagem depois) */}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">@{username}</h1>

            <div className="w-full max-w-md space-y-4">
                {links.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhum link adicionado ainda.</p>
                ) : (
                    links.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full p-4 bg-white border border-gray-200 rounded-xl text-center font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                        >
                            {link.titulo} {/* Confirme se na sua API o nome da propriedade é 'titulo' ou 'title' */}
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}