
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Produto } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useProdutos() {
  const queryClient = useQueryClient();

  const { data: produtos, isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Produto[];
    },
  });

  const addProduto = useMutation({
    mutationFn: async (novoProduto: Omit<Produto, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('produtos')
        .insert([novoProduto])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Sucesso!",
        description: "Produto adicionado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar o produto",
        variant: "destructive",
      });
      console.error('Erro ao adicionar produto:', error);
    },
  });

  return {
    produtos,
    isLoading,
    addProduto,
  };
}
