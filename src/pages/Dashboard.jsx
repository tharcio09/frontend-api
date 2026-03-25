import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function Dashboard() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const buscarUsuarios = async () => {
            const tokenGuardado = localStorage.getItem('meu_token_vip');

            if (!tokenGuardado) {
                console.log("Sem token, impossível buscar dados.");
                return;
            }

            try {
                const resposta = await fetch('http://localhost:3000/usuario', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenGuardado}`
                    }
                });
                const dados = await resposta.json();

                if (resposta.ok) {
                    setListaUsuarios(dados);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários", error);
            }
        };

        buscarUsuarios();

    }, []);

    const handleLogout = () => {
        localStorage.removeItem('meu_token_vip');
        navigate('/');
    };

    const deletarUsuario = async (id) => {

        const confirmacao = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (!confirmacao) return;

        const tokenGuardado = localStorage.getItem('meu_token_vip');

        try {
            const resposta = await fetch(`http://localhost:3000/usuario/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenGuardado}`
                }
            });

            if (resposta.ok) {
                setListaUsuarios((listaAnterior) =>
                    listaAnterior.filter((usuario) => usuario._id !== id)
                );
                alert("Usuário excluído com sucesso!");
            } else {
                const dados = await resposta.json();
                alert("Erro ao excluir;" + dados.message);
            }
        } catch (error) {
            console.error("Erro na requisição de exclusão", error);
        }
    }

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
                        {listaUsuarios.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                Carregando usuários...
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {listaUsuarios.map((usuario) => (
                                    <li key={usuario._id} className="py-4 flex hover:bg-gray-50 transition-colors px-2 rounded -mx-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{usuario.name}</p>
                                            <p className="text-sm text-gray-500">{usuario.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Ativo
                                            </span>
                                            {/*Botão de Excluir */}
                                            <button
                                                onClick={() => deletarUsuario(usuario._id)}
                                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors text-sm font-semibold border border-transparent hover:border-red-200"
                                            >
                                                Excluir
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