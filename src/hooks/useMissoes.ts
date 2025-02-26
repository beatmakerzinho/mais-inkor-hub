
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Missao } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useMissoes() {
  const queryClient = useQueryClient();

  const { data: missoes, isLoading } = useQuery({
    queryKey: ['missoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missoes')
        .select('*')
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Missao[];
    },
  });

  const addMissao = useMutation({
    mutationFn: async (novaMissao: Omit<Missao, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('missoes')
        .insert([novaMissao])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missoes'] });
      toast({
        title: "Sucesso!",
        description: "Missão criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro!",
        description: "Não foi possível criar a missão",
        variant: "destructive",
      });
      console.error('Erro ao criar missão:', error);
    },
  });

  return {
    missoes,
    isLoading,
    addMissao,
  };
}
