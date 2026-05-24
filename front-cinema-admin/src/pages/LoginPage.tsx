import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [senha, setSenha]     = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  function validar() {
    let valido = true;
    setErroEmail('');
    setErroSenha('');

    if (!email.trim()) {
      setErroEmail('Informe o e-mail.'); valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErroEmail('Formato de e-mail inválido.'); valido = false;
    }
    if (!senha) {
      setErroSenha('Informe a senha.'); valido = false;
    }
    return valido;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, senha);
      navigate('/filmes');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        err?.message ??
        'Falha ao autenticar. Verifique e-mail/senha e se a API está rodando.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2 className="page-title">Entrar</h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@cinema.com"
            autoComplete="email"
          />
          {erroEmail && <span className="field-error">{erroEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />
          {erroSenha && <span className="field-error">{erroSenha}</span>}
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: 'var(--yellow)', textDecoration: 'none' }}>
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
