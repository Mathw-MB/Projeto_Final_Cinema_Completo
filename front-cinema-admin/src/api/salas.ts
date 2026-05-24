import { http } from './http';
import { SalaDTO } from './types';

export async function listarSalas() {
  const { data } = await http.get<SalaDTO[]>('/api/Salas');
  return data;
}

export async function criarSala(payload: {
  numero: string;
  capacidade: number;
  tipo: string;
}) {
  const { data } = await http.post<{ id: number }>('/api/Salas', payload);
  return data;
}

export async function atualizarSala(id: number, payload: {
  numero: string;
  capacidade: number;
  tipo: string;
}) {
  await http.put(`/api/Salas/${id}`, payload);
}

export async function removerSala(id: number) {
  await http.delete(`/api/Salas/${id}`);
}
