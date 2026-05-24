import React, { useEffect, useMemo, useState } from 'react';
import { listarFilmes } from '../api/filmes';
import { listarSalas } from '../api/salas';
import {
  atualizarSessao,
  criarSessao,
  listarSessoes,
  removerSessao,
} from '../api/sessoes';
import { FilmeDTO, SalaDTO, SessaoDTO } from '../api/types';

export function SessoesPage() {
  const [sessoes, setSessoes]   = useState<SessaoDTO[]>([]);
  const [filmes, setFilmes]     = useState<FilmeDTO[]>([]);
  const [salas, setSalas]       = useState<SalaDTO[]>([]);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [editing, setEditing]   = useState<SessaoDTO | null>(null);

  const [filmeId, setFilmeId]   = useState<number>(0);
  const [salaId, setSalaId]     = useState<number>(0);
  const [dataHora, setDataHora] = useState('');
  const [preco, setPreco]       = useState<number>(0);

  const [erroFilme, setErroFilme]   = useState('');
  const [erroSala, setErroSala]     = useState('');
  const [erroData, setErroData]     = useState('');
  const [erroPreco, setErroPreco]   = useState('');

  const sortedSessoes = useMemo(
    () => [...sessoes].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()),
    [sessoes]
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [s, f, sa] = await Promise.all([listarSessoes(), listarFilmes(), listarSalas()]);
      setSessoes(s);
      setFilmes(f);
      setSalas(sa);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  function resetForm() {
    setEditing(null);
    setFilmeId(0); setSalaId(0); setDataHora(''); setPreco(0);
    setErroFilme(''); setErroSala(''); setErroData(''); setErroPreco('');
  }

  function validar() {
    let valido = true;
    setErroFilme(''); setErroSala(''); setErroData(''); setErroPreco('');

    if (!filmeId) { setErroFilme('Selecione um filme.'); valido = false; }
    if (!salaId)  { setErroSala('Selecione uma sala.');  valido = false; }
    if (!dataHora) {
      setErroData('Informe a data e hora.'); valido = false;
    } else if (new Date(dataHora) < new Date()) {
      setErroData('A data da sessão não pode ser no passado.'); valido = false;
    }
    if (preco <= 0) { setErroPreco('O preço deve ser maior que zero.'); valido = false; }
    return valido;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setError(null);
    try {
      const payload = { filmeId, salaId, dataHora, preco: Number(preco) };
      if (editing) {
        await atualizarSessao(editing.id, payload);
      } else {
        await criarSessao(payload);
      }
      resetForm();
      await refresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao salvar sessão.');
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
      <h2 className="page-title">🎬 Sessões</h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="filme">Filme</label>
            <select id="filme" value={filmeId} onChange={(e) => setFilmeId(Number(e.target.value))}>
              <option value={0}>Selecione um filme...</option>
              {filmes.map((f) => <option key={f.id} value={f.id}>{f.titulo}</option>)}
            </select>
            {erroFilme && <span className="field-error">{erroFilme}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sala">Sala</label>
            <select id="sala" value={salaId} onChange={(e) => setSalaId(Number(e.target.value))}>
              <option value={0}>Selecione uma sala...</option>
              {salas.map((s) => <option key={s.id} value={s.id}>Sala {s.numero} — {s.tipo}</option>)}
            </select>
            {erroSala && <span className="field-error">{erroSala}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dataHora">Data e Hora</label>
            <input
              id="dataHora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
            />
            {erroData && <span className="field-error">{erroData}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0.01"
              value={preco || ''}
              onChange={(e) => setPreco(Number(e.target.value))}
            />
            {erroPreco && <span className="field-error">{erroPreco}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editing ? '✔ Atualizar Sessão' : '＋ Criar Sessão'}
          </button>
          {editing && (
            <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>
          )}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedSessoes.map((s) => (
          <div key={s.id} className="list-item">
            <div className="list-item-info">
              <strong className="list-item-title">{s.filmeTitulo}</strong>
              <span className="list-item-sub">📅 {formatarDataHora(s.dataHora)}</span>
              <span className="list-item-sub">🏛️ Sala {s.salaNumero} — {s.salaTipo}</span>
              <span className="list-item-sub">💰 R$ {Number(s.preco).toFixed(2)}</span>
            </div>
            <div className="form-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setEditing(s);
                  setFilmeId(s.filmeId);
                  setSalaId(s.salaId);
                  setDataHora(s.dataHora.slice(0, 16));
                  setPreco(s.preco);
                }}
              >
                Editar
              </button>
              <button
                className="btn-danger"
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Remover sessão de "${s.filmeTitulo}"?`)) return;
                  try { await removerSessao(s.id); await refresh(); }
                  catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao remover.'); }
                }}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        {!loading && sortedSessoes.length === 0 && (
          <div className="empty-state">Nenhuma sessão cadastrada.</div>
        )}
      </div>
    </div>
  );
}