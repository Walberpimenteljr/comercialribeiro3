"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { RedButton } from "@/component/RedButton"

interface ProdutoCarrinho {
  produto: {
    id: number
    nome: string
    preco: number
    imagem: string
  }
  quantidade: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [carrinho, setCarrinho] = useState<ProdutoCarrinho[]>([])
  const [total, setTotal] = useState(0)
  const [formaPagamento, setFormaPagamento] = useState("pix")

  useEffect(() => {
    const carrinhoQuery = searchParams.get("carrinho")
    if (carrinhoQuery) {
      const itens: ProdutoCarrinho[] = JSON.parse(decodeURIComponent(carrinhoQuery))
      setCarrinho(itens)
      const totalCalculado = itens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)
      setTotal(totalCalculado)
    }
  }, [searchParams])

  const mudarQuantidade = (id: number, quantidade: number) => {
    if (quantidade < 1) return
    const novosItens = carrinho.map(item =>
      item.produto.id === id ? { ...item, quantidade } : item
    )
    setCarrinho(novosItens)
    const totalCalculado = novosItens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)
    setTotal(totalCalculado)
  }

  const removerItem = (id: number) => {
    const novosItens = carrinho.filter(item => item.produto.id !== id)
    setCarrinho(novosItens)
    const totalCalculado = novosItens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)
    setTotal(totalCalculado)
  }

  const confirmarCompra = () => {
    alert(`Compra finalizada!\nTotal: R$ ${total.toFixed(2)}\nPagamento: ${formaPagamento.toUpperCase()}`)
    router.push("/produto") // volta para produtos após finalizar
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Botão Voltar para Loja no topo */}
      <div className="max-w-4xl mx-auto mb-6">
        <RedButton onClick={() => router.push("/produto")} className="px-4 py-2">
          ← Voltar para Loja
        </RedButton>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {carrinho.length === 0 ? (
        <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Itens no Carrinho</h2>
          <div className="space-y-4">
            {carrinho.map(item => (
              <div key={item.produto.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-4">
                  <img src={item.produto.imagem} alt={item.produto.nome} className="w-16 h-16 object-cover rounded" />
                  <span className="font-medium">{item.produto.nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={item.quantidade}
                    onChange={e => mudarQuantidade(item.produto.id, parseInt(e.target.value))}
                  />
                  <span className="w-20 text-right font-semibold">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => removerItem(item.produto.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right font-bold text-lg">
            Total: R$ {total.toFixed(2)}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Forma de Pagamento:</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pagamento"
                  value="pix"
                  checked={formaPagamento === "pix"}
                  onChange={e => setFormaPagamento(e.target.value)}
                />
                <span>PIX</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pagamento"
                  value="cartao"
                  checked={formaPagamento === "cartao"}
                  onChange={e => setFormaPagamento(e.target.value)}
                />
                <span>Cartão</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pagamento"
                  value="dinheiro"
                  checked={formaPagamento === "dinheiro"}
                  onChange={e => setFormaPagamento(e.target.value)}
                />
                <span>Dinheiro</span>
              </label>
            </div>
          </div>

          {/* Botão Confirmar Compra no final */}
          <div className="mt-6 text-center">
            <RedButton onClick={confirmarCompra} className="px-6 py-3 text-lg">
              Confirmar Compra
            </RedButton>
          </div>
        </div>
      )}
    </div>
  )
}
