import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { carrinho, total } = body

    // Detecta automaticamente se está rodando local ou em produção
    const isLocal = process.env.VERCEL_URL === undefined
    const baseUrl = isLocal
      ? "http://localhost:3000"
      : "https://comercialribeiro3.vercel.app"

    const preference = {
      items: carrinho.map((item: any) => ({
        title: item.produto.nome,
        quantity: item.quantidade,
        currency_id: "BRL",
        unit_price: item.produto.preco,
      })),
      back_urls: {
        success: `${baseUrl}/sucesso`,
        failure: `${baseUrl}/falha`,
      },
      ...(isLocal ? {} : { auto_return: "approved" }),
    }

    const resposta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer APP_USR-5626179010310457-102208-0e6d4a095912d9bbc1a46fa265f958e0-2939945484`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    })

    const data = await resposta.json()

    if (!resposta.ok) {
      console.error("Erro Mercado Pago:", data)
      return NextResponse.json({ erro: "Erro ao criar preferência de pagamento", detalhes: data }, { status: 500 })
    }

    return NextResponse.json({ init_point: data.init_point })
  } catch (error: any) {
    console.error("Erro interno:", error)
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}
