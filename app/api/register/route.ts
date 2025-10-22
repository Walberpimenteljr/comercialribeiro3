import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "data/users.json");

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Ler usuários existentes
    let users = [];
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf-8");
      users = JSON.parse(data);
    }

    // Verificar se email já existe
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json(
        { message: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // Criar novo usuário
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno do servidor", details: (error as Error).message },
      { status: 500 }
    );
  }
}
