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

    return (
        <div style={{ padding: '20px' }}>
            <h2>Painel de Controle (Dashboard)</h2>
            <button onClick={handleLogout} style={{ marginBottom: '20px', backgroundColor: '#ff4444', color: 'white' }}>
                Sair do Sistema
            </button>

            <div style={{ padding: '10px', border: '1px solid #ccc' }}>
                <h3>Usuários do Sistema:</h3>
                {listaUsuarios.length === 0 ? (
                    <p>Nenhum usuário encontrado ou carregando...</p>
                ) : (
                    <ul>
                        {listaUsuarios.map((usuario) => (
                            <li key={usuario._id}>
                                <strong>{usuario.name}</strong> - {usuario.email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}