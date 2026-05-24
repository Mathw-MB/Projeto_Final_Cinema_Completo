import { http } from './http';
import { SessaoDTO } from './types';

export async function listarSessoes() {
  const { data } = await http.get<SessaoDTO[]>('/api/Sessoes');
  return data;
}

export async function buscarSessao(id: number) {
  const { data } = await http.get<SessaoDTO>(`/api/Sessoes/${id}`);
  return data;
}

export async function poltronasDisponiveis(sessaoId: number) {
  const { data } = await http.get<string[]>(`/api/Sessoes/${sessaoId}/poltronas-disponiveis`);
  return data;
}

export async function criarSessao(payload: {
  dataHora: string;
  preco: number;
  filmeId: number;
  salaId: number;
}) {
  const { data } = await http.post<{ id: number }>('/api/Sessoes', payload);
  return data;
}

export async function atualizarSessao(id: number, payload: {
  dataHora: string;
  preco: number;
  filmeId: number;
  salaId: number;
}) {
  await http.put(`/api/Sessoes/${id}`, payload);
}

export async function removerSessao(id: number) {
  await http.delete(`/api/Sessoes/${id}`);
}