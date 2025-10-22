import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Nome, email e senha são obrigatórios" }, { status: 400 });
    }

    // Inserir usuário no Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      user: { id: data.id, name: data.name, email: data.email }
    });
  } catch (err) {
    return NextResponse.json({ message: "Erro interno do servidor", details: (err as Error).message }, { status: 500 });
  }
}
