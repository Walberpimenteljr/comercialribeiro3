"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/component/Logo"
import { RedButton } from "@/component/RedButton" // Mantido como componente de ação

// Usamos Tailwind para ícones simples, mas se fosse uma aplicação real,
// usaria bibliotecas de ícones como Lucide ou Heroicons.

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
// Componente principal - ProdutoPage (Extreme Redesign)
// ----------------------------------------------------

export default function ProdutoPage() {
  const router = useRouter()
  const [carrinho, setCarrinho] = useState<{ produto: Produto; quantidade: number }[]>([])
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [filtro, setFiltro] = useState<string>("Todos")

  // Seus dados de produto
  const produtos: Produto[] = [
    { id: 1, nome: "Cimento Portland CP III-40 RS", preco: 25.9, unidade: "50kg", estoque: 8, imagem: "https://static.wixstatic.com/media/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg/v1/fill/w_420,h_420,al_c,lg_1,q_80/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg", categoria: "Cimento" },
    { id: 2, nome: "Tijolo Cerâmico de Vedação 8 Furos", preco: 0.85, unidade: "unidade", estoque: 5000, imagem: "https://img.irroba.com.br/filters:fill(fff):quality(80)/fluzaoco/catalog/api/fluzaoco_citelirr/66bdef5bd2d01.jpg", categoria: "Tijolo" },
    { id: 3, nome: "Areia Média Lavada para Concreto", preco: 45.0, unidade: "1m³", estoque: 50, imagem: "https://images.tcdn.com.br/img/img_prod/1184849/areia_media_lavada_m3_367_1_4135efa86a10d532849f5a31cc56f1de.jpg", categoria: "Areia e Brita" },
    { id: 4, nome: "Brita 1 - Pedra para Concretos Estruturais", preco: 55.0, unidade: "1m³", estoque: 60, imagem: "https://images.tcdn.com.br/img/img_prod/1320315/pedra_brita_1_m3_3637_1_28fb2f1c6626fac1a56bee92facf4d7b.jpg", categoria: "Areia e Brita" },
    { id: 5, nome: "Vergalhão de Ferro CA-50 10mm", preco: 28.5, unidade: "barra", estoque: 200, imagem: "https://padovani.vtexassets.com/arquivos/ids/160012/barra-de-ferro-ca50-ca60-gerdau.jpg?v=635666043946270000", categoria: "Ferro" },
    { id: 6, nome: "Telha Cerâmica Romana Resinada", preco: 1.2, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/telha_ceramica_comum_unidade_193_1_20181011131917.png", categoria: "Telha" },
    { id: 7, nome: "Porcelanato 80x80 cm Polido Essence Bege", preco: 63.30, unidade: "m²", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/porcelanato_tipo_b_80x80_cm_polido_essence_bege_m_a_vista_2475_1_7e83ef0ccc0a4b3a2c7243813165e786.jpg", categoria: "Pisos e Revestimentos" },
    { id: 8, nome: "Revestimento Vizcaya Código 201520 - 80x80 cm", preco: 71.90, unidade: "m²", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/revestimento_vizcaya_cdo_201520_80x80_cm_1851_1_fb9afff7b46ad3492a5d4e6cb954f168.jpeg", categoria: "Pisos e Revestimentos" },
    { id: 9, nome: "Piso Pisoforte Orlando Acetinado 44 x 44 Cm", preco: 25.10, unidade: "m²", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/piso_pisoforte_orlando_acetinado_classe_a_44_x_44_1_20251009152354_0fbf91a64554.jpg", categoria: "Pisos e Revestimentos" },
    { id: 10, nome: "Cimento Montes Claros CP IV-32", preco: 44.50, unidade: "50kg", estoque: 12, imagem: "https://images.tcdn.com.br/img/img_prod/551909/cimento_montes_claros_50_kg_a_vista_entrega_em_ubaira_zona_rural_entrega_em_cidades_vizinhas_763_2_0098b569731ab5777df24903c0d270ec.jpg", categoria: "Cimento" },
  ]

  // Lógica de manipulação do carrinho (simplificada, mantendo sua original)
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
    sessionStorage.setItem("carrinho-checkout", JSON.stringify(carrinho))
    router.push("/checkout")
  }

  const total = useMemo(() => carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0), [carrinho])

  const categorias = ["Todos", "Cimento", "Tijolo", "Areia e Brita", "Ferro", "Telha", "Pisos e Revestimentos"]
  const produtosFiltrados = useMemo(() => 
    filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro), 
    [filtro, produtos]
  )
  
  // ----------------------------------------------------
  // Renderização do Componente
  // ----------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      
      {/* 1. Header Fixo Premium */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-20">
          <Logo size="medium" />
          <div className="flex items-center gap-6">
            {/* Menu Dropdown Profissional */}
            <div className="relative">
              <button
                className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition duration-150 shadow-sm"
                onClick={() => setMostrarMenu(!mostrarMenu)}
              >
                <span className="text-xl">👤</span> Minha Conta
              </button>
              {mostrarMenu && (
                <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-100 rounded-lg shadow-2xl z-10 animate-fade-in-down transition">
                  <button className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition rounded-t-lg">
                    Pedidos
                  </button>
                  <button className="block w-full text-left px-4 py-3 text-red-600 font-semibold hover:bg-red-50 transition rounded-b-lg" onClick={() => router.push("/login")}>
                    Sair
                  </button>
                </div>
              )}
            </div>
            
            {/* Ícone do Carrinho (Botão flutuante em mobile/tablet) */}
            <button 
              className="lg:hidden p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition relative shadow-lg shadow-red-300/50"
              aria-label="Ver Carrinho"
              onClick={() => alert("Em mobile, esta ação abriria um Drawer ou Modal do Carrinho.")}
            >
                <span className="text-xl">🛒</span>
                {carrinho.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-full">{carrinho.length}</span>
                )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Conteúdo Principal (Produtos e Filtros) */}
        <div className="flex-1">
            
            {/* 2. Banner Institucional Imponente */}
            <div className="bg-gray-900 rounded-3xl text-white p-10 mb-12 text-center shadow-xl">
              <h2 className="text-5xl font-extrabold mb-3 tracking-tight">O Material Certo para a Sua Obra.</h2>
              <p className="text-xl opacity-80 mb-6 max-w-2xl mx-auto">Qualidade, variedade e entrega garantida para você construir sem preocupações.</p>
              <RedButton className="px-8 py-3 text-lg font-bold bg-red-600 hover:bg-red-700 transition duration-200 shadow-2xl shadow-red-400/50 rounded-full">
                  Fale com um Especialista
              </RedButton>
            </div>

            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">🛠️ Catálogo de Produtos</h1>

            {/* 3. Filtros Estilizados */}
            <div className="flex flex-wrap gap-3 mb-10 justify-start border-b pb-4">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-200 border ${
                    filtro === cat
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 4. Grid de Produtos Profissional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {produtosFiltrados.map(produto => (
                <div
                  key={produto.id}
                  className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] flex flex-col relative"
                >
                  {produto.estoque < 15 && produto.estoque > 0 && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      BAIXO ESTOQUE
                    </span>
                  )}
                  {produto.estoque === 0 && (
                    <span className="absolute top-4 left-4 bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      ESGOTADO
                    </span>
                  )}
                  
                  <div className="w-full h-40 flex items-center justify-center mb-4">
                      <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-full object-contain rounded-xl transition-transform duration-500 hover:scale-105"
                      />
                  </div>
                  
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 h-14 overflow-hidden leading-snug">{produto.nome}</h2>
                  <p className="text-gray-500 text-sm mb-4">{produto.unidade}</p>
                  
                  {/* Preço com Destaque Forte */}
                  <p className="text-4xl text-green-700 font-extrabold mt-auto mb-4">
                    R$ <span className="text-5xl">{produto.preco.toFixed(2).split('.')[0]}</span>.{produto.preco.toFixed(2).split('.')[1]}
                  </p>
                  
                  <RedButton
                    className="mt-2 px-6 py-3 w-full bg-red-600 hover:bg-red-700 transition text-white rounded-xl font-semibold shadow-xl shadow-red-300/50"
                    onClick={() => adicionarCarrinho(produto)}
                    disabled={produto.estoque === 0}
                  >
                    {produto.estoque > 0 ? "ADICIONAR AO CARRINHO" : "PRODUTO ESGOTADO"}
                  </RedButton>
                </div>
              ))}
            </div>
        </div>

        {/* 5. Carrinho Lateral (Sidebar) Elegante */}
        <div className="w-full lg:w-96 lg:sticky top-24 h-fit bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 lg:ml-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2 border-b pb-3">
            <span className="text-2xl">🛍️</span> Seu Carrinho
          </h3>
          
          {carrinho.length === 0 ? (
            <p className="text-gray-400 py-10 text-center text-lg">Nenhum item no carrinho.</p>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto pr-2">
                {carrinho.map(item => (
                  <div key={item.produto.id} className="flex justify-between items-center mb-4 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className="flex flex-col flex-1 pr-2">
                        <span className="text-sm font-medium text-gray-800 truncate leading-snug">{item.produto.nome}</span>
                        <div className="flex items-center mt-2 text-gray-600">
                            <button 
                              onClick={() => mudarQuantidade(item.produto.id, item.quantidade - 1)}
                              className="w-6 h-6 border rounded hover:bg-gray-100 transition disabled:opacity-30"
                              disabled={item.quantidade <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                            <button 
                              onClick={() => mudarQuantidade(item.produto.id, item.quantidade + 1)}
                              className="w-6 h-6 border rounded hover:bg-gray-100 transition disabled:opacity-30"
                              disabled={item.quantidade >= item.produto.estoque}
                            >
                              +
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-md font-bold text-gray-900">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                      <button onClick={() => removerItem(item.produto.id)} className="text-xs text-red-500 hover:text-red-700 mt-1 transition">
                          Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right mt-6 pt-4 border-t border-gray-200">
                <p className="text-xl font-medium text-gray-600 mb-2">Total:</p>
                <p className="text-5xl font-extrabold text-red-600 tracking-tighter">R$ {total.toFixed(2)}</p>
              </div>
              <RedButton onClick={finalizarCompra} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-lg py-4 rounded-xl transition shadow-xl shadow-green-300/50">
                CHECKOUT SEGURO
              </RedButton>
            </>
          )}
        </div>
      </div>

      {/* 6. Footer Profissional */}
      <footer className="bg-gray-900 text-white mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
                <div>
                    <h4 className="font-semibold text-lg mb-4 text-red-400">Institucional</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition">Sobre Nós</a></li>
                        <li><a href="#" className="hover:text-white transition">Nossas Lojas</a></li>
                        <li><a href="#" className="hover:text-white transition">Carreiras</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4 text-red-400">Ajuda e Suporte</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition">Central de Ajuda</a></li>
                        <li><a href="#" className="hover:text-white transition">Entrega e Prazos</a></li>
                        <li><a href="#" className="hover:text-white transition">Trocas e Devoluções</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4 text-red-400">Contato</h4>
                    <p className="text-gray-400">contato@suaempresa.com.br</p>
                    <p className="text-gray-400">(91) 99999-9999</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <h4 className="font-semibold text-lg mb-4 text-red-400">Newsletter</h4>
                    <p className="text-gray-400 mb-3">Receba nossas ofertas exclusivas.</p>
                    <div className="flex">
                        <input type="email" placeholder="Seu e-mail" className="p-2 rounded-l-lg text-gray-900 flex-grow" />
                        <button className="bg-red-600 p-2 rounded-r-lg hover:bg-red-700 transition">Assinar</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <Logo size="small" variant="light" />
                <p className="mt-4 md:mt-0">© {new Date().getFullYear()} Sua Empresa de Construção. Todos os direitos reservados.</p>
            </div>
        </div>
      </footer>
    </div>
  )
}
