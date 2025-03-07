
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("zinhobeats@gmail.com");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Special case for admin login
      if (isAdminLogin) {
        // Check hardcoded admin credentials
        if (email === "admin@maisinkor.com" && password === "maisinkor2023") {
          // Set a special admin session in localStorage
          localStorage.setItem("adminSession", JSON.stringify({
            user: {
              id: "admin-user-id",
              email: "admin@maisinkor.com",
              user_metadata: { role: "admin" }
            },
            expires_at: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
          }));
          
          toast({
            title: "Login de administrador",
            description: "Login como administrador realizado com sucesso",
          });
          
          navigate("/");
          setIsLoading(false);
          return;
        } else {
          // Admin credentials are incorrect
          throw new Error("Credenciais de administrador inválidas");
        }
      }

      // Regular user login/signup through Supabase
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para confirmar o cadastro",
        });
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isAdminLogin ? "Login de Administrador" : (isLogin ? "Bem-vindo de volta" : "Criar conta")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdminLogin 
            ? "Entre com suas credenciais de administrador" 
            : (isLogin
              ? "Entre com suas credenciais"
              : "Preencha os dados para criar sua conta")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder={isAdminLogin ? "Email de administrador" : "Digite seu email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {isAdminLogin && <p className="text-xs text-muted-foreground">Email padrão: admin@maisinkor.com</p>}
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder={isAdminLogin ? "Senha de administrador" : "Digite sua senha"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isAdminLogin && <p className="text-xs text-muted-foreground">Senha padrão: maisinkor2023</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Carregando..."
            : (isAdminLogin 
              ? "Entrar como Admin" 
              : (isLogin
                ? "Entrar"
                : "Criar conta"))}
        </Button>
      </form>

      <div className="flex justify-between text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setIsAdminLogin(false);
          }}
          className="text-sm text-mais-600 hover:underline"
        >
          {isLogin
            ? "Não tem uma conta? Criar conta"
            : "Já tem uma conta? Entrar"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdminLogin(!isAdminLogin);
            setIsLogin(true);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          {isAdminLogin
            ? "Voltar para Login normal"
            : "Login de Administrador"}
        </button>
      </div>
    </div>
  );
}
