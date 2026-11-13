import { Link } from 'react-router-dom';
import MenuConta from './MenuConta';

/** Cabeçalho das telas logadas: logo, link para os tutoriais e menu da conta. */
export default function CabecalhoApp() {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <Link
        to="/dashboard"
        className="flex justify-center font-ultra text-3xl text-forest-950"
        aria-label="EquilibraFin, meu painel"
      >
        <span className="relative z-10">Equilibra</span>
        <span className="relative z-0 -ml-2 top-2 text-forest-700">Fin</span>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/tutoriais"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-forest-900 transition hover:bg-forest-200"
        >
          Tutoriais
        </Link>
        <MenuConta />
      </nav>
    </header>
  );
}
