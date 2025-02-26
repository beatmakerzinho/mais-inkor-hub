
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MarketingMaterial } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useMarketing() {
  const queryClient = useQueryClient();

  const { data: materiais, isLoading } = useQuery({
    queryKey: ['marketing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_materiais')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketingMaterial[];
    },
  });

  const addMaterial = useMutation({
    mutationFn: async (novoMaterial: Omit<MarketingMaterial, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('marketing_materiais')
        .insert([novoMaterial])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing'] });
      toast({
        title: "Sucesso!",
        description: "Material adicionado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar o material",
        variant: "destructive",
      });
      console.error('Erro ao adicionar material:', error);
    },
  });

  return {
    materiais,
    isLoading,
    addMaterial,
  };
}
