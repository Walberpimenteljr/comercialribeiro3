import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs"; // <-- 1. IMPORTANDO A BIBLIOTECA DE HASH

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log("Dados recebidos no login:", { email, password });

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 2. BUSCAR O USUÁRIO APENAS PELO EMAIL
    // Não podemos buscar pela senha criptografada aqui.
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, name, email, password") // Certifique-se de selecionar a coluna 'password'
      .eq("email", email)
      .single();

    console.log("Resultado busca usuário login:", { user, fetchError });

    if (fetchError || !user) {
      // Retorna "Credenciais inválidas" para não dar dica sobre qual campo está errado.
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 3. COMPARAR A SENHA EM TEXTO PURO COM O HASH SALVO
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Senha fornecida não corresponde ao hash.");
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 4. LOGIN REALIZADO COM SUCESSO
    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("Erro interno no login:", err);
    return NextResponse.json(
      { message: "Erro interno do servidor", details: (err as Error).message },
      { status: 500 }
    );
  }
}
