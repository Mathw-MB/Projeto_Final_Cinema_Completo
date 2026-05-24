import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getEmail, isAuthenticated, logout } from '../api/auth';

export function Layout() {
  const navigate = useNavigate();
  const auth  = isAuthenticated();
  const email = getEmail();

  return (
    <>
      <header className="app-header">
        <Link to="/" className="app-brand">
          CINE<span>ADMIN</span>
        </Link>

        <nav className="app-nav">
          <NavLink to="/" end>Home</NavLink>
          {!auth && <NavLink to="/login">Login</NavLink>}
          {!auth && <NavLink to="/register">Cadastro</NavLink>}
          {auth  && <NavLink to="/filmes">Filmes</NavLink>}
          {auth  && <NavLink to="/salas">Salas</NavLink>}
          {auth  && <NavLink to="/sessoes">Sessões</NavLink>}
          {auth  && <NavLink to="/ingressos">Ingressos</NavLink>}
        </nav>

        <div className="app-user">
          {auth && <span className="app-user-email">{email}</span>}
          {auth && (
            <button
              className="btn-danger"
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
            >
              Sair
            </button>
          )}
        </div>
      </header>

      <div className="app-container">
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
