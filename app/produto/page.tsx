"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/component/Logo"
import { RedButton } from "@/component/RedButton"

interface Produto {
  id: number
  nome: string
  preco: number
  unidade: string
  estoque: number
  imagem: string
}

export default function ProdutoPage() {
  const router = useRouter()
  const [carrinho, setCarrinho] = useState<{ produto: Produto; quantidade: number }[]>([])
  const [mostrarMenu, setMostrarMenu] = useState(false) // menu do usuário

  const produtos: Produto[] = [
    { id: 1, nome: "Cimento Portland", preco: 25.9, unidade: "50kg", estoque: 100, imagem: "https://i.ibb.co/DDqphCSG/Sem-nome-350-x-350-px.png" },
    { id: 2, nome: "Tijolo Cerâmico", preco: 0.85, unidade: "unidade", estoque: 5000, imagem: "https://i.ibb.co/p69nTSXn/Sem-nome-350-x-350-px-1.png" },
    { id: 3, nome: "Areia Média", preco: 45.0, unidade: "1m³", estoque: 50, imagem: "https://i.ibb.co/fV3294ZT/Sem-nome-350-x-350-px-2.png" },
    { id: 4, nome: "Brita 1", preco: 55.0, unidade: "1m³", estoque: 60, imagem: "https://i.ibb.co/S41dxMp4/Sem-nome-350-x-350-px-3.png" },
    { id: 5, nome: "Ferro 10mm", preco: 28.5, unidade: "barra", estoque: 200, imagem: "https://padovani.vtexassets.com/arquivos/ids/160012/barra-de-ferro-ca50-ca60-gerdau.jpg?v=635666043946270000" },
    { id: 6, nome: "Telha Cerâmica", preco: 1.2, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/telha_ceramica_comum_unidade_193_1_20181011131917.png" },
  ]

  const adicionarCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.produto.id === produto.id)
      if (itemExistente) {
        if (itemExistente.quantidade + 1 > produto.estoque) return prev
        return prev.map(item =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  const removerItem = (id: number) => {
    setCarrinho(prev => prev.filter(item => item.produto.id !== id))
  }

  const mudarQuantidade = (id: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === id)
    if (!produto) return
    if (quantidade < 1 || quantidade > produto.estoque) return
    setCarrinho(prev =>
      prev.map(item => (item.produto.id === id ? { ...item, quantidade } : item))
    )
  }

  const finalizarCompra = () => {
    if (carrinho.length === 0) return
    const query = encodeURIComponent(JSON.stringify(carrinho))
    router.push(`/checkout?carrinho=${query}`)
  }

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Logo size="small" />
          {/* Menu do usuário */}
          <div className="relative">
            <button
              className="text-gray-700 font-medium px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => setMostrarMenu(!mostrarMenu)}
            >
              Menu ▼
            </button>
            {mostrarMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => router.push("/login")}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Materiais de Construção</h1>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtos.map(produto => (
            <div key={produto.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg flex flex-col items-center">
              <img src={produto.imagem} alt={produto.nome} className="w-32 h-32 object-cover mb-4 rounded" />
              <h2 className="text-lg font-semibold text-gray-800">{produto.nome}</h2>
              <p className="text-gray-500">{produto.unidade}</p>
              <p className="text-green-600 font-bold mt-2">R$ {produto.preco.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">Estoque: {produto.estoque}</p>
              <RedButton className="mt-3 px-4 py-2 w-full" onClick={() => adicionarCarrinho(produto)}>
                Adicionar
              </RedButton>
            </div>
          ))}
        </div>

        {/* Carrinho */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Carrinho de Compras</h2>

          {carrinho.length === 0 && <p className="text-center text-gray-500">Seu carrinho está vazio.</p>}

          {carrinho.length > 0 && (
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
                    <span className="w-24 text-right font-semibold">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => removerItem(item.produto.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-right mt-4 font-bold text-lg">
                Total: R$ {total.toFixed(2)}
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                <RedButton onClick={finalizarCompra} className="px-6 py-3 text-lg">
                  Finalizar Compra
                </RedButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
