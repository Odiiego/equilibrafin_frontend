import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, mensagemDeErro } from '../services/api';
import type { NovoLancamento } from '../services/mapeamentos';
import type { Lista, ObjetivosLista } from '../utils/listas';

type ListasContextValue = {
  listas: Lista[];
  carregando: boolean;
  erroCarga: string;
  recarregar: () => Promise<void>;
  adicionarLista: (nome: string, objetivos?: ObjetivosLista) => Promise<void>;
  excluirLista: (listaId: number) => Promise<void>;
  definirObjetivos: (
    listaId: number,
    objetivos: ObjetivosLista,
  ) => Promise<void>;
  criarLancamento: (listaId: number, dados: NovoLancamento) => Promise<void>;
  criarEntradaDeLista: (
    listaId: number,
    outraListaId: number,
    data: string,
    observacao: string,
  ) => Promise<void>;
  atualizarLancamento: (
    entradaId: number,
    dados: NovoLancamento,
  ) => Promise<void>;
  excluirEntrada: (entradaId: number) => Promise<void>;
};

const ListasContext = createContext<ListasContextValue | null>(null);

/**
 * As listas vivem no servidor. Depois de cada alteração o conjunto é
 * recarregado: o saldo de uma lista depende das listas aninhadas nela, e o
 * servidor é quem valida (por exemplo, ciclos entre listas).
 * Cada ação lança um erro com mensagem pronta para exibir se falhar.
 */
export function ListasProvider({ children }: { children: ReactNode }) {
  const [listas, setListas] = useState<Lista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState('');

  const recarregar = useCallback(async () => {
    try {
      setListas(await api.listarListas());
      setErroCarga('');
    } catch (erro) {
      setErroCarga(mensagemDeErro(erro));
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    api
      .listarListas()
      .then((dados) => {
        if (!ativo) return;
        setListas(dados);
        setErroCarga('');
      })
      .catch((erro: unknown) => {
        if (ativo) setErroCarga(mensagemDeErro(erro));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const executar = async (acao: () => Promise<void>) => {
    await acao();
    await recarregar();
  };

  return (
    <ListasContext.Provider
      value={{
        listas,
        carregando,
        erroCarga,
        recarregar,
        adicionarLista: (nome, objetivos = {}) =>
          executar(() => api.criarLista(nome, objetivos)),
        excluirLista: (listaId) => executar(() => api.excluirLista(listaId)),
        definirObjetivos: (listaId, objetivos) =>
          executar(() => api.definirObjetivos(listaId, objetivos)),
        criarLancamento: (listaId, dados) =>
          executar(() => api.criarLancamento(listaId, dados)),
        criarEntradaDeLista: (listaId, outraListaId, data, observacao) =>
          executar(() =>
            api.criarEntradaDeLista(listaId, outraListaId, data, observacao),
          ),
        atualizarLancamento: (entradaId, dados) =>
          executar(() => api.atualizarLancamento(entradaId, dados)),
        excluirEntrada: (entradaId) =>
          executar(() => api.excluirEntrada(entradaId)),
      }}
    >
      {children}
    </ListasContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useListas() {
  const contexto = useContext(ListasContext);

  if (!contexto) {
    throw new Error('useListas deve ser usado dentro de <ListasProvider>.');
  }

  return contexto;
}
