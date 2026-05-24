import React, { useEffect, useMemo, useState } from 'react';
import {
  atualizarIngresso,
  criarIngresso,
  listarIngressos,
  removerIngresso,
} from '../api/ingressos';
import { poltronasDisponiveis, listarSessoes } from '../api/sessoes';
import { IngressoDTO, SessaoDTO } from '../api/types';

export function IngresosPage() {
  const [ingressos, setIngressos]       = useState<IngressoDTO[]>([]);
  const [sessoes, setSessoes]           = useState<SessaoDTO[]>([]);
  const [poltronas, setPoltronas]       = useState<string[]>([]);
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [editing, setEditing]           = useState<IngressoDTO | null>(null);

  const [sessaoId, setSessaoId]         = useState<number>(0);
  const [usuarioId, setUsuarioId]       = useState<number | ''>('');
  const [poltrona, setPoltrona]         = useState('');

  const [erroSessao, setErroSessao]     = useState('');
  const [erroUsuario, setErroUsuario]   = useState('');
  const [erroPoltrona, setErroPoltrona] = useState('');

  const sortedIngressos = useMemo(
    () => [...ingressos].sort((a, b) =>
      new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime()
    ),
    [ingressos]
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [ing, ses] = await Promise.all([listarIngressos(), listarSessoes()]);
      setIngressos(ing);
      setSessoes(ses);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  useEffect(() => {
    if (!sessaoId) { setPoltronas([]); setPoltrona(''); return; }
    poltronasDisponiveis(sessaoId)
      .then((p) => { setPoltronas(p); setPoltrona(''); })
      .catch(() => setPoltronas([]));
  }, [sessaoId]);

  function resetForm() {
    setEditing(null);
    setSessaoId(0); setUsuarioId(''); setPoltrona(''); setPoltronas([]);
    setErroSessao(''); setErroUsuario(''); setErroPoltrona('');
  }

  function validar() {
    let valido = true;
    setErroSessao(''); setErroUsuario(''); setErroPoltrona('');

    if (!editing) {
      if (!sessaoId) { setErroSessao('Selecione uma sessão.'); valido = false; }
      if (!usuarioId || Number(usuarioId) <= 0) {
        setErroUsuario('Informe um ID de usuário válido.'); valido = false;
      }
    }
    if (!poltrona.trim()) { setErroPoltrona('Selecione uma poltrona.'); valido = false; }
    return valido;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setError(null);
    try {
      if (editing) {
        await atualizarIngresso(editing.id, poltrona);
      } else {
        await criarIngresso({ sessaoId, usuarioId: Number(usuarioId), poltrona });
      }
      resetForm();
      await refresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao salvar ingresso.');
    }
  }

  function formatarDataHora(iso: string) {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="page">
      <h2 className="page-title">🎟️ Ingressos</h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        {!editing ? (
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="sessao">Sessão</label>
              <select id="sessao" value={sessaoId} onChange={(e) => setSessaoId(Number(e.target.value))}>
                <option value={0}>Selecione uma sessão...</option>
                {sessoes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.filmeTitulo} — {formatarDataHora(s.dataHora)} — Sala {s.salaNumero}
                  </option>
                ))}
              </select>
              {erroSessao && <span className="field-error">{erroSessao}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="usuarioId">ID do Usuário</label>
              <input
                id="usuarioId"
                type="number"
                min="1"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 1"
              />
              {erroUsuario && <span className="field-error">{erroUsuario}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="poltrona">Poltrona</label>
              <select
                id="poltrona"
                value={poltrona}
                onChange={(e) => setPoltrona(e.target.value)}
                disabled={!sessaoId || poltronas.length === 0}
              >
                <option value="">
                  {!sessaoId
                    ? 'Selecione uma sessão primeiro...'
                    : poltronas.length === 0
                    ? 'Nenhuma poltrona disponível'
                    : 'Selecione uma poltrona...'}
                </option>
                {poltronas.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {erroPoltrona && <span className="field-error">{erroPoltrona}</span>}
            </div>
          </div>
        ) : (
          <div className="form-grid-2">
            <div className="form-group">
              <label>Sessão</label>
              <input
                value={`${editing.filmeTitulo} — ${formatarDataHora(editing.sessaoDataHora)}`}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="poltronaEdit">Nova Poltrona</label>
              <input
                id="poltronaEdit"
                value={poltrona}
                onChange={(e) => setPoltrona(e.target.value.toUpperCase())}
                placeholder="Ex: A1"
                maxLength={10}
              />
              {erroPoltrona && <span className="field-error">{erroPoltrona}</span>}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editing ? '✔ Atualizar Poltrona' : '＋ Registrar Ingresso'}
          </button>
          {editing && (
            <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>
          )}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedIngressos.map((i) => (
          <div key={i.id} className="list-item">
            <div className="list-item-info">
              <strong className="list-item-title">{i.filmeTitulo}</strong>
              <span className="list-item-sub">📅 {formatarDataHora(i.sessaoDataHora)}</span>
              <span className="list-item-sub">🏛️ Sala {i.salaNumero}</span>
              <span className="list-item-sub">💺 Poltrona <strong>{i.poltrona}</strong></span>
              <span className="list-item-sub">👤 {i.usuarioEmail}</span>
              <span className="list-item-sub muted">Comprado em {formatarDataHora(i.dataCompra)}</span>
            </div>
            <div className="form-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => { setEditing(i); setPoltrona(i.poltrona); }}
              >
                Editar
              </button>
              <button
                className="btn-danger"
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Cancelar ingresso de "${i.usuarioEmail}" para "${i.filmeTitulo}"?`)) return;
                  try { await removerIngresso(i.id); await refresh(); }
                  catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao remover.'); }
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
        {!loading && sortedIngressos.length === 0 && (
          <div className="empty-state">Nenhum ingresso registrado.</div>
        )}
      </div>
    </div>
  );
}