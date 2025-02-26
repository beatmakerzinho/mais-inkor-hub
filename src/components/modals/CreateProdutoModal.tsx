
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProdutos } from "@/hooks/useProdutos";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface CreateProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProdutoModal({ isOpen, onClose }: CreateProdutoModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addProduto } = useProdutos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imagem_url = "";

      if (imagem) {
        const fileExt = imagem.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, imagem);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(fileName);

        imagem_url = publicUrl;
      }

      await addProduto.mutateAsync({
        nome,
        descricao,
        categoria,
        imagem_url,
      });

      onClose();
      setNome("");
      setDescricao("");
      setCategoria("");
      setImagem(null);
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar o produto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Descrição do produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={addProduto.isPending || isUploading}
          >
            {addProduto.isPending || isUploading ? "Criando..." : "Criar Produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
