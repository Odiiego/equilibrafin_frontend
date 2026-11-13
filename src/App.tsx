import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Dashboard from './pages/Dashboard/Dashboard';
import ListaDetalhe from './pages/ListaDetalhe/ListaDetalhe';
import { ListasProvider } from './contexts/ListasContext';

export default function App() {
  return (
    <ListasProvider>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/dashboard/listas/:id" element={<ListaDetalhe />} />
      </Routes>
    </ListasProvider>
  );
}
