import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CabecalhoInstitucional from '../../components/institucional/CabecalhoInstitucional';
import ConteudoPost from '../../components/institucional/ConteudoPost';
import RodapeInstitucional from '../../components/institucional/RodapeInstitucional';
import {
  TUTORIAIS,
  encontrarTutorial,
  idDoSubtitulo,
  minutosDeLeitura,
} from '../../data/tutoriais';

export default function Tutorial() {
  const { autenticado } = useAuth();
  const { slug } = useParams();
  const tutorial = encontrarTutorial(slug);

  useEffect(() => {
    document.title = tutorial
      ? `${tutorial.titulo} | EquilibraFin`
      : 'Tutorial não encontrado | EquilibraFin';
  }, [tutorial]);

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-forest-100">
        <CabecalhoInstitucional />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-forest-950">
            Não encontramos este tutorial
          </h1>
          <p className="mt-3 text-forest-800">
            O endereço pode ter mudado ou estar incorreto.
          </p>
          <Link
            to="/tutoriais"
            className="mt-6 inline-block rounded-xl bg-[#FBFE34] px-6 py-3 font-bold text-forest-950 shadow-sm hover:bg-[#E8EB20]"
          >
            Ver todos os tutoriais
          </Link>
        </main>
        <RodapeInstitucional />
      </div>
    );
  }

  const posicao = TUTORIAIS.indexOf(tutorial);
  const anterior = TUTORIAIS[posicao - 1];
  const proximo = TUTORIAIS[posicao + 1];

  const topicos = tutorial.conteudo.flatMap((bloco) =>
    bloco.tipo === 'subtitulo' ? [bloco.texto] : [],
  );

  return (
    <div className="min-h-screen bg-forest-100">
      <CabecalhoInstitucional />

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav aria-label="Você está em" className="text-sm text-forest-700">
          <Link to="/tutoriais" className="font-semibold hover:text-forest-950">
            Tutoriais
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{tutorial.categoria}</span>
        </nav>

        <article className="mt-6">
          <header>
            <h1 className="text-4xl font-bold leading-tight text-forest-950 md:text-5xl">
              {tutorial.titulo}
            </h1>
            <p className="mt-4 text-xl leading-8 text-forest-800">
              {tutorial.resumo}
            </p>
            <p className="mt-4 text-sm font-semibold text-forest-700">
              {minutosDeLeitura(tutorial)} min de leitura
            </p>
          </header>

          {topicos.length > 2 && (
            <nav
              aria-label="Neste tutorial"
              className="mt-8 rounded-2xl border border-forest-200 bg-white p-5"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-forest-700">
                Neste tutorial
              </p>
              <ul className="mt-3 space-y-2">
                {topicos.map((topico) => (
                  <li key={topico}>
                    <a
                      href={`#${idDoSubtitulo(topico)}`}
                      className="text-forest-900 underline underline-offset-4 hover:text-forest-600"
                    >
                      {topico}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mt-10">
            <ConteudoPost blocos={tutorial.conteudo} />
          </div>
        </article>

        {!autenticado && (
          <section className="mt-14 rounded-2xl bg-forest-900 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Experimente agora</h2>
            <p className="mx-auto mt-2 max-w-md text-forest-100">
              Leva poucos minutos para criar a conta e montar sua primeira
              lista.
            </p>
            <Link
              to="/cadastro"
              className="mt-5 inline-block rounded-xl bg-[#FBFE34] px-7 py-3 font-bold text-forest-950 shadow-md transition duration-200 hover:scale-[1.02] hover:bg-[#E8EB20] active:scale-95"
            >
              Criar minha conta →
            </Link>
          </section>
        )}

        <nav
          aria-label="Outros tutoriais"
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {anterior ? (
            <Link
              to={`/tutoriais/${anterior.slug}`}
              className="rounded-2xl border border-forest-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-sm font-semibold text-forest-700">
                ← Anterior
              </span>
              <span className="mt-1 block font-bold text-forest-950">
                {anterior.titulo}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {proximo && (
            <Link
              to={`/tutoriais/${proximo.slug}`}
              className="rounded-2xl border border-forest-200 bg-white p-5 text-right transition hover:-translate-y-1 hover:shadow-md sm:col-start-2"
            >
              <span className="text-sm font-semibold text-forest-700">
                Próximo →
              </span>
              <span className="mt-1 block font-bold text-forest-950">
                {proximo.titulo}
              </span>
            </Link>
          )}
        </nav>
      </main>

      <RodapeInstitucional />
    </div>
  );
}
