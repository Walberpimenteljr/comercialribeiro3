// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validação básica
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = não encontrado, então não é erro real
      return NextResponse.json(
        { message: "Erro ao checar usuário", details: fetchError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // Inserir usuário no banco
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { message: "Erro ao criar usuário", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno do servidor", details: (error as Error).message },
      { status: 500 }
    );
  }
}
