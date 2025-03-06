
import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword, showActionResult } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await resetPassword(email);
    
    const success = showActionResult(
      result, 
      "Email enviado! Verifique sua caixa de entrada e siga as instruções."
    );
    
    setIsSuccess(success);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
          <CardDescription>
            Informe seu email para receber instruções de recuperação
          </CardDescription>
        </CardHeader>
        
        {isSuccess ? (
          <CardContent className="space-y-4 pt-4">
            <div className="rounded-lg bg-green-50 p-4 text-green-800">
              <p>Email enviado com sucesso!</p>
              <p className="mt-2 text-sm">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Voltar para o login</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Voltar para o login</Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
