import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import dadosFinanceiros from '../mocks/lancamentos';
import {
  ehReferencia,
  type ItemLista,
  type Lancamento,
  type Lista,
} from '../utils/listas';

type ListasContextValue = {
  listas: Lista[];
  adicionarLista: (nome: string) => void;
  excluirLista: (listaId: number) => void;
  adicionarItem: (listaId: number, item: ItemLista) => void;
  atualizarLancamento: (
    listaId: number,
    itemId: number,
    dados: Omit<Lancamento, 'id'>,
  ) => void;
  removerItem: (listaId: number, itemId: number) => void;
};

const ListasContext = createContext<ListasContextValue | null>(null);

export function ListasProvider({ children }: { children: ReactNode }) {
  const [listas, setListas] = useState<Lista[]>([
    {
      ...dadosFinanceiros.lista,
      itens: dadosFinanceiros.lancamentos as Lancamento[],
    },
  ]);

  const adicionarLista = (nome: string) =>
    setListas((atuais) => [...atuais, { id: Date.now(), nome, itens: [] }]);

  // Ao excluir uma lista, remove também as entradas que apontavam para ela.
  const excluirLista = (listaId: number) =>
    setListas((atuais) =>
      atuais
        .filter((lista) => lista.id !== listaId)
        .map((lista) => ({
          ...lista,
          itens: lista.itens.filter(
            (item) => !(ehReferencia(item) && item.listaId === listaId),
          ),
        })),
    );

  const adicionarItem = (listaId: number, item: ItemLista) =>
    setListas((atuais) =>
      atuais.map((lista) =>
        lista.id === listaId
          ? { ...lista, itens: [...lista.itens, item] }
          : lista,
      ),
    );

  const atualizarLancamento = (
    listaId: number,
    itemId: number,
    dados: Omit<Lancamento, 'id'>,
  ) =>
    setListas((atuais) =>
      atuais.map((lista) =>
        lista.id === listaId
          ? {
              ...lista,
              itens: lista.itens.map((item) =>
                item.id === itemId && !ehReferencia(item)
                  ? { ...item, ...dados }
                  : item,
              ),
            }
          : lista,
      ),
    );

  const removerItem = (listaId: number, itemId: number) =>
    setListas((atuais) =>
      atuais.map((lista) =>
        lista.id === listaId
          ? { ...lista, itens: lista.itens.filter((i) => i.id !== itemId) }
          : lista,
      ),
    );

  return (
    <ListasContext.Provider
      value={{
        listas,
        adicionarLista,
        excluirLista,
        adicionarItem,
        atualizarLancamento,
        removerItem,
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
