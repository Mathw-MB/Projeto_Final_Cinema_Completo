
export type LoginResponse = {
  token: string;
  email: string;
};


export type FilmeDTO = {
  id: number;
  titulo: string;
  genero: string;
  duracaoMinutos: number;
  classificacao: string;
  sinopse?: string;
};


export type SalaDTO = {
  id: number;
  numero: string;
  capacidade: number;
  tipo: string;
};


export type SessaoDTO = {
  id: number;
  dataHora: string;
  preco: number;
  filmeId: number;
  filmeTitulo: string;
  salaId: number;
  salaNumero: string;
  salaTipo: string;
};


export type IngressoDTO = {
  id: number;
  poltrona: string;
  dataCompra: string;
  sessaoId: number;
  sessaoDataHora: string;
  sessaoPreco: number;
  filmeTitulo: string;
  salaNumero: string;
  usuarioId: number;
  usuarioEmail: string;
};