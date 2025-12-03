import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    // Array para coletar todos os erros de validação da senha
    const passwordErrors: string[] = [];
    
    // ⭐ INÍCIO: Validações de Senha
    
    // 1. Comprimento Mínimo
    if (password.length < 8) {
      passwordErrors.push("A senha deve ter no mínimo 8 caracteres.");
    }

    // 2. Letra Maiúscula
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("A senha deve conter pelo menos uma letra maiúscula.");
    }

    // 3. Letra Minúscula
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("A senha deve conter pelo menos uma letra minúscula.");
    }

    // 4. Número
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("A senha deve conter pelo menos um número.");
    }

    // 5. Caractere Especial
    if (!/[^A-Za-z0-9]/.test(password)) {
      passwordErrors.push("A senha deve conter pelo menos um caractere especial (ex: !, @, #, $).");
    }
    
    // ⭐ FIM: Validações de Senha

    // 🛑 NOVO: Retorna todos os erros de senha de uma vez
    if (passwordErrors.length > 0) {
        return NextResponse.json(
            { 
                message: "A senha não atende aos requisitos de segurança.", 
                errors: passwordErrors // Retorna a lista completa de erros
            }, 
            { status: 400 }
        );
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
