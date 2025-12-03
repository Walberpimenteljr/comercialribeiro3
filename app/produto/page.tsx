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
    { id: 1, nome: "Cimento Portland CP III 40", preco: 25.9, unidade: "50kg", estoque: 100, imagem: "https://static.wixstatic.com/media/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg/v1/fill/w_420,h_420,al_c,lg_1,q_80/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg", categoria: "Cimento" },
    { id: 2, nome: "Tijolo Cerâmico Comum", preco: 0.85, unidade: "unidade", estoque: 5000, imagem: "https://img.irroba.com.br/filters:fill(fff):quality(80)/fluzaoco/catalog/api/fluzaoco_citelirr/66bdef5bd2d01.jpg", categoria: "Estrutura e Alvenaria" },
    { id: 3, nome: "Areia Média Lavada", preco: 45.0, unidade: "1m³", estoque: 50, imagem: "https://images.tcdn.com.br/img/img_prod/1184849/areia_media_lavada_m3_367_1_4135efa86a10d532849f5a31cc56f1de.jpg", categoria: "Areia e Brita" },
    { id: 4, nome: "Brita 1 - Pedra Britada", preco: 55.0, unidade: "1m³", estoque: 60, imagem: "https://images.tcdn.com.br/img/img_prod/1320315/pedra_brita_1_m3_3637_1_28fb2f1c6626fac1a56bee92facf4d7b.jpg", categoria: "Areia e Brita" },
    { id: 5, nome: "Vergalhão de Aço CA-50 10mm", preco: 28.5, unidade: "barra", estoque: 200, imagem: "https://padovani.vtexassets.com/arquivos/ids/160012/barra-de-ferro-ca50-ca60-gerdau.jpg?v=635666043946270000", categoria: "Estrutura e Alvenaria" },
    { id: 6, nome: "Telha Cerâmica Romana", preco: 1.2, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/telha_ceramica_comum_unidade_193_1_20181011131917.png", categoria: "Telhado" },
    { id: 7, nome: "Porcelanato Polido 80x80cm Essence Bege (M²)", preco: 63.30, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/porcelanato_tipo_b_80x80_cm_polido_essence_bege_m_a_vista_2475_1_7e83ef0ccc0a4b3a2c7243813165e786.jpg", categoria: "Pisos e Revestimentos" },
    { id: 8, nome: "Revestimento Cerâmico Vizcaya 80x80cm", preco: 71.90, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/revestimento_vizcaya_cdo_201520_80x80_cm_1851_1_fb9afff7b46ad3492a5d4e6cb954f168.jpeg", categoria: "Pisos e Revestimentos" },
    { id: 9, nome: "Piso Pisoforte Acetinado 44x44cm", preco: 25.10, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/piso_pisoforte_orlando_acetinado_classe_a_44_x_44_1_20251009152354_0fbf91a64554.jpg", categoria: "Pisos e Revestimentos" },
    { id: 10, nome: "Cimento Montes Claros CP II-E 50 Kg", preco: 44.50, unidade: "50kg", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/551909/cimento_montes_claros_50_kg_a_vista_entrega_em_ubaira_zona_rural_entrega_em_cidades_vizinhas_763_2_0098b569731ab5777df24903c0d270ec.jpg", categoria: "Cimento" },
    
    // --- Novos Produtos Adicionados ---
    { id: 11, nome: "Tubo PVC Esgoto 100mm", preco: 35.0, unidade: "barra 6m", estoque: 150, imagem: "https://a-static.mlcdn.com.br/450x450/tubo-pvc-esgoto-simples-100mm-tigre/construlider/1367-5/04250af726f1c402120e36b2ccce1d14.jpg", categoria: "Hidráulica" },
    { id: 12, nome: "Fio Elétrico Flexível 2,5mm² Vermelho", preco: 85.9, unidade: "rolo 100m", estoque: 80, imagem: "https://a-static.mlcdn.com.br/450x450/rolo-de-fio-cabo-eletrico-flexivel-2-5mm-750v-sil-100m-vermelho/casalar/913/e9a304e262102148b1116c4f8263158c.jpg", categoria: "Elétrica" },
    { id: 13, nome: "Interruptor Simples com Placa", preco: 12.5, unidade: "unidade", estoque: 300, imagem: "https://a-static.mlcdn.com.br/450x450/interruptor-simples-com-placa-tramontina-liz-cor-branca/eletrosol/5549-0/4b6b63d91c784860b73c4731885b57d0.jpg", categoria: "Elétrica" },
    { id: 14, nome: "Tinta Acrílica Fosca Branco Neve", preco: 149.9, unidade: "lata 18L", estoque: 40, imagem: "https://a-static.mlcdn.com.br/450x450/tinta-acrilica-standard-fosca-18l-branco-neve-coral/mercadodastintas/54129532/6306c4b266e74659b3a3c962b083c748.jpeg", categoria: "Pintura" },
    { id: 15, nome: "Massa Corrida PVA", preco: 28.9, unidade: "balde 5kg", estoque: 120, imagem: "https://a-static.mlcdn.com.br/450x450/massa-corrida-pva-balde-5kg-coral/mercadodastintas/54002660/c19957771217e2968ff21a1c3d002a7b.jpeg", categoria: "Pintura" },
    { id: 16, nome: "Martelo de Unha 25mm", preco: 49.9, unidade: "unidade", estoque: 90, imagem: "https://a-static.mlcdn.com.br/450x450/martelo-de-unha-cabo-de-fibra-25mm-tramontina/casalar/1210-0/1b5e533c373a62f89c470a8d4621c0e3.jpg", categoria: "Ferramentas" },
    { id: 17, nome: "Parafuso para Madeira Philips (Cx 500un)", preco: 18.0, unidade: "caixa", estoque: 250, imagem: "https://a-static.mlcdn.com.br/450x450/parafuso-para-madeira-cabeca-chata-philips-3-5x30mm-500-unidades/ferragensalemaobh/parafuso-p-madeira-ccp-3-5x30mm-500pcs/1d960098f99e305e7e3135c3459c072c.jpeg", categoria: "Ferragens" },
    { id: 18, nome: "Luva de Proteção Pigmentada", preco: 5.5, unidade: "par", estoque: 500, imagem: "https://a-static.mlcdn.com.br/450x450/luva-de-seguranca-tricotada-pigmentada-malha-algodao/ferramentaskuhn/45-1/1e8f22030064f52f7823f03b8e561494.jpeg", categoria: "EPIs" },
    { id: 19, nome: "Cano PVC Água Fria 25mm", preco: 19.9, unidade: "barra 6m", estoque: 180, imagem: "https://a-static.mlcdn.com.br/450x450/cano-pvc-agua-fria-soldavel-25mm-tigre/construlider/1351-5/6e22f28126e7920141b7148a04917676.jpg", categoria: "Hidráulica" },
    { id: 20, nome: "Disjuntor Monopolar 20A", preco: 9.9, unidade: "unidade", estoque: 400, imagem: "https://a-static.mlcdn.com.br/450x450/disjuntor-monopolar-20a-curva-c-siemens-5sd6020-0kk/eletrosol/5549-7/16281045a203f5728a47460980590a36.jpg", categoria: "Elétrica" },
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

  // Categorias atualizadas para incluir os novos itens
  const categorias = ["Todos", "Cimento", "Estrutura e Alvenaria", "Areia e Brita", "Telhado", "Pisos e Revestimentos", "Hidráulica", "Elétrica", "Pintura", "Ferramentas", "Ferragens", "EPIs"]
  const produtosFiltrados = filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <Logo size="small" />
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setMostrarMenu(!mostrarMenu)}
            >
              <span className="text-xl">🛠️</span> Menu
            </button>
            {mostrarMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-10 backdrop-blur-sm bg-white/90 transition-transform origin-top">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition rounded-t-lg"
                  onClick={() => router.push("/perfil")}
                >
                  Perfil
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition rounded-b-lg"
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
      <div className="bg-gradient-to-r from-orange-600 to-red-500 rounded-xl text-white p-8 mb-8 mx-4 lg:mx-auto lg:max-w-7xl shadow-2xl mt-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Construa Seu Sonho! 🏡</h2>
        <p className="text-lg md:text-xl mb-4">Encontre os melhores materiais de construção com qualidade e preço justo.</p>
        <RedButton className="px-6 py-3 text-lg font-semibold bg-white text-orange-600 hover:bg-gray-100 transition shadow-md">
          Ver Ofertas
        </RedButton>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 flex">
        {/* Conteúdo Principal (Produtos) */}
        <div className="flex-grow">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">🛠️ Catálogo de Produtos</h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center p-3 bg-white rounded-lg shadow-inner">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 shadow-md ${
                  filtro === cat ? "bg-orange-600 text-white shadow-orange-300" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center relative border border-gray-100"
              >
                {produto.estoque < 20 && (
                  <span className="absolute top-3 left-3 bg-yellow-500 text-gray-800 text-xs px-3 py-1 rounded-full font-bold">
                    ⚠️ Últimas {produto.estoque} unidades!
                  </span>
                )}
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-40 h-40 object-cover mb-4 rounded-lg border border-gray-200 transform hover:rotate-1 transition-transform"
                />
                <h2 className="text-lg font-bold text-gray-900 text-center mb-1">{produto.nome}</h2>
                <p className="text-sm text-gray-500 mb-2">{produto.unidade}</p>
                <p className="text-2xl text-green-700 font-extrabold mt-auto">R$ {produto.preco.toFixed(2)}</p>
                <RedButton
                  className="mt-4 px-6 py-2 w-full bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-semibold shadow-md disabled:bg-gray-400"
                  onClick={() => adicionarCarrinho(produto)}
                  disabled={produto.estoque === 0}
                >
                  {produto.estoque > 0 ? "🛒 Adicionar ao Carrinho" : "Esgotado"}
                </RedButton>
              </div>
            ))}
          </div>
        </div>

        {/* Carrinho lateral fixo */}
        <div className="hidden lg:block ml-8 flex-shrink-0 w-80">
          <div className="sticky top-20 bg-white shadow-2xl rounded-xl p-5 z-30 border border-gray-100">
            <h3 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">Meu Carrinho</h3>
            {carrinho.length === 0 ? (
              <p className="text-gray-400 italic">Seu carrinho está vazio. Adicione itens! 😉</p>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {carrinho.map(item => (
                    <div key={item.produto.id} className="flex justify-between items-start border-b pb-2 last:border-b-0">
                      <div className="flex flex-col flex-grow">
                        <span className="font-medium text-gray-700 leading-tight">{item.produto.nome}</span>
                        <div className="flex items-center mt-1">
                          <input
                            type="number"
                            min="1"
                            max={item.produto.estoque}
                            value={item.quantidade}
                            onChange={(e) => mudarQuantidade(item.produto.id, parseInt(e.target.value))}
                            className="w-12 text-center border rounded-md text-sm p-1 mr-2"
                          />
                          <button
                            onClick={() => removerItem(item.produto.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 ml-4">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right font-extrabold text-2xl mt-5 pt-3 border-t-2 border-orange-200 text-orange-600">
                  Total: R$ {total.toFixed(2)}
                </div>
                <RedButton 
                  onClick={finalizarCompra} 
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-3"
                >
                  Pagar e Finalizar 💳
                </RedButton>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
