import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "A senha deve ter no mínimo 8 caracteres." },
        { status: 400 }
      );
    }

    // 2. Letra Maiúscula
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: "A senha deve conter pelo menos uma letra maiúscula." },
        { status: 400 }
      );
    }

    // 3. Letra Minúscula
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: "A senha deve conter pelo menos uma letra minúscula." },
        { status: 400 }
      );
    }

    // 4. Número
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { message: "A senha deve conter pelo menos um número." },
        { status: 400 }
      );
    }

    // 5. Caractere Especial (opcional, mas recomendado)
    if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { message: "A senha deve conter pelo menos um caractere especial (ex: !, @, #, $)." },
        { status: 400 }
      );
    }
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 });
    }

    // Hash da senha (ocorre somente se as validações passarem)
    const hashedPassword = await bcrypt.hash(password, 10);

    
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
