import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário
    const { data, error } = await supabase
      .from("users")
      .insert({ name, email, password: hashedPassword })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      user: { id: data.id, name: data.name, email: data.email },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Erro interno do servidor", details: (err as Error).message },
      { status: 500 }
    );
  }
}
