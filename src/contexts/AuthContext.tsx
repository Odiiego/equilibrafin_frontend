import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  api,
  armazenamentoToken,
  definirAoNaoAutorizado,
} from '../services/api';

type Usuario = { id: number; nome: string; email: string };

type AuthContextValue = {
  autenticado: boolean;
  usuario: Usuario | null;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    armazenamentoToken.ler(),
  );

  // Se a API responder 401 (sessão expirada), volta para o login.
  useEffect(() => {
    definirAoNaoAutorizado(() => setToken(null));
    return () => definirAoNaoAutorizado(null);
  }, []);

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Busca os dados da conta sempre que há (ou muda) a sessão.
  useEffect(() => {
    if (!token) return;

    let ativo = true;

    api
      .usuarioAtual()
      .then((dados) => {
        if (ativo) setUsuario(dados);
      })
      .catch(() => {
        // Sem os dados, o menu mostra só o ícone; o 401 já é tratado em api.ts.
      });

    return () => {
      ativo = false;
    };
  }, [token]);

  const iniciarSessao = (novoToken: string) => {
    armazenamentoToken.salvar(novoToken);
    setToken(novoToken);
  };

  const entrar = async (email: string, senha: string) => {
    iniciarSessao(await api.entrar(email, senha));
  };

  const cadastrar = async (nome: string, email: string, senha: string) => {
    iniciarSessao(await api.cadastrar(nome, email, senha));
  };

  const sair = () => {
    armazenamentoToken.limpar();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        autenticado: token !== null,
        usuario: token !== null ? usuario : null,
        entrar,
        cadastrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  }

  return contexto;
}
