
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, showActionResult } from '@/lib/supabase';
import { Questionario, Pergunta } from '@/types/database';

export function useQuestionarios() {
  const queryClient = useQueryClient();

  const { data: questionarios, isLoading } = useQuery({
    queryKey: ['questionarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questionarios')
        .select(`
          *,
          perguntas:perguntas(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Questionario[];
    },
  });

  const addQuestionario = useMutation({
    mutationFn: async (novoQuestionario: {
      titulo: string;
      descricao?: string;
      pontos: number;
      perguntas: Omit<Pergunta, 'id' | 'questionario_id' | 'created_at'>[];
      status: 'ativo' | 'inativo' | 'arquivado';
    }) => {
      // First, insert the questionario
      const { data: questionarioData, error: questionarioError } = await supabase
        .from('questionarios')
        .insert([{
          titulo: novoQuestionario.titulo,
          descricao: novoQuestionario.descricao,
          pontos: novoQuestionario.pontos,
          status: novoQuestionario.status,
        }])
        .select('id')
        .single();

      if (questionarioError) throw questionarioError;

      // Then, insert all the perguntas
      const perguntasToInsert = novoQuestionario.perguntas.map(pergunta => ({
        questionario_id: questionarioData.id,
        texto: pergunta.texto,
        tipo: pergunta.tipo,
        opcoes: pergunta.opcoes,
        resposta_correta: pergunta.resposta_correta,
        pontos: pergunta.pontos,
      }));

      const { data: perguntasData, error: perguntasError } = await supabase
        .from('perguntas')
        .insert(perguntasToInsert)
        .select();

      if (perguntasError) throw perguntasError;

      // Return the full data
      return { questionario: questionarioData, perguntas: perguntasData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionarios'] });
      showActionResult({ error: null }, "Questionário criado com sucesso");
    },
    onError: (error) => {
      showActionResult({ error }, "");
      console.error('Erro ao criar questionário:', error);
    },
  });

  return {
    questionarios,
    isLoading,
    addQuestionario,
  };
}
