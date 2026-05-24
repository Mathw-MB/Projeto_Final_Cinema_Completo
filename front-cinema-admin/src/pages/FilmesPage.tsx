import React, { useEffect, useMemo, useState } from 'react';
import { atualizarFilme, criarFilme, listarFilmes, removerFilme } from '../api/filmes';
import { FilmeDTO } from '../api/types';

const CLASSIFICACOES = ['Livre', '10', '12', '14', '16', '18'];
const GENEROS = ['Ação', 'Aventura', 'Animação', 'Comédia', 'Drama', 'Fantasia', 'Ficção Científica', 'Horror', 'Romance', 'Suspense', 'Thriller'];

export function FilmesPage() {
  const [filmes, setFilmes]   = useState<FilmeDTO[]>([]);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FilmeDTO | null>(null);

  const [titulo, setTitulo]               = useState('');
  const [genero, setGenero]               = useState('');
  const [duracao, setDuracao]             = useState<number>(0);
  const [classificacao, setClassificacao] = useState('');
  const [sinopse, setSinopse]             = useState('');

  const [erroTitulo, setErroTitulo]               = useState('');
  const [erroGenero, setErroGenero]               = useState('');
  const [erroDuracao, setErroDuracao]             = useState('');
  const [erroClassificacao, setErroClassificacao] = useState('');

  const sortedFilmes = useMemo(
    () => [...filmes].sort((a, b) => a.titulo.localeCompare(b.titulo)),
    [filmes]
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      setFilmes(await listarFilmes());
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao carregar filmes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  function resetForm() {
    setEditing(null);
    setTitulo(''); setGenero(''); setDuracao(0); setClassificacao(''); setSinopse('');
    setErroTitulo(''); setErroGenero(''); setErroDuracao(''); setErroClassificacao('');
  }

  function validar() {
    let valido = true;
    setErroTitulo(''); setErroGenero(''); setErroDuracao(''); setErroClassificacao('');

    if (!titulo.trim()) { setErroTitulo('O título é obrigatório.'); valido = false; }
    else if (titulo.length > 150) { setErroTitulo('Máximo 150 caracteres.'); valido = false; }
    if (!genero.trim()) { setErroGenero('O gênero é obrigatório.'); valido = false; }
    if (!duracao || duracao < 1) { setErroDuracao('Duração deve ser maior que zero.'); valido = false; }
    else if (duracao > 600) { setErroDuracao('Duração máxima: 600 minutos.'); valido = false; }
    if (!classificacao) { setErroClassificacao('Selecione a classificação.'); valido = false; }
    return valido;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setError(null);
    const payload = { titulo, genero, duracaoMinutos: Number(duracao), classificacao, sinopse: sinopse.trim() || undefined };
    try {
      if (editing) { await atualizarFilme(editing.id, payload); }
      else { await criarFilme(payload); }
      resetForm();
      await refresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao salvar filme.');
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">🎬 Filmes</h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Oppenheimer" maxLength={150} />
            {erroTitulo && <span className="field-error">{erroTitulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="genero">Gênero</label>
            <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecione...</option>
              {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {erroGenero && <span className="field-error">{erroGenero}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="duracao">Duração (minutos)</label>
            <input id="duracao" type="number" min="1" max="600" value={duracao || ''} onChange={(e) => setDuracao(Number(e.target.value))} />
            {erroDuracao && <span className="field-error">{erroDuracao}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="classificacao">Classificação</label>
            <select id="classificacao" value={classificacao} onChange={(e) => setClassificacao(e.target.value)}>
              <option value="">Selecione...</option>
              {CLASSIFICACOES.map((c) => <option key={c} value={c}>{c === 'Livre' ? 'Livre' : `${c} anos`}</option>)}
            </select>
            {erroClassificacao && <span className="field-error">{erroClassificacao}</span>}
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="sinopse">Sinopse <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(opcional)</span></label>
            <textarea id="sinopse" value={sinopse} onChange={(e) => setSinopse(e.target.value)} placeholder="Breve descrição do filme..." maxLength={500} />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">{editing ? '✔ Atualizar Filme' : '＋ Cadastrar Filme'}</button>
          {editing && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedFilmes.map((f) => (
          <div key={f.id} className="list-item">
            <div className="list-item-info">
              <strong className="list-item-title">{f.titulo}</strong>
              <span className="list-item-sub">{f.genero} · {f.duracaoMinutos} min · <span className="badge badge-yellow">{f.classificacao}</span></span>
              {f.sinopse && <span className="list-item-sub" style={{ maxWidth: 480 }}>{f.sinopse}</span>}
            </div>
            <div className="form-actions">
              <button className="btn-outline" type="button" onClick={() => { setEditing(f); setTitulo(f.titulo); setGenero(f.genero); setDuracao(f.duracaoMinutos); setClassificacao(f.classificacao); setSinopse(f.sinopse ?? ''); }}>Editar</button>
              <button className="btn-danger" type="button" onClick={async () => {
                if (!window.confirm(`Remover o filme "${f.titulo}"?`)) return;
                try { await removerFilme(f.id); await refresh(); }
                catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Falha ao remover.'); }
              }}>Remover</button>
            </div>
          </div>
        ))}
        {!loading && sortedFilmes.length === 0 && <div className="empty-state">Nenhum filme cadastrado.</div>}
      </div>
    </div>
  );
}