import { http } from './http';
import { FilmeDTO } from './types';

export async function listarFilmes() {
  const { data } = await http.get<FilmeDTO[]>('/api/Filmes');
  return data;
}

export async function criarFilme(payload: {
  titulo: string;
  genero: string;
  duracaoMinutos: number;
  classificacao: string;
  sinopse?: string;
}) {
  const { data } = await http.post<{ id: number }>('/api/Filmes', payload);
  return data;
}

export async function atualizarFilme(id: number, payload: {
  titulo: string;
  genero: string;
  duracaoMinutos: number;
  classificacao: string;
  sinopse?: string;
}) {
  await http.put(`/api/Filmes/${id}`, payload);
}

export async function removerFilme(id: number) {
  await http.delete(`/api/Filmes/${id}`);
}