import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Target } from 'lucide-react';
import CabecalhoApp from '../../components/CabecalhoApp';
import { mensagemDeErro } from '../../services/api';
import { useListas } from '../../contexts/ListasContext';
import ObjetivosFormulario from '../../components/ObjetivosFormulario';
import { BadgeRitmo, BarraRitmo } from '../../components/IndicadoresRitmo';
import { calcularSaldo, type ObjetivosLista } from '../../utils/listas';
import {
  ROTULO_PERIODO,
  calcularRitmos,
  nomeObjetivo,
  rascunhosVazios,
  validarRascunhos,
} from '../../utils/objetivos';

export default function Dashboard() {
  const [nomeLista, setNomeLista] = useState('');
  const { listas, adicionarLista, carregando, erroCarga, recarregar } =
    useListas();
  const [salvando, setSalvando] = useState(false);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [comObjetivo, setComObjetivo] = useState(false);
  const [rascunhos, setRascunhos] = useState(rascunhosVazios());

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  const [erro, setErro] = useState('');

  async function criarLista(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nome = nomeLista.trim();

    if (!nome) {
      setErro('Digite um nome para sua lista.');
      return;
    }

    let objetivos: ObjetivosLista | undefined;

    if (comObjetivo) {
      const resultado = validarRascunhos(rascunhos);

      if ('erro' in resultado) {
        setErro(resultado.erro);
        return;
      }

      objetivos = resultado.objetivos;
    }

    setSalvando(true);

    try {
      await adicionarLista(nome, objetivos);
      setComObjetivo(false);
      setRascunhos(rascunhosVazios());
      setNomeLista('');
      setErro('');
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-forest-100">
      {/* Cabeçalho */}
      <CabecalhoApp />

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-14">
        {/* Título */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-forest-950 md:text-4xl">
            Minhas listas
          </h1>

          <p className="mt-2 text-forest-800">
            Organize seus lançamentos financeiros do seu jeito.
          </p>
        </div>

        {/* Criar lista */}
        <section className="rounded-2xl bg-white p-6 shadow-md md:p-8">
          <h2 className="text-xl font-bold text-forest-950">
            Criar nova lista
          </h2>

          <p className="mt-2 text-sm text-forest-800">
            Escolha um nome para organizar seus lançamentos.
          </p>

          <form onSubmit={criarLista} className="mt-6">
            <label
              htmlFor="nomeLista"
              className="mb-2 block text-sm font-semibold text-forest-950"
            >
              Nome da lista
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="nomeLista"
                type="text"
                value={nomeLista}
                onChange={(event) => setNomeLista(event.target.value)}
                placeholder="Ex.: Despesas de outubro"
                maxLength={60}
                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-forest-950 outline-none transition placeholder:text-gray-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-500"
              />

              <button
                type="submit"
                disabled={salvando}
                className="cursor-pointer rounded-xl bg-[#FBFE34] px-6 py-3 font-bold text-forest-950 shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-[#E8EB20] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                + Criar lista
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setComObjetivo((aberto) => !aberto)}
                aria-expanded={comObjetivo}
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-forest-800 hover:text-forest-950"
              >
                <Target size={16} aria-hidden="true" />
                {comObjetivo
                  ? 'Remover limite ou meta'
                  : 'Adicionar limite ou meta (opcional)'}
              </button>

              {comObjetivo && (
                <div className="mt-4 rounded-xl border border-forest-200 bg-forest-100/40 p-4">
                  <ObjetivosFormulario
                    valor={rascunhos}
                    onChange={setRascunhos}
                    idPrefix="nova-lista"
                  />
                </div>
              )}
            </div>

            {erro && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {erro}
              </p>
            )}
          </form>
        </section>

        {/* Listas cadastradas */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-forest-950">Suas listas</h2>

            <span className="rounded-full bg-forest-200 px-3 py-1 text-sm font-semibold text-forest-900">
              {listas.length}
            </span>
          </div>

          {carregando ? (
            <p className="text-sm text-forest-800" role="status">
              Carregando suas listas...
            </p>
          ) : erroCarga && listas.length === 0 ? (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center"
              role="alert"
            >
              <p className="font-semibold text-red-700">{erroCarga}</p>
              <button
                type="button"
                onClick={recarregar}
                className="mt-4 cursor-pointer rounded-xl bg-white px-5 py-2 text-sm font-semibold text-forest-950 shadow-sm hover:bg-forest-100"
              >
                Tentar novamente
              </button>
            </div>
          ) : listas.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-forest-300 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-forest-900">
                Sua organização começa aqui!
              </p>

              <p className="mt-2 text-sm text-forest-700">
                Crie sua primeira lista para começar a organizar seus
                lançamentos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listas.map((lista) => {
                const ritmos = [
                  ...Object.values(calcularRitmos(lista, listas)),
                ].filter((ritmo) => ritmo !== null);

                return (
                  <Link
                    key={lista.id}
                    to={`/dashboard/listas/${lista.id}`}
                    className="block rounded-2xl border border-forest-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <h2 className="font-semibold text-forest-950">
                      {lista.nome}
                    </h2>

                    <div className="mt-5 border-t border-forest-100 pt-4">
                      <p className="text-sm text-gray-500">Saldo atual</p>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="text-xl font-bold text-forest-950">
                          {mostrarSaldo
                            ? formatarMoeda(calcularSaldo(lista.id, listas))
                            : '••••••'}
                        </p>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setMostrarSaldo((visivel) => !visivel);
                          }}
                          aria-label={
                            mostrarSaldo ? 'Ocultar saldo' : 'Mostrar saldo'
                          }
                          aria-pressed={mostrarSaldo}
                          className="rounded-lg p-2 text-forest-700 transition hover:bg-forest-100"
                        >
                          {mostrarSaldo ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    {ritmos.map((ritmo) => (
                      <div
                        key={ritmo.objetivo.tipo}
                        className="mt-4 border-t border-forest-100 pt-4"
                      >
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-gray-500">
                            {nomeObjetivo(ritmo.objetivo)} ·{' '}
                            {ROTULO_PERIODO[
                              ritmo.objetivo.periodo
                            ].toLowerCase()}
                          </span>
                          <BadgeRitmo ritmo={ritmo} />
                        </div>

                        <BarraRitmo ritmo={ritmo} className="mt-3" />

                        <p className="mt-2 text-xs text-gray-500">
                          {formatarMoeda(ritmo.realizado)} de{' '}
                          {formatarMoeda(ritmo.objetivo.valor)}
                        </p>
                      </div>
                    ))}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
