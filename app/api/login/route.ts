import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: { id: data.id, name: data.name, email: data.email }
    });
  } catch (err) {
    return NextResponse.json({ message: "Erro interno do servidor", details: (err as Error).message }, { status: 500 });
  }
}
