
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMarketing } from "@/hooks/useMarketing";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface CreateMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMaterialModal({ isOpen, onClose }: CreateMaterialModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addMaterial } = useMarketing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) {
      toast({
        title: "Erro!",
        description: "Por favor, selecione um arquivo",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('marketing')
        .upload(fileName, arquivo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('marketing')
        .getPublicUrl(fileName);

      await addMaterial.mutateAsync({
        titulo,
        descricao,
        tipo,
        arquivo_url: publicUrl,
      });

      onClose();
      setTitulo("");
      setDescricao("");
      setTipo("");
      setArquivo(null);
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar o material",
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
          <DialogTitle>Adicionar Material de Marketing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Título do material"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Descrição do material"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Tipo de material"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={addMaterial.isPending || isUploading}
          >
            {addMaterial.isPending || isUploading ? "Adicionando..." : "Adicionar Material"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
