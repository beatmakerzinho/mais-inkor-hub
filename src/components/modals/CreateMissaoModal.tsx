
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMissoes } from "@/hooks/useMissoes";

interface CreateMissaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMissaoModal({ isOpen, onClose }: CreateMissaoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pontos, setPontos] = useState("");
  const { addMissao } = useMissoes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addMissao.mutateAsync({
      titulo,
      descricao,
      pontos: parseInt(pontos),
      status: "ativa",
    });

    onClose();
    setTitulo("");
    setDescricao("");
    setPontos("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Missão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Título da missão"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Descrição da missão"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Pontos"
              value={pontos}
              onChange={(e) => setPontos(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={addMissao.isPending}>
            {addMissao.isPending ? "Criando..." : "Criar Missão"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
