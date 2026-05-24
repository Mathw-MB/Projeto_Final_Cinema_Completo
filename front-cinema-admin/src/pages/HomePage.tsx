import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

export function HomePage() {
  const auth = isAuthenticated();

  return (
    <div className="page">
      <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <h1 className="page-title" style={{ fontSize: 56, marginBottom: 12 }}>
          CINE<span style={{ color: 'var(--yellow)' }}>ADMIN</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 440, margin: '0 auto 32px' }}>
          Painel administrativo do sistema de cinema. Gerencie filmes, salas, sessões e ingressos em um só lugar.
        </p>
        {!auth ? (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/login" className="btn-primary">Entrar no sistema</Link>
            <Link to="/register" className="btn-secondary">Criar conta</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/filmes"    className="btn-outline">🎬 Filmes</Link>
            <Link to="/salas"     className="btn-outline">🏛️ Salas</Link>
            <Link to="/sessoes"   className="btn-outline">📅 Sessões</Link>
            <Link to="/ingressos" className="btn-outline">🎟️ Ingressos</Link>
          </div>
        )}
      </div>
    </div>
  );
}
