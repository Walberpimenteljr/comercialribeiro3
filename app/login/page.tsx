"use client"
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/Logo"
import { RedButton } from "@/components/RedButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        })
        router.push("/produto")
      } else {
        toast({
          title: "Erro no login",
          description: data.message || "Credenciais inválidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <head>
      <link rel="icon" href="logo.png" />
    </head>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <Logo />

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <RedButton type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </RedButton>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/register")} className="text-red-600 hover:text-red-700 text-sm">
            Não tem conta? Cadastre-se
          </button>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-700 text-sm">
            ← Voltar
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
