import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CabecalhoInstitucional from '../../components/institucional/CabecalhoInstitucional';
import RodapeInstitucional from '../../components/institucional/RodapeInstitucional';
import {
  CATEGORIAS,
  TUTORIAIS,
  minutosDeLeitura,
  type Categoria,
} from '../../data/tutoriais';

export default function Tutoriais() {
  const { autenticado } = useAuth();
  const [filtro, setFiltro] = useState<Categoria | 'Todos'>('Todos');

  useEffect(() => {
    document.title = 'Tutoriais | EquilibraFin';
  }, []);

  const tutoriais =
    filtro === 'Todos'
      ? TUTORIAIS
      : TUTORIAIS.filter((tutorial) => tutorial.categoria === filtro);

  return (
    <div className="min-h-screen bg-forest-100">
      <CabecalhoInstitucional />

      <main className="mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-forest-700">
            Central de tutoriais
          </p>
          <h1 className="mt-3 text-4xl font-bold text-forest-950 md:text-5xl">
            Aprenda a controlar seus gastos com o EquilibraFin
          </h1>
          <p className="mt-4 text-lg leading-8 text-forest-800">
            Guias curtos e diretos para você sair do zero, organizar seus
            lançamentos e acompanhar se seu dinheiro está no ritmo que você
            planejou.
          </p>
        </section>

        <div
          role="group"
          aria-label="Filtrar por assunto"
          className="mt-10 flex flex-wrap gap-2"
        >
          {(['Todos', ...CATEGORIAS] as const).map((opcao) => (
            <button
              key={opcao}
              type="button"
              aria-pressed={filtro === opcao}
              onClick={() => setFiltro(opcao)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                filtro === opcao
                  ? 'bg-forest-900 text-white'
                  : 'bg-white text-forest-800 ring-1 ring-forest-200 hover:bg-forest-200'
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {tutoriais.map((tutorial) => (
            <li key={tutorial.slug}>
              <Link
                to={`/tutoriais/${tutorial.slug}`}
                className="flex h-full flex-col rounded-2xl border border-forest-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="w-fit rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-800">
                  {tutorial.categoria}
                </span>
                <h2 className="mt-4 text-xl font-bold text-forest-950">
                  {tutorial.titulo}
                </h2>
                <p className="mt-2 flex-1 leading-7 text-forest-800">
                  {tutorial.resumo}
                </p>
                <p className="mt-5 text-sm font-semibold text-forest-700">
                  {minutosDeLeitura(tutorial)} min de leitura →
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {!autenticado && (
          <section className="mt-16 rounded-2xl bg-forest-900 p-8 text-center text-white md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">
              Pronto para colocar em prática?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-forest-100">
              Crie sua conta e monte sua primeira lista em poucos minutos.
            </p>
            <Link
              to="/cadastro"
              className="mt-6 inline-block rounded-xl bg-[#FBFE34] px-8 py-4 text-lg font-bold text-forest-950 shadow-md transition duration-200 hover:scale-[1.02] hover:bg-[#E8EB20] active:scale-95"
            >
              Criar minha conta →
            </Link>
          </section>
        )}
      </main>

      <RodapeInstitucional />
    </div>
  );
}
