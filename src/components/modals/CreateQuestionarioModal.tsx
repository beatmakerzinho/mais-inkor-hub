
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";
import { useQuestionarios } from "@/hooks/useQuestionarios";
import { Pergunta } from "@/types/database";

interface CreateQuestionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuestionarioModal({ isOpen, onClose }: CreateQuestionarioModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<"ativo" | "inativo">("ativo");
  const [perguntas, setPerguntas] = useState<Array<Omit<Pergunta, 'id' | 'questionario_id' | 'created_at'>>>([
    {
      texto: "",
      tipo: "multipla_escolha",
      opcoes: ["", "", "", ""],
      resposta_correta: "",
      pontos: 10
    }
  ]);

  const { addQuestionario } = useQuestionarios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total points
    const totalPontos = perguntas.reduce((sum, pergunta) => sum + pergunta.pontos, 0);
    
    await addQuestionario.mutateAsync({
      titulo,
      descricao,
      pontos: totalPontos,
      perguntas,
      status,
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitulo("");
    setDescricao("");
    setStatus("ativo");
    setPerguntas([
      {
        texto: "",
        tipo: "multipla_escolha",
        opcoes: ["", "", "", ""],
        resposta_correta: "",
        pontos: 10
      }
    ]);
  };

  const addPergunta = () => {
    setPerguntas([
      ...perguntas,
      {
        texto: "",
        tipo: "multipla_escolha",
        opcoes: ["", "", "", ""],
        resposta_correta: "",
        pontos: 10
      }
    ]);
  };

  const removePergunta = (index: number) => {
    if (perguntas.length <= 1) return;
    setPerguntas(perguntas.filter((_, i) => i !== index));
  };

  const updatePergunta = (index: number, field: keyof Omit<Pergunta, 'id' | 'questionario_id' | 'created_at'>, value: any) => {
    const updatedPerguntas = [...perguntas];
    updatedPerguntas[index] = { ...updatedPerguntas[index], [field]: value };
    setPerguntas(updatedPerguntas);
  };

  const updateOpcao = (perguntaIndex: number, opcaoIndex: number, value: string) => {
    const updatedPerguntas = [...perguntas];
    const opcoes = [...(updatedPerguntas[perguntaIndex].opcoes || [])];
    opcoes[opcaoIndex] = value;
    updatedPerguntas[perguntaIndex].opcoes = opcoes;
    setPerguntas(updatedPerguntas);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Questionário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Título do questionário"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Descrição do questionário"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as "ativo" | "inativo")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  value={perguntas.reduce((sum, pergunta) => sum + pergunta.pontos, 0).toString()}
                  readOnly
                  placeholder="Total de pontos"
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Perguntas</h3>
              <Button type="button" onClick={addPergunta} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </div>

            {perguntas.map((pergunta, index) => (
              <Card key={index}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-base">Pergunta {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePergunta(index)}
                    disabled={perguntas.length <= 1}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Texto da pergunta"
                    value={pergunta.texto}
                    onChange={(e) => updatePergunta(index, 'texto', e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        value={pergunta.tipo}
                        onValueChange={(value) => updatePergunta(index, 'tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de pergunta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                          <SelectItem value="verdadeiro_falso">Verdadeiro/Falso</SelectItem>
                          <SelectItem value="texto">Texto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Pontos"
                        value={pergunta.pontos}
                        onChange={(e) => updatePergunta(index, 'pontos', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>

                  {pergunta.tipo === 'multipla_escolha' && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Opções:</p>
                      {(pergunta.opcoes || []).map((opcao, opcaoIndex) => (
                        <div key={opcaoIndex} className="flex gap-2">
                          <Input
                            placeholder={`Opção ${opcaoIndex + 1}`}
                            value={opcao}
                            onChange={(e) => updateOpcao(index, opcaoIndex, e.target.value)}
                          />
                          <Select
                            value={
                              pergunta.resposta_correta === opcao 
                                ? opcao 
                                : ""
                            }
                            onValueChange={(value) => {
                              if (value === opcao) {
                                updatePergunta(index, 'resposta_correta', opcao);
                              }
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Correta?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Não</SelectItem>
                              <SelectItem value={opcao}>Sim</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}

                  {pergunta.tipo === 'verdadeiro_falso' && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Resposta Correta:</p>
                      <Select
                        value={pergunta.resposta_correta as string}
                        onValueChange={(value) => updatePergunta(index, 'resposta_correta', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a resposta correta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verdadeiro">Verdadeiro</SelectItem>
                          <SelectItem value="falso">Falso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addQuestionario.isPending}>
              {addQuestionario.isPending ? "Criando..." : "Criar Questionário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
