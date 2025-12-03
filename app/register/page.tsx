"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/component/Logo";
import { RedButton } from "@/component/RedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você já pode fazer login",
        });
        router.push("/login");
      } else {
        // --- INÍCIO: Lógica Ajustada para Evitar o Toast Vermelho Vazio ---
        let errorMessage = data.message || "Erro ao criar conta";

        // Se o backend retornou a lista de erros de validação
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          // Formatamos os erros como uma string contínua, separada por vírgula.
          // Isso é mais seguro para a maioria dos componentes de notificação/toast.
          const errorList = data.errors.join(", ");
          
          // Usamos a mensagem principal do backend e adicionamos a lista de erros.
          // Ex: "A senha não atende aos requisitos de segurança. (Min 8, 1 maiúscula, 1 número)"
          errorMessage = `${data.message || 'Falha na validação'}: ${errorList}`;
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage, // Agora esta string deve ser segura para o toast
          variant: "destructive",
        });
        // --- FIM: Lógica Ajustada ---
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (Restante do seu componente 'return' permanece o mesmo)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <Logo />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Sua senha"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme sua senha"
            />
          </div>
          <RedButton type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </RedButton>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Já tem conta? Faça login
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
