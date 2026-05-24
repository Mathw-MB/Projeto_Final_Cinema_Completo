import { http } from './http';
import { IngressoDTO } from './types';

export async function listarIngressos() {
  const { data } = await http.get<IngressoDTO[]>('/api/Ingressos');
  return data;
}

export async function criarIngresso(payload: {
  poltrona: string;
  sessaoId: number;
  usuarioId: number;
}) {
  const { data } = await http.post<{ id: number }>('/api/Ingressos', payload);
  return data;
}

export async function atualizarIngresso(id: number, poltrona: string) {
  await http.put(`/api/Ingressos/${id}`, { poltrona });
}

export async function removerIngresso(id: number) {
  await http.delete(`/api/Ingressos/${id}`);
}