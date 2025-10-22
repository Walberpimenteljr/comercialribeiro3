"use client"
import { useRouter } from "next/navigation"
import { Logo } from "@/component/Logo"
import { RedButton } from "@/component/RedButton"

export default function HomePage() {
  const router = useRouter()

  return (
    <>
    <head>
      <link rel="icon" href="logo.png" />
    </head>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <Logo />

        <div className="space-y-4">
          <RedButton onClick={() => router.push("/login")}>Login</RedButton>

          <RedButton onClick={() => router.push("/register")}>Cadastro</RedButton>
        </div>
      </div>
    </div>
    </>
  )
}
