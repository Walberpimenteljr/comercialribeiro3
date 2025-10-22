import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 });
    }

    // Buscar usuário
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });
    }

    // Comparar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Erro interno do servidor", details: (err as Error).message },
      { status: 500 }
    );
  }
}
