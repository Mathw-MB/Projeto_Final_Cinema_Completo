import { http } from './http';

export async function cadastrarUsuario(payload: {
  email: string;
  senha: string;
}) {
  await http.post('/api/Auth/register', payload);
}
