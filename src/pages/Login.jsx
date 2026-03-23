import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resposta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                localStorage.setItem('meu_token_vip', dados.token);
                navigate('/dashboard');
            } else {
                alert("Erro no login: " + dados.message);
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login na Minha API</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>E-mail: </label>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Senha: </label>
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );



}