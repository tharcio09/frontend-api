import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Cadastro } from './pages/Cadastro';
import { RotaPrivada } from './components/RotaPrivada';
import { PublicProfile } from './components/PublicProfile';
import { Toaster } from 'react-hot-toast';
import { PerfilPublico } from './pages/PerfilPublico';

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/p/:id" element={<PerfilPublico />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;