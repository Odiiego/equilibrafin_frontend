import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RodapeInstitucional() {
  const { autenticado } = useAuth();

  return (
    <footer className="mt-16 border-t border-forest-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-forest-800 md:flex-row md:items-center md:justify-between md:px-12">
        <p>
          <span className="font-ultra text-forest-950">EquilibraFin</span> ·
          Equilíbrio para suas finanças.
        </p>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
          <Link to="/" className="hover:text-forest-600">
            Início
          </Link>
          <Link to="/tutoriais" className="hover:text-forest-600">
            Tutoriais
          </Link>
          {autenticado ? (
            <Link to="/dashboard" className="hover:text-forest-600">
              Meu painel
            </Link>
          ) : (
            <>
              <Link to="/login" className="hover:text-forest-600">
                Entrar
              </Link>
              <Link to="/cadastro" className="hover:text-forest-600">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
