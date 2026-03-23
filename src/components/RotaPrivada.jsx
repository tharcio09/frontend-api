import { Navigate } from "react-router-dom";

export function RotaPrivada({ children }) {
    const token = localStorage.getItem('meu_token_vip');

    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
}