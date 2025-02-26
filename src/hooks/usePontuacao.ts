
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Pontuacao } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function usePontuacao(userId: string) {
  const queryClient = useQueryClient();

  const { data: pontuacao, isLoading } = useQuery({
    queryKey: ['pontuacao', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pontuacoes')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Se não encontrar pontuação, cria uma nova
          const { data: newScore, error: createError } = await supabase
            .from('pontuacoes')
            .insert([{ user_id: userId, pontos: 0 }])
            .select()
            .single();

          if (createError) throw createError;
          return newScore;
        }
        throw error;
      }
      return data as Pontuacao;
    },
  });

  const updatePontuacao = useMutation({
    mutationFn: async (novosPontos: number) => {
      const { data, error } = await supabase
        .from('pontuacoes')
        .update({ pontos: novosPontos, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontuacao', userId] });
      toast({
        title: "Sucesso!",
        description: "Pontuação atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar a pontuação",
        variant: "destructive",
      });
      console.error('Erro ao atualizar pontuação:', error);
    },
  });

  return {
    pontuacao,
    isLoading,
    updatePontuacao,
  };
}
