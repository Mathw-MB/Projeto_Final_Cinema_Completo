import { http } from './http';
import { LoginResponse } from './types';

export async function login(email: string, senha: string) {
  const { data } = await http.post<LoginResponse>('/api/Auth/login', { email, senha });
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

export function getEmail() {
  return localStorage.getItem('email');
}
