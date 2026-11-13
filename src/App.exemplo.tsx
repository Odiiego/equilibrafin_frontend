// Exemplo de como ligar tudo. Adapte ao seu App.tsx / main.tsx atuais.
//
// main.tsx:
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
//
// Não envolva mais as rotas com <ListasProvider>: ele agora é montado dentro
// de <RotaProtegida>, só para quem está autenticado.
import { Route, Routes } from 'react-router-dom';
import RotaProtegida from './components/RotaProtegida';
import Cadastro from './pages/Cadastro/Cadastro';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import ListaDetalhe from './pages/ListaDetalhe/ListaDetalhe';
import Login from './pages/Login/Login';
import Tutorial from './pages/Tutorial/Tutorial';
import Tutoriais from './pages/Tutoriais/Tutoriais';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Páginas institucionais (públicas) */}
      <Route path="/tutoriais" element={<Tutoriais />} />
      <Route path="/tutoriais/:slug" element={<Tutorial />} />

      <Route element={<RotaProtegida />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/listas/:id" element={<ListaDetalhe />} />
      </Route>
    </Routes>
  );
}
