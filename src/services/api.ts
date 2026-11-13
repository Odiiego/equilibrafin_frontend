import type { ObjetivosLista } from '../utils/listas';
import {
  entradaDeListaParaApi,
  lancamentoParaApi,
  lancamentoParaAtualizacao,
  listaDaApi,
  objetivosParaApi,
  type ListaApi,
  type NovoLancamento,
} from './mapeamentos';

const URL_BASE = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

const CHAVE_TOKEN = 'equilibrafin:token';

/* ------------------------------- token ------------------------------- */

export const armazenamentoToken = {
  ler(): string | null {
    try {
      return localStorage.getItem(CHAVE_TOKEN);
    } catch {
      return null;
    }
  },
  salvar(token: string) {
    try {
      localStorage.setItem(CHAVE_TOKEN, token);
    } catch {
      // Sem armazenamento: a sessão dura só até recarregar a página.
    }
  },
  limpar() {
    try {
      localStorage.removeItem(CHAVE_TOKEN);
    } catch {
      // Nada a limpar.
    }
  },
};

// Chamado quando a API responde 401 (token ausente, inválido ou expirado).
let aoNaoAutorizado: (() => void) | null = null;

export function definirAoNaoAutorizado(callback: (() => void) | null) {
  aoNaoAutorizado = callback;
}

/* ------------------------------- erros ------------------------------- */

export class ApiError extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

const MENSAGENS: Record<string, string> = {
  'Incorrect email or password': 'E-mail ou senha incorretos.',
  'Email already exists': 'Já existe uma conta com este e-mail.',
  'Could not validate credentials': 'Sua sessão expirou. Entre novamente.',
  'List not found': 'Lista não encontrada.',
  'Entry not found': 'Lançamento não encontrado.',
  'Referenced list not found': 'A lista escolhida não foi encontrada.',
  'List already added to this list': 'Essa lista já foi adicionada aqui.',
  'A list cannot contain itself, directly or indirectly':
    'Não é possível adicionar essa lista: uma conteria a outra e o saldo nunca fecharia.',
};

function traduzirErro(status: number, detalhe: unknown): string {
  if (typeof detalhe === 'string' && MENSAGENS[detalhe]) {
    return MENSAGENS[detalhe];
  }
  if (status === 422) {
    return 'Dados inválidos. Revise os campos e tente novamente.';
  }
  if (status >= 500) {
    return 'Erro no servidor. Tente novamente em instantes.';
  }
  return 'Não foi possível concluir a ação.';
}

export function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Algo deu errado.';
}

/* ----------------------------- requisições ----------------------------- */

type Opcoes = {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  json?: unknown;
  formulario?: URLSearchParams;
  autenticado?: boolean;
};

async function requisitar<T>(
  caminho: string,
  { metodo = 'GET', json, formulario, autenticado = true }: Opcoes = {},
): Promise<T> {
  const cabecalhos: Record<string, string> = {};
  let corpo: BodyInit | undefined;

  if (json !== undefined) {
    cabecalhos['Content-Type'] = 'application/json';
    corpo = JSON.stringify(json);
  } else if (formulario) {
    corpo = formulario;
  }

  if (autenticado) {
    const token = armazenamentoToken.ler();
    if (token) cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo,
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Tente novamente.',
      0,
    );
  }

  if (!resposta.ok) {
    let detalhe: unknown;

    try {
      detalhe = ((await resposta.json()) as { detail?: unknown }).detail;
    } catch {
      detalhe = undefined;
    }

    if (resposta.status === 401 && autenticado) {
      armazenamentoToken.limpar();
      aoNaoAutorizado?.();
    }

    throw new ApiError(traduzirErro(resposta.status, detalhe), resposta.status);
  }

  return (await resposta.json()) as T;
}

type RespostaToken = { access_token: string };

export const api = {
  async entrar(email: string, senha: string): Promise<string> {
    // O formulário OAuth2 usa o campo `username`; aqui ele carrega o e-mail.
    const formulario = new URLSearchParams({
      username: email.trim(),
      password: senha,
    });

    const resposta = await requisitar<RespostaToken>('/auth/token', {
      metodo: 'POST',
      formulario,
      autenticado: false,
    });

    return resposta.access_token;
  },

  async cadastrar(nome: string, email: string, senha: string): Promise<string> {
    const resposta = await requisitar<RespostaToken>('/users/', {
      metodo: 'POST',
      json: { name: nome.trim(), email: email.trim(), password: senha },
      autenticado: false,
    });

    return resposta.access_token;
  },

  async usuarioAtual() {
    const resposta = await requisitar<{
      id: number;
      name: string;
      email: string;
    }>('/users/me');

    return { id: resposta.id, nome: resposta.name, email: resposta.email };
  },

  async listarListas() {
    const resposta = await requisitar<{ lists: ListaApi[] }>('/lists/');
    return resposta.lists.map(listaDaApi);
  },

  async criarLista(nome: string, objetivos: ObjetivosLista) {
    await requisitar('/lists/', {
      metodo: 'POST',
      json: { name: nome, ...objetivosParaApi(objetivos) },
    });
  },

  async excluirLista(listaId: number) {
    await requisitar(`/lists/${listaId}`, { metodo: 'DELETE' });
  },

  async definirObjetivos(listaId: number, objetivos: ObjetivosLista) {
    await requisitar(`/lists/${listaId}/objectives`, {
      metodo: 'PUT',
      json: objetivosParaApi(objetivos),
    });
  },

  async criarLancamento(listaId: number, dados: NovoLancamento) {
    await requisitar(`/lists/${listaId}/entries`, {
      metodo: 'POST',
      json: lancamentoParaApi(dados),
    });
  },

  async criarEntradaDeLista(
    listaId: number,
    outraListaId: number,
    data: string,
    observacao: string,
  ) {
    await requisitar(`/lists/${listaId}/entries`, {
      metodo: 'POST',
      json: entradaDeListaParaApi(outraListaId, data, observacao),
    });
  },

  async atualizarLancamento(entradaId: number, dados: NovoLancamento) {
    await requisitar(`/entries/${entradaId}`, {
      metodo: 'PUT',
      json: lancamentoParaAtualizacao(dados),
    });
  },

  async excluirEntrada(entradaId: number) {
    await requisitar(`/entries/${entradaId}`, { metodo: 'DELETE' });
  },
};
