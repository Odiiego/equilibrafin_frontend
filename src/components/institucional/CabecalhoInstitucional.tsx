import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function CabecalhoInstitucional() {
  const { autenticado } = useAuth();

  return (
    <header className="border-b border-forest-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5 md:px-12">
        <Link
          to="/"
          className="flex font-ultra text-3xl text-forest-950"
          aria-label="EquilibraFin, página inicial"
        >
          <span className="relative z-10">Equilibra</span>
          <span className="relative z-0 -ml-2 top-2 text-forest-700">Fin</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-4">
          <Link
            to="/tutoriais"
            className="rounded-lg px-3 py-2 text-forest-900 transition hover:bg-forest-200"
          >
            Tutoriais
          </Link>
          {autenticado ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-[#FBFE34] px-4 py-2 font-bold text-forest-950 shadow-sm transition hover:bg-[#E8EB20]"
            >
              Meu painel
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-3 py-2 text-forest-900 transition hover:bg-forest-200 sm:inline-block"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-xl bg-[#FBFE34] px-4 py-2 font-bold text-forest-950 shadow-sm transition hover:bg-[#E8EB20]"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
