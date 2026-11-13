import { Navigate, Outlet } from 'react-router-dom';
import { ListasProvider } from '../contexts/ListasContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Só deixa passar quem está autenticado. As listas são carregadas aqui, então
 * o estado é descartado ao sair e recarregado ao entrar com outra conta.
 */
export default function RotaProtegida() {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ListasProvider>
      <Outlet />
    </ListasProvider>
  );
}
