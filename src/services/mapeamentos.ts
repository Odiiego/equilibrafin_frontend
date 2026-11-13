import type {
  ItemLista,
  Lancamento,
  Lista,
  Objetivo,
  ObjetivosLista,
  PeriodoTipo,
} from '../utils/listas';

/* Formato da API (inglês) → formato do front (português), e o caminho inverso. */

export type ObjetivoApi = {
  value: string;
  period: 'weekly' | 'monthly' | 'yearly' | 'custom';
  start_date: string | null;
  end_date: string | null;
  base: 'earnings' | 'balance' | null;
};

export type EntradaApi = {
  id: number;
  list_id: number;
  kind: 'transaction' | 'list';
  referenced_list_id: number | null;
  description: string | null;
  category: string | null;
  type: 'income' | 'expense' | null;
  amount: string | null; // a API serializa Decimal como texto
  date: string;
  note: string;
};

export type ListaApi = {
  id: number;
  name: string;
  limit: ObjetivoApi | null;
  goal: ObjetivoApi | null;
  entries: EntradaApi[];
};

const PERIODO_PARA_API: Record<PeriodoTipo, ObjetivoApi['period']> = {
  semanal: 'weekly',
  mensal: 'monthly',
  anual: 'yearly',
  customizado: 'custom',
};

const PERIODO_DA_API: Record<ObjetivoApi['period'], PeriodoTipo> = {
  weekly: 'semanal',
  monthly: 'mensal',
  yearly: 'anual',
  custom: 'customizado',
};

/* ------------------------------ da API ------------------------------ */

function objetivoDaApi(tipo: Objetivo['tipo'], dados: ObjetivoApi): Objetivo {
  return {
    tipo,
    valor: Number(dados.value),
    periodo: PERIODO_DA_API[dados.period],
    ...(dados.start_date ? { inicio: dados.start_date } : {}),
    ...(dados.end_date ? { fim: dados.end_date } : {}),
    ...(tipo === 'meta'
      ? {
          base:
            dados.base === 'earnings'
              ? ('ganhos' as const)
              : ('saldo' as const),
        }
      : {}),
  };
}

function entradaDaApi(entrada: EntradaApi): ItemLista {
  if (entrada.kind === 'list' && entrada.referenced_list_id !== null) {
    return {
      id: entrada.id,
      listaId: entrada.referenced_list_id,
      data: entrada.date,
      observacao: entrada.note,
    };
  }

  return {
    id: entrada.id,
    descricao: entrada.description ?? '',
    categoria: entrada.category ?? '',
    tipo: entrada.type === 'income' ? 'receita' : 'despesa',
    valor: Number(entrada.amount),
    data: entrada.date,
    observacao: entrada.note,
  };
}

export function listaDaApi(lista: ListaApi): Lista {
  return {
    id: lista.id,
    nome: lista.name,
    itens: lista.entries.map(entradaDaApi),
    ...(lista.limit ? { limite: objetivoDaApi('limite', lista.limit) } : {}),
    ...(lista.goal ? { meta: objetivoDaApi('meta', lista.goal) } : {}),
  };
}

/* ------------------------------- p/ API ------------------------------- */

function objetivoParaApi(objetivo: Objetivo) {
  return {
    value: objetivo.valor,
    period: PERIODO_PARA_API[objetivo.periodo],
    start_date: objetivo.inicio ?? null,
    end_date: objetivo.fim ?? null,
    ...(objetivo.tipo === 'meta'
      ? { base: objetivo.base === 'ganhos' ? 'earnings' : 'balance' }
      : {}),
  };
}

export function objetivosParaApi(objetivos: ObjetivosLista) {
  return {
    limit: objetivos.limite ? objetivoParaApi(objetivos.limite) : null,
    goal: objetivos.meta ? objetivoParaApi(objetivos.meta) : null,
  };
}

export type NovoLancamento = Omit<Lancamento, 'id'>;

const camposDoLancamento = (dados: NovoLancamento) => ({
  description: dados.descricao,
  category: dados.categoria,
  type: dados.tipo === 'receita' ? 'income' : 'expense',
  amount: dados.valor,
  date: dados.data,
  note: dados.observacao,
});

export const lancamentoParaApi = (dados: NovoLancamento) => ({
  kind: 'transaction' as const,
  ...camposDoLancamento(dados),
});

export const lancamentoParaAtualizacao = camposDoLancamento;

export const entradaDeListaParaApi = (
  listaId: number,
  data: string,
  observacao: string,
) => ({
  kind: 'list' as const,
  referenced_list_id: listaId,
  date: data,
  note: observacao,
});
