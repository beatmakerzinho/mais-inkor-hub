
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

export interface Questionario {
  id: string;
  titulo: string;
  descricao?: string;
  pontos: number;
  perguntas: Pergunta[];
  status: 'ativo' | 'inativo' | 'arquivado';
  respostas?: number;
  created_at: string;
  updated_at?: string;
}

export interface Pergunta {
  id: string;
  questionario_id: string;
  texto: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'texto';
  opcoes?: string[];
  resposta_correta?: string | string[];
  pontos: number;
  created_at: string;
}

export interface RespostaUsuario {
  id: string;
  user_id: string;
  questionario_id: string;
  pontuacao: number;
  respostas: {
    pergunta_id: string;
    resposta: string | string[];
    correto?: boolean;
  }[];
  concluido: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Notificacao {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'erro' | 'alerta';
  lida: boolean;
  link?: string;
  created_at: string;
}
