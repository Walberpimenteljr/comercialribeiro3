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
  categoria?: string
}

export default function ProdutoPage() {
  const router = useRouter()
  const [carrinho, setCarrinho] = useState<{ produto: Produto; quantidade: number }[]>([])
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [filtro, setFiltro] = useState<string>("Todos")

  const produtos: Produto[] = [
    { id: 1, nome: "Cimento Portland", preco: 25.9, unidade: "50kg", estoque: 100, imagem: "https://static.wixstatic.com/media/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg/v1/fill/w_420,h_420,al_c,lg_1,q_80/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg", categoria: "Cimento" },
    { id: 2, nome: "Tijolo Cerâmico", preco: 0.85, unidade: "unidade", estoque: 5000, imagem: "https://img.irroba.com.br/filters:fill(fff):quality(80)/fluzaoco/catalog/api/fluzaoco_citelirr/66bdef5bd2d01.jpg", categoria: "Tijolo" },
    { id: 3, nome: "Areia Média", preco: 45.0, unidade: "1m³", estoque: 50, imagem: "https://images.tcdn.com.br/img/img_prod/1184849/areia_media_lavada_m3_367_1_4135efa86a10d532849f5a31cc56f1de.jpg", categoria: "Areia e Brita" },
    { id: 4, nome: "Brita 1", preco: 55.0, unidade: "1m³", estoque: 60, imagem: "https://images.tcdn.com.br/img/img_prod/1320315/pedra_brita_1_m3_3637_1_28fb2f1c6626fac1a56bee92facf4d7b.jpg", categoria: "Areia e Brita" },
    { id: 5, nome: "Ferro 10mm", preco: 28.5, unidade: "barra", estoque: 200, imagem: "https://padovani.vtexassets.com/arquivos/ids/160012/barra-de-ferro-ca50-ca60-gerdau.jpg?v=635666043946270000", categoria: "Ferro" },
    { id: 6, nome: "Telha Cerâmica", preco: 1.2, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/telha_ceramica_comum_unidade_193_1_20181011131917.png", categoria: "Telha" },
    { id: 7, nome: "Porcelanato Tipo B 80x80 cm Polido Essence Bege", preco: 63.30, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/porcelanato_tipo_b_80x80_cm_polido_essence_bege_m_a_vista_2475_1_7e83ef0ccc0a4b3a2c7243813165e786.jpg", categoria: "Pisos e Revestimentos" },
    { id: 8, nome: "Revestimento Vizcaya Código 201520 - 80x80 cm Tipo A (M²)", preco: 71.90, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/revestimento_vizcaya_cdo_201520_80x80_cm_1851_1_fb9afff7b46ad3492a5d4e6cb954f168.jpeg", categoria: "Pisos e Revestimentos" },
    { id: 9, nome: "Piso Pisoforte Orlando Acetinado Classe A 44 x 44 Cm", preco: 25.10, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/piso_pisoforte_orlando_acetinado_classe_a_44_x_44_1_20251009152354_0fbf91a64554.jpg", categoria: "Pisos e Revestimentos" },
    { id: 10, nome: "Cimento Montes Claros 50 Kg", preco: 44.50, unidade: "50kg", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/551909/cimento_montes_claros_50_kg_a_vista_entrega_em_ubaira_zona_rural_entrega_em_cidades_vizinhas_763_2_0098b569731ab5777df24903c0d270ec.jpg", categoria: "Cimento" },

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

  const removerItem = (id: number) => setCarrinho(prev => prev.filter(item => item.produto.id !== id))

  const mudarQuantidade = (id: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === id)
    if (!produto || quantidade < 1 || quantidade > produto.estoque) return
    setCarrinho(prev => prev.map(item => item.produto.id === id ? { ...item, quantidade } : item))
  }

  const finalizarCompra = () => {
    if (carrinho.length === 0) return
    const query = encodeURIComponent(JSON.stringify(carrinho))
    router.push(/checkout?carrinho=${query})
  }

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)

  const categorias = ["Todos", "Cimento", "Tijolo", "Areia e Brita", "Ferro", "Telha", "Pisos e Revestimentos"]
  const produtosFiltrados = filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <Logo size="small" />
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-100 transition"
              onClick={() => setMostrarMenu(!mostrarMenu)}
            >
              👤 Menu
            </button>
            {mostrarMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-10 backdrop-blur-sm bg-white/70 transition-transform origin-top">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => router.push("/login")}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Banner Institucional */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-xl text-white p-8 mb-8 mx-4 md:mx-0 text-center">
        <h2 className="text-4xl font-bold mb-2">Bem-vindo à Nossa Loja!</h2>
        <p className="text-lg mb-4">Encontre os melhores materiais de construção com qualidade e preço justo.</p>
        <RedButton className="px-6 py-3 text-lg font-semibold">Explore o Catálogo</RedButton>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Materiais de Construção</h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === cat ? "bg-orange-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => setFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map(produto => (
            <div
              key={produto.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center relative"
            >
              {produto.estoque < 10 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Últimas unidades!</span>
              )}
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-36 h-36 object-cover mb-4 rounded-xl"
              />
              <h2 className="text-lg font-semibold text-gray-800 text-center">{produto.nome}</h2>
              <p className="text-gray-500">{produto.unidade}</p>
              <p className="text-green-600 font-bold mt-2 text-lg">R$ {produto.preco.toFixed(2)}</p>
              <RedButton
                className="mt-4 px-5 py-2 w-full bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-medium"
                onClick={() => adicionarCarrinho(produto)}
              >
                Adicionar
              </RedButton>
            </div>
          ))}
        </div>
      </main>

      {/* Carrinho lateral fixo */}
      <div className="fixed right-4 top-20 w-80 bg-white shadow-xl rounded-xl p-5 z-50">
        <h3 className="text-xl font-bold mb-4">Carrinho</h3>
        {carrinho.length === 0 ? (
          <p className="text-gray-400">Seu carrinho está vazio.</p>
        ) : (
          <>
            {carrinho.map(item => (
              <div key={item.produto.id} className="flex justify-between items-center mb-3">
                <span>{item.produto.nome} x{item.quantidade}</span>
                <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-right font-bold text-lg mt-3">Total: R$ {total.toFixed(2)}</div>
            <RedButton onClick={finalizarCompra} className="mt-3 w-full">Finalizar Compra</RedButton>
          </>
        )}
      </div>
    </div>
  )
}
