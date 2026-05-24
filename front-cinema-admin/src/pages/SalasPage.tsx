import React, { useEffect, useMemo, useState } from 'react';
import { atualizarSala, criarSala, listarSalas, removerSala } from '../api/salas';
import { SalaDTO } from '../api/types';

const TIPOS = ['2D', '3D', 'IMAX', '4DX', 'VIP', 'Sala Comum'];

export function SalasPage() {
  const [salas, setSalas]     = useState<SalaDTO[]>([]);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<SalaDTO | null>(null);

  const [numero, setNumero]         = useState('');
  const [capacidade, setCapacidade] = useState<number>(0);
  const [tipo, setTipo]             = useState('');

  const [erroNumero, setErroNumero]         = useState('');
  const [erroCapacidade, setErroCapacidade] = useState('');
  const [erroTipo, setErroTipo]             = useState('');

  const sortedSalas = useMemo(
    () => [...salas].sort((a, b) => a.numero.localeCompare(b.numero)),
    [salas]
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      setSalas(await listarSalas());
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao carregar salas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  function resetForm() {
    setEditing(null);
    setNumero(''); setCapacidade(0); setTipo('');
    setErroNumero(''); setErroCapacidade(''); setErroTipo('');
  }

  function validar() {
    let valido = true;
    setErroNumero(''); setErroCapacidade(''); setErroTipo('');

    if (!numero.trim()) { setErroNumero('O número da sala é obrigatório.'); valido = false; }
    else if (numero.length > 10) { setErroNumero('Máximo 10 caracteres.'); valido = false; }
    if (!capacidade || capacidade < 1) { setErroCapacidade('Capacidade deve ser maior que zero.'); valido = false; }
    else if (capacidade > 1000) { setErroCapacidade('Capacidade máxima: 1000 lugares.'); valido = false; }
    if (!tipo) { setErroTipo('Selecione o tipo da sala.'); valido = false; }
    return valido;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setError(null);
    const payload = { numero, capacidade: Number(capacidade), tipo };
    try {
      if (editing) { await atualizarSala(editing.id, payload); }
      else { await criarSala(payload); }
      resetForm();
      await refresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao salvar sala.');
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">🏛️ Salas</h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="numero">Número / Nome da Sala</label>
            <input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex: 01, A, Premium" maxLength={10} />
            {erroNumero && <span className="field-error">{erroNumero}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Selecione...</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {erroTipo && <span className="field-error">{erroTipo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="capacidade">Capacidade (lugares)</label>
            <input id="capacidade" type="number" min="1" max="1000" value={capacidade || ''} onChange={(e) => setCapacidade(Number(e.target.value))} />
            {erroCapacidade && <span className="field-error">{erroCapacidade}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">{editing ? '✔ Atualizar Sala' : '＋ Cadastrar Sala'}</button>
          {editing && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedSalas.map((s) => (
          <div key={s.id} className="list-item">
            <div className="list-item-info">
              <strong className="list-item-title">Sala {s.numero}</strong>
              <span className="list-item-sub"><span className="badge badge-yellow">{s.tipo}</span> · {s.capacidade} lugares</span>
            </div>
            <div className="form-actions">
              <button className="btn-outline" type="button" onClick={() => { setEditing(s); setNumero(s.numero); setCapacidade(s.capacidade); setTipo(s.tipo); }}>Editar</button>
              <button className="btn-danger" type="button" onClick={async () => {
                if (!window.confirm(`Remover a sala ${s.numero}?`)) return;
                try { await removerSala(s.id); await refresh(); }
                catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao remover.'); }
              }}>Remover</button>
            </div>
          </div>
        ))}
        {!loading && sortedSalas.length === 0 && <div className="empty-state">Nenhuma sala cadastrada.</div>}
      </div>
    </div>
  );
}