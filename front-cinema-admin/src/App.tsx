import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FilmesPage }   from './pages/FilmesPage';
import { HomePage }     from './pages/HomePage';
import { IngressosPage } from './pages/IngressosPage';
import { LoginPage }    from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SalasPage }    from './pages/SalasPage';
import { SessoesPage }  from './pages/SessoesPage';
import { RequireAuth }  from './routes/RequireAuth';
import { Layout }       from './ui/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"         element={<HomePage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/filmes"   element={<RequireAuth><FilmesPage /></RequireAuth>} />
        <Route path="/salas"    element={<RequireAuth><SalasPage /></RequireAuth>} />
        <Route path="/sessoes"  element={<RequireAuth><SessoesPage /></RequireAuth>} />
        <Route path="/ingressos" element={<RequireAuth><IngressosPage /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;