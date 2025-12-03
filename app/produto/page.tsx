"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/component/Logo"
import { RedButton } from "@/component/RedButton" // Mantido, mas ajustei a cor na classe

interface Produto {
  id: number
  nome: string
  preco: number
  unidade: string
  estoque: number
  imagem: string
  categoria?: string
}

// ----------------------------------------------------
// Componente principal - ProdutoPage
// ----------------------------------------------------

export default function ProdutoPage() {
  const router = useRouter()
  const [carrinho, setCarrinho] = useState<{ produto: Produto; quantidade: number }[]>([])
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [filtro, setFiltro] = useState<string>("Todos")

  // Seus dados de produto
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

  // Lógica do Carrinho
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

  const mudarQuantidade = (id: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === id)
    if (!produto || quantidade < 1 || quantidade > produto.estoque) return
    setCarrinho(prev => prev.map(item => item.produto.id === id ? { ...item, quantidade } : item))
  }
  
  const removerItem = (id: number) => setCarrinho(prev => prev.filter(item => item.produto.id !== id))


  const finalizarCompra = () => {
    if (carrinho.length === 0) return
    // Usando sessionStorage para passar dados complexos de forma mais robusta
    sessionStorage.setItem("carrinho-checkout", JSON.stringify(carrinho))
    router.push("/checkout")
  }

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)

  // Lógica de Filtro
  const categorias = ["Todos", "Cimento", "Tijolo", "Areia e Brita", "Ferro", "Telha", "Pisos e Revestimentos"]
  const produtosFiltrados = filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro)

  // ----------------------------------------------------
  // Renderização do Componente
  // ----------------------------------------------------

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center h-20">
          <Logo size="medium" />
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                onClick={() => setMostrarMenu(!mostrarMenu)}
              >
                <span className="text-xl">👤</span> Menu
              </button>
              {mostrarMenu && (
                <div className="absolute right-0 mt-3 w-36 bg-white border border-gray-100 rounded-lg shadow-xl z-10 transition-transform origin-top animate-fade-in-down">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition rounded-t-lg"
                    onClick={() => {
                      setMostrarMenu(false);
                      router.push("/perfil"); // Exemplo de rota
                    }}
                  >
                    Meu Perfil
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition rounded-b-lg"
                    onClick={() => router.push("/login")}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
            {/* Ícone do Carrinho (para mobile) */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition relative"
              aria-label="Ver Carrinho"
              onClick={() => {
                  // Lógica para mostrar carrinho em mobile (ex: modal ou sidebar)
                  alert("Em mobile, o carrinho seria aberto em uma modal/drawer.")
              }}
            >
                🛒
                {carrinho.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{carrinho.length}</span>
                )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {/* Banner Institucional */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl text-white p-8 mb-10 text-center shadow-lg">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Sua Obra, Nossa Prioridade.</h2>
            <p className="text-xl opacity-90 mb-6">Encontre os melhores materiais de construção com a qualidade e o suporte que você merece.</p>
            <RedButton className="px-8 py-3 text-lg font-bold bg-orange-600 hover:bg-orange-700 transition duration-200 shadow-xl">
                Ver Ofertas da Semana
            </RedButton>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-3">🏗️ Catálogo de Materiais</h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-medium transition duration-200 shadow-md ${
                  filtro === cat
                    ? "bg-red-600 text-white shadow-red-300/50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produtosFiltrados.map(produto => (
              <div
                key={produto.id}
                className="bg-white border border-gray-100 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center relative"
              >
                {produto.estoque < 10 && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                    Últimas unidades!
                  </span>
                )}
                <div className="w-full h-40 flex items-center justify-center mb-4">
                    <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-36 h-36 object-contain rounded-xl"
                    />
                </div>
                <h2 className="text-md font-semibold text-gray-800 text-center mb-1 h-12 overflow-hidden">{produto.nome}</h2>
                <p className="text-gray-500 text-sm mb-3">{produto.unidade}</p>
                <p className="text-3xl text-green-700 font-extrabold mt-auto mb-4">
                  R$ <span className="text-4xl">{produto.preco.toFixed(2).split('.')[0]}</span>.{produto.preco.toFixed(2).split('.')[1]}
                </p>
                <RedButton
                  className="mt-2 px-6 py-3 w-full bg-red-600 hover:bg-red-700 transition text-white rounded-xl font-semibold shadow-lg shadow-red-200/50"
                  onClick={() => adicionarCarrinho(produto)}
                  disabled={produto.estoque === 0}
                >
                  {produto.estoque > 0 ? "Adicionar ao Carrinho" : "Esgotado"}
                </RedButton>
              </div>
            ))}
          </div>
        </div>

        {/* Carrinho lateral fixo */}
        <div className="w-full lg:w-96 lg:sticky top-24 h-fit bg-white border border-gray-200 shadow-xl rounded-2xl p-6 lg:ml-8">
          <h3 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
            🛒 Seu Carrinho
          </h3>
          {carrinho.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">Adicione produtos para começar a comprar!</p>
          ) : (
            <>
              {carrinho.map(item => (
                <div key={item.produto.id} className="flex justify-between items-center mb-4 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-gray-800 truncate pr-2">{item.produto.nome}</span>
                      <div className="flex items-center mt-1">
                          <button 
                            onClick={() => mudarQuantidade(item.produto.id, item.quantidade - 1)}
                            className="text-gray-600 hover:text-red-600 disabled:opacity-50"
                            disabled={item.quantidade <= 1}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            value={item.quantidade} 
                            onChange={(e) => mudarQuantidade(item.produto.id, parseInt(e.target.value) || 1)}
                            className="w-10 text-center mx-2 border rounded text-sm"
                            min="1"
                            max={item.produto.estoque}
                          />
                          <button 
                            onClick={() => mudarQuantidade(item.produto.id, item.quantidade + 1)}
                            className="text-gray-600 hover:text-green-600 disabled:opacity-50"
                            disabled={item.quantidade >= item.produto.estoque}
                          >
                            +
                          </button>
                      </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-md font-semibold text-gray-800">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    <button onClick={() => removerItem(item.produto.id)} className="text-xs text-red-500 hover:text-red-700 mt-1">
                        Remover
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-right mt-6 pt-4 border-t border-gray-200">
                <p className="text-lg font-medium text-gray-600 mb-1">Subtotal:</p>
                <p className="text-4xl font-extrabold text-red-600">R$ {total.toFixed(2)}</p>
              </div>
              <RedButton onClick={finalizarCompra} className="mt-5 w-full bg-green-600 hover:bg-green-700 text-lg py-3 rounded-xl transition shadow-lg shadow-green-300/50">
                Finalizar Compra
              </RedButton>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <Logo size="small" variant="light" />
                <p className="text-sm mt-2 text-gray-400">© {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
            </div>
            <div className="flex gap-6 text-sm">
                <a href="#" className="hover:text-red-400 transition">Termos de Uso</a>
                <a href="#" className="hover:text-red-400 transition">Política de Privacidade</a>
                <a href="#" className="hover:text-red-400 transition">Contato</a>
            </div>
        </div>
      </footer>
    </div>
  )
}
