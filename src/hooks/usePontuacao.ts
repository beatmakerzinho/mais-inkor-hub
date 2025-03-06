
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, showActionResult } from '@/lib/supabase';
import { Pontuacao } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

export function usePontuacao() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: pontuacao, isLoading } = useQuery({
    queryKey: ['pontuacao', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('pontuacoes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

      // If no record exists, return a default with 0 points
      if (!data) {
        return {
          id: '',
          user_id: user.id,
          pontos: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      return data as Pontuacao;
    },
    enabled: !!user,
  });

  const addPontos = useMutation({
    mutationFn: async (pontos: number) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Check if user has a pontuacao record
      const { data: existingPontuacao, error: fetchError } = await supabase
        .from('pontuacoes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!existingPontuacao) {
        // Create a new record
        const { data, error } = await supabase
          .from('pontuacoes')
          .insert([{
            user_id: user.id,
            pontos: pontos
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Update existing record
        const novosPontos = existingPontuacao.pontos + pontos;
        const { data, error } = await supabase
          .from('pontuacoes')
          .update({
            pontos: novosPontos,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPontuacao.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontuacao'] });
      showActionResult({ error: null }, "Pontuação atualizada com sucesso");
    },
    onError: (error) => {
      showActionResult({ error }, "");
      console.error('Erro ao adicionar pontos:', error);
    }
  });

  const { data: ranking, isLoading: isRankingLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pontuacoes')
        .select('*, user:user_id(email)')
        .order('pontos', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  return {
    pontuacao,
    isLoading,
    addPontos,
    ranking,
    isRankingLoading,
    userRank: ranking?.findIndex(p => p.user_id === user?.id) ?? -1
  };
}
