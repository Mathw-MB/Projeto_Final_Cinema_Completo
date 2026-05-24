import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../api/usuarios';

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail]                   = useState('');
  const [senha, setSenha]                   = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError]                   = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);

  
  const [erroEmail, setErroEmail]                   = useState('');
  const [erroSenha, setErroSenha]                   = useState('');
  const [erroConfirmar, setErroConfirmar]           = useState('');

  function validar() {
    let valido = true;
    setErroEmail(''); setErroSenha(''); setErroConfirmar('');

    if (!email.trim()) {
      setErroEmail('Informe o e-mail.'); valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErroEmail('Formato de e-mail inválido.'); valido = false;
    }
    if (!senha) {
      setErroSenha('Informe a senha.'); valido = false;
    } else if (senha.length < 6) {
      setErroSenha('A senha deve ter no mínimo 6 caracteres.'); valido = false;
    }
    if (!confirmarSenha) {
      setErroConfirmar('Confirme a senha.'); valido = false;
    } else if (senha !== confirmarSenha) {
      setErroConfirmar('As senhas não coincidem.'); valido = false;
    }
    return valido;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setError(null);
    setLoading(true);
    try {
      await cadastrarUsuario({ email, senha });
      navigate('/login');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        err?.message ??
        'Falha ao cadastrar usuário.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 460, margin: '0 auto' }}>
      <h2 className="page-title">Cadastro</h2>

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
            autoComplete="new-password"
          />
          {erroSenha && <span className="field-error">{erroSenha}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            autoComplete="new-password"
          />
          {erroConfirmar && <span className="field-error">{erroConfirmar}</span>}
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--yellow)', textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
