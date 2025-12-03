import React, { useState, useMemo, useEffect } from "react"
// Importação de useRouter substituída por uma função de simulação de navegação.
// import { useRouter } from "next/navigation" 
import { ShoppingCart, User, X, Plus, Minus, Search, Loader2 } from "lucide-react"

// --- Funções Auxiliares ---

// Combina classes Tailwind de forma condicional
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Formatação de Moeda Profissional (Real Brasileiro)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

// --- Simulação do useRouter (Permite que o código compile) ---
const useRouter = () => ({
  push: (url: string) => {
    console.log(`[Simulação de Navegação] Tentativa de navegar para: ${url}`);
    // Em um ambiente real Next.js, esta função faria a navegação.
    // Usamos um modal customizado ou console.log para evitar alert()
    const simulatedAction = document.getElementById('simulated-action-message');
    if (simulatedAction) {
        simulatedAction.textContent = `Ação simulada: Redirecionamento para a rota ${url}.`;
        simulatedAction.classList.remove('hidden');
        setTimeout(() => simulatedAction.classList.add('hidden'), 3000);
    }
  }
});

// --- Interfaces ---
interface Produto {
  id: number
  nome: string
  preco: number
  unidade: string
  estoque: number
  imagem: string
  categoria?: string
}

interface CartItem {
  produto: Produto
  quantidade: number
}

// --- Dados Mock (Melhorados) ---
const mockProdutos: Produto[] = [
  { id: 1, nome: "Cimento Portland CP V ARI", preco: 25.90, unidade: "50kg", estoque: 100, imagem: "https://placehold.co/400x400/0F172A/ffffff?text=Cimento", categoria: "Cimento" },
  { id: 2, nome: "Tijolo Cerâmico de Vedação 14x19x29", preco: 0.85, unidade: "unidade", estoque: 5000, imagem: "https://placehold.co/400x400/999999/ffffff?text=Tijolo", categoria: "Alvenaria" },
  { id: 3, nome: "Areia Média Lavada Certificada", preco: 45.00, unidade: "1m³", estoque: 50, imagem: "https://placehold.co/400x400/FACC15/000000?text=Areia", categoria: "Agregados" },
  { id: 4, nome: "Brita 1 para Concreto Estrutural", preco: 55.00, unidade: "1m³", estoque: 60, imagem: "https://placehold.co/400x400/525252/ffffff?text=Brita", categoria: "Agregados" },
  { id: 5, nome: "Vergalhão de Aço CA-50 10mm", preco: 28.50, unidade: "barra", estoque: 200, imagem: "https://placehold.co/400x400/4B5563/ffffff?text=Ferro", categoria: "Estrutural" },
  { id: 6, nome: "Telha Cerâmica Romana Premium", preco: 1.20, unidade: "unidade", estoque: 2000, imagem: "https://placehold.co/400x400/B45309/ffffff?text=Telha", categoria: "Cobertura" },
  { id: 7, nome: "Porcelanato Polido 80x80cm Bege Claro", preco: 63.30, unidade: "m²", estoque: 2000, imagem: "https://placehold.co/400x400/E5E5E5/000000?text=Porcelanato", categoria: "Revestimento" },
  { id: 8, nome: "Revestimento Vizcaya Acetinado 60x60cm", preco: 71.90, unidade: "m²", estoque: 2000, imagem: "https://placehold.co/400x400/E5E5E5/000000?text=Revestimento", categoria: "Revestimento" },
  { id: 9, nome: "Piso Cerâmico 44x44cm Classe A Azul", preco: 25.10, unidade: "m²", estoque: 2000, imagem: "https://placehold.co/400x400/E5E5E5/000000?text=Piso", categoria: "Revestimento" },
  { id: 10, nome: "Cimento Montes Claros CP IV 32", preco: 44.50, unidade: "50kg", estoque: 100, imagem: "https://placehold.co/400x400/0F172A/ffffff?text=Cimento", categoria: "Cimento" },
]

const categorias = ["Todos", "Cimento", "Alvenaria", "Agregados", "Estrutural", "Cobertura", "Revestimento"]

// --- Componente: Botão Primário Estilizado ---
const PrimaryButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
  <button
    className={cn(
      "bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 shadow-lg hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  >
    {children}
  </button>
)

// --- Componente: Cabeçalho ---
const Header: React.FC<{ onLogout: () => void, cartCount: number, onOpenCart: () => void }> = ({ onLogout, cartCount, onOpenCart }) => (
  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
      {/* Logo Refinado - Nome e Cor Atualizados */}
      <h1 className="text-2xl font-extrabold text-gray-800 tracking-wider flex items-center">
        <Loader2 className="h-6 w-6 text-red-600 animate-spin mr-1.5" />
        COMERCIAL <span className="text-red-700">RIBEIRO</span>
      </h1>

      <div className="flex items-center space-x-4">
        {/* Botão do Carrinho */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
          aria-label={`Ver Carrinho. ${cartCount} itens`}
        >
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>
        
        {/* Menu do Usuário */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition group border border-transparent hover:border-gray-200"
          aria-label="Sair da Aplicação"
        >
          <User className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </div>
  </header>
)

// --- Componente: Esqueleto de Carregamento para Produtos ---
const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse flex flex-col">
    <div className="h-48 w-full bg-gray-200" />
    <div className="p-5 flex flex-col flex-grow">
      <div className="h-3 bg-gray-300 rounded w-1/4 mb-2" />
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
    </div>
    <div className="p-5 border-t border-gray-100 flex justify-between items-center">
      <div className="h-6 bg-gray-300 rounded w-1/3" />
      <div className="h-10 w-24 bg-red-600/50 rounded-xl" />
    </div>
  </div>
);

// --- Componente: Card de Produto ---
const ProductCard: React.FC<{ produto: Produto, onAddToCart: (p: Produto) => void }> = ({ produto, onAddToCart }) => {
  const isLowStock = produto.estoque < 10 && produto.estoque > 0;
  const isOutOfStock = produto.estoque === 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:ring-2 hover:ring-red-500 transition-all duration-300 flex flex-col">
      {/* Imagem e Estoque */}
      <div className="relative h-48 w-full">
        <img
          src={produto.imagem}
          alt={`Imagem do produto: ${produto.nome}`}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = `https://placehold.co/400x400/6B7280/ffffff?text=${produto.categoria}`; }}
        />
        {isOutOfStock && (
          <span className="absolute inset-0 bg-gray-900/80 text-white text-xl flex items-center justify-center font-bold">ESGOTADO</span>
        )}
        {isLowStock && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-bounce">
            ÚLTIMAS {produto.estoque} UNIDADES
          </span>
        )}
        <span className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-tr-xl">
            {produto.categoria}
        </span>
      </div>

      {/* Detalhes */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2 flex-grow">{produto.nome}</h2>
        <p className="text-gray-500 text-sm mb-3 border-l-2 pl-2 border-red-200">Embalagem: {produto.unidade}</p>
      </div>
      
      {/* Preço e Ação */}
      <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Preço por {produto.unidade}</span>
          <p className="text-2xl font-extrabold text-blue-600">{formatCurrency(produto.preco)}</p>
        </div>
        <PrimaryButton
          onClick={() => onAddToCart(produto)}
          disabled={isOutOfStock}
          className="ml-4 px-6 py-2.5 shadow-blue-500/50"
        >
          <ShoppingCart className="w-5 h-5 mr-1" />
          Comprar
        </PrimaryButton>
      </div>
    </div>
  )
}

// --- Componente: Carrinho Lateral/Modal ---
const SidebarCart: React.FC<{
  carrinho: CartItem[],
  total: number,
  isVisible: boolean,
  onClose: () => void,
  onRemove: (id: number) => void,
  onChangeQuantity: (id: number, quantity: number) => void,
  onCheckout: () => void,
  produtos: Produto[]
}> = ({ carrinho, total, isVisible, onClose, onRemove, onChangeQuantity, onCheckout, produtos }) => {
  
  // Determina se é mobile (se a sidebar está visível como modal)
  const isMobile = isVisible && window.innerWidth < 1024; 
  
  return (
    <>
      {/* Overlay Escuro (apenas mobile) */}
      {isMobile && isVisible && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-[90] lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar/Modal do Carrinho */}
      <div className={cn(
        "fixed lg:sticky top-0 lg:top-16 right-0 w-full max-w-sm lg:w-80 bg-white shadow-2xl z-[100] lg:z-40 h-full lg:h-[calc(100vh-80px)] transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200",
        !isVisible && "translate-x-full"
      )}>
        {/* Título e Botão de Fechar */}
        <div className="flex justify-between items-center p-5 border-b border-red-600 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-red-600" />
            Seu Carrinho ({carrinho.length})
          </h3>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition" aria-label="Fechar Carrinho">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {carrinho.length === 0 ? (
            <div className="text-center py-10 opacity-70">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-lg">Seu carrinho está vazio.</p>
              <p className="text-sm text-gray-400 mt-1">Adicione produtos para começar a comprar.</p>
            </div>
          ) : (
            carrinho.map(item => {
              const produto = produtos.find(p => p.id === item.produto.id) || item.produto;
              const subtotal = item.produto.preco * item.quantidade;

              return (
                <div key={item.produto.id} className="flex border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg mr-3 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover"/>
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{produto.nome}</h4>
                    <p className="text-xs text-gray-500">{formatCurrency(item.produto.preco)} / {item.produto.unidade}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      {/* Controles de Quantidade */}
                      <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
                        <button
                          onClick={() => onChangeQuantity(item.produto.id, item.quantidade - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-30 transition"
                          disabled={item.quantidade <= 1}
                          aria-label={`Diminuir quantidade de ${produto.nome}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm w-5 text-center text-gray-800">{item.quantidade}</span>
                        <button
                          onClick={() => onChangeQuantity(item.produto.id, item.quantidade + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-30 transition"
                          disabled={item.quantidade >= produto.estoque}
                          aria-label={`Aumentar quantidade de ${produto.nome}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Subtotal e Remover */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(subtotal)}</p>
                        <button 
                          onClick={() => onRemove(item.produto.id)} 
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium"
                          aria-label={`Remover ${produto.nome} do carrinho`}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Resumo e Checkout */}
        {carrinho.length > 0 && (
          <div className="p-5 border-t-4 border-red-600 bg-white shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-700">Total a Pagar:</span>
              <span className="text-3xl font-extrabold text-green-600">{formatCurrency(total)}</span>
            </div>
            <PrimaryButton onClick={onCheckout} className="w-full py-3 text-lg shadow-green-500/50">
              Finalizar Compra
            </PrimaryButton>
          </div>
        )}
      </div>
    </>
  )
}

// --- Componente Principal ---
export default function ProductCatalog() {
  const router = useRouter()
  const [carrinho, setCarrinho] = useState<CartItem[]>([])
  const [filtro, setFiltro] = useState<string>("Todos")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isCartVisible, setIsCartVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Novo estado de carregamento

  // Simula o carregamento dos dados
  useEffect(() => {
    // Simula uma chamada API com 1 segundo de atraso
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Memoiza os produtos filtrados e a pesquisa para performance
  const produtosFiltrados = useMemo(() => {
    if (isLoading) return []; // Não retorna produtos se estiver carregando
    
    return mockProdutos.filter(p => {
      const matchesCategory = filtro === "Todos" || p.categoria === filtro;
      const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filtro, searchTerm, isLoading]) // Adiciona isLoading como dependência

  // Memoiza o cálculo total para performance
  const total = useMemo(() => {
    return carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
  }, [carrinho])

  const adicionarCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.produto.id === produto.id)
      if (itemExistente) {
        if (itemExistente.quantidade + 1 > produto.estoque) return prev // Limite de estoque
        return prev.map(item =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  const removerItem = (id: number) => setCarrinho(prev => prev.filter(item => item.produto.id !== id))

  const mudarQuantidade = (id: number, quantidade: number) => {
    const produto = mockProdutos.find(p => p.id === id)
    // Se o produto não existe, a quantidade é inválida, ou excede o estoque, retorna
    if (!produto || quantidade < 1 || quantidade > produto.estoque) return 

    setCarrinho(prev => prev.map(item => 
      item.produto.id === id ? { ...item, quantidade } : item
    ))
  }

  const finalizarCompra = () => {
    if (carrinho.length === 0) return
    const query = encodeURIComponent(JSON.stringify(carrinho))
    // Abre a sidebar no mobile e navega para o checkout se for desktop
    if (window.innerWidth < 1024) {
      setIsCartVisible(true);
    } else {
      router.push(`/checkout?carrinho=${query}`)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* Mensagem de Ação Simulada (Substitui alert()) */}
      <div id="simulated-action-message" className="hidden fixed top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl z-[150] transition-all duration-500 font-medium">
          Ação simulada: Redirecionamento em progresso.
      </div>

      {/* 1. Header Fixo */}
      <Header 
        onLogout={() => router.push("/login")}
        cartCount={carrinho.reduce((sum, item) => sum + item.quantidade, 0)}
        onOpenCart={() => setIsCartVisible(true)}
      />

      {/* 2. Banner de Destaque */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl text-white p-8 md:p-12 text-center shadow-2xl shadow-blue-900/40">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">O Melhor em Materiais de Construção</h2>
          <p className="text-xl opacity-80 mb-6">Entrega rápida e preços imbatíveis para sua obra.</p>
          <PrimaryButton 
            className="bg-white text-blue-800 hover:bg-gray-100 transition duration-300 shadow-none"
            onClick={() => {}}
            aria-label="Ir para a secção de promoções"
          >
            Ver Promoções Exclusivas
          </PrimaryButton>
        </div>
      </div>
      
      {/* 3. Layout Principal (Catálogo + Carrinho) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:flex lg:space-x-8">
        
        {/* Lado Esquerdo: Catálogo de Produtos */}
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-red-500 pb-2">Catálogo Completo</h1>
          
          {/* Barra de Busca e Filtros */}
          <div className="bg-white p-4 rounded-xl shadow-lg mb-6 sticky top-16 z-30 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {/* Pesquisa */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou descrição do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                  aria-label="Campo de busca de produtos"
                />
              </div>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap gap-2 justify-start pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-600 self-center mr-2 hidden sm:inline">Filtrar por:</span>
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-1.5 text-sm rounded-full font-medium transition duration-200 shadow-sm
                    ${filtro === cat 
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setFiltro(cat)}
                  aria-pressed={filtro === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Produtos ou Esqueleto */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : produtosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {produtosFiltrados.map(produto => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  onAddToCart={adicionarCarrinho}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-semibold">Nenhum produto encontrado.</p>
              <p className="text-gray-400 mt-1">Tente ajustar a busca ou o filtro de categoria.</p>
            </div>
          )}
        </div>

        {/* Lado Direito: Carrinho (Sidebar) */}
        <div className="lg:w-1/4 mt-8 lg:mt-0 lg:flex lg:justify-end">
          <SidebarCart
            carrinho={carrinho}
            total={total}
            isVisible={isCartVisible}
            onClose={() => setIsCartVisible(false)}
            onRemove={removerItem}
            onChangeQuantity={mudarQuantidade}
            onCheckout={finalizarCompra}
            produtos={mockProdutos}
          />
        </div>
      </div>
      
      {/* Rodapé Profissional */}
      <footer className="bg-gray-900 text-white mt-10 p-8 text-center border-t border-red-600">
          <p className="text-sm opacity-75">© {new Date().getFullYear()} Comercial Ribeiro. Todos os direitos reservados. | Desenvolvido com React & Tailwind CSS.</p>
          <div className="flex justify-center space-x-4 mt-2 text-xs opacity-60">
            <a href="#" className="hover:text-red-500 transition">Termos de Serviço</a>
            <a href="#" className="hover:text-red-500 transition">Política de Privacidade</a>
          </div>
      </footer>
    </div>
  )
}
