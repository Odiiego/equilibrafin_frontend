import { useEffect, useRef, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const iniciais = (nome: string) =>
  nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');

/** Botão com as iniciais da pessoa; abre um menu simples com a conta e “Sair”. */
export default function MenuConta() {
  const { usuario, sair } = useAuth();
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (evento: MouseEvent) => {
      if (!raiz.current?.contains(evento.target as Node)) setAberto(false);
    };

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        setAberto(false);
        botao.current?.focus();
      }
    };

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoPressionarTecla);

    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoPressionarTecla);
    };
  }, [aberto]);

  return (
    <div ref={raiz} className="relative">
      <button
        ref={botao}
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-expanded={aberto}
        aria-controls="menu-conta"
        aria-label="Menu da conta"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-forest-800 text-sm font-bold text-white transition hover:bg-forest-900"
      >
        {usuario ? (
          iniciais(usuario.nome)
        ) : (
          <User size={20} aria-hidden="true" />
        )}
      </button>

      {aberto && (
        <div
          id="menu-conta"
          className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-forest-200 bg-white p-2 shadow-lg"
        >
          <div className="px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">
              Conta
            </p>
            <p className="mt-1 truncate font-semibold text-forest-950">
              {usuario?.nome ?? 'Carregando...'}
            </p>
            {usuario && (
              <p className="truncate text-sm text-gray-500">{usuario.email}</p>
            )}
          </div>

          <div className="my-1 border-t border-forest-100" />

          <button
            type="button"
            onClick={sair}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} aria-hidden="true" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
