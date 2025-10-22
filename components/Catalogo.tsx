"use client"
import { useState } from "react"

interface Item {
  id: number
  nome: string
  preco: number
  estoque: number
}

interface CatalogoProps {
  produtos: Item[]
}

export default function Catalogo({ produtos }: CatalogoProps) {
  const [carrinho, setCarrinho] = useState<Item[]>([])

  const adicionarCarrinho = (produto: Item) => {
    setCarrinho([...carrinho, produto])
  }

  const removerItem = (index: number) => {
    const novaLista = [...carrinho]
    novaLista.splice(index, 1)
    setCarrinho(novaLista)
  }

  const calcularTotal = () => {
    return carrinho.reduce((acc, item) => acc + item.preco, 0)
  }

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!")
      return
    }

    let mensagem = "Olá, gostaria de finalizar a compra dos seguintes itens:%0A"
    carrinho.forEach(item => {
      mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)})%0A`
    })
    mensagem += `%0ATotal: R$ ${calcularTotal().toFixed(2)}`

    const numeroWhatsApp = "5599999999999" // coloque o número da sua loja
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`
    window.open(url, "_blank")
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Produtos Disponíveis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produtos.map(produto => (
          <div key={produto.id} className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="font-semibold">{produto.nome}</h3>
            <p className="text-green-600 font-bold">R$ {produto.preco.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Estoque: {produto.estoque}</p>
            <button
              className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={() => adicionarCarrinho(produto)}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Carrinho */}
      <div className="mt-10 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">🛒 Carrinho</h2>
        <ul>
          {carrinho.map((item, index) => (
            <li key={index} className="flex justify-between items-center border-b py-1">
              {item.nome} - R$ {item.preco.toFixed(2)}
              <button
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                onClick={() => removerItem(index)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-bold text-right">Total: R$ {calcularTotal().toFixed(2)}</p>
        <button
          onClick={finalizarCompra}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Finalizar Compra no WhatsApp
        </button>
      </div>
    </div>
  )
}
