
export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  imagem_url?: string;
  created_at: string;
}

export interface Missao {
  id: string;
  titulo: string;
  descricao?: string;
  pontos: number;
  status: 'ativa' | 'inativa' | 'concluida';
  created_at: string;
}

export interface MarketingMaterial {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  arquivo_url: string;
  created_at: string;
}

export interface Pontuacao {
  id: string;
  user_id: string;
  pontos: number;
  created_at: string;
  updated_at: string;
}
