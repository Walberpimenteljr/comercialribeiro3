"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { RedButton } from "@/component/RedButton";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  unidade: string;
  estoque: number;
  imagem: string;
  categoria: string;
}

export default function CatalogoSupabase() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<{ produto: Produto; quantidade: number }[]>([]);
  const [filtro, setFiltro] = useState<string>("Todos");

  // Carregar produtos do Supabase
  useEffect(() => {
    async function carregarProdutos() {
      const { data, error } = await supabase.from("produtos").select("*");
      if (error) console.log(error);
      else setProdutos(data as Produto[]);
    }
    carregarProdutos();
  }, []);

  const adicionarCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.produto.id === produto.id);
      if (itemExistente) {
        if (itemExistente.quantidade + 1 > produto.estoque) return prev;
        return prev.map(item =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  }

  const removerItem = (id: number) => setCarrinho(prev => prev.filter(item => item.produto.id !== id));

  const mudarQuantidade = (id: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto || quantidade < 1 || quantidade > produto.estoque) return;
    setCarrinho(prev => prev.map(item => item.produto.id === id ? { ...item, quantidade } : item));
  }

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let mensagem = "Olá, gostaria de finalizar a compra dos seguintes itens:%0A";
    carrinho.forEach(item => {
      mensagem += `- ${item.produto.nome} x${item.quantidade} (R$ ${item.produto.preco.toFixed(2)})%0A`;
    });
    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    const numeroWhatsApp = "5599999999999"; // coloque o número da sua loja
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(url, "_blank");
  }

  const categorias = ["Todos", ...Array.from(new Set(produtos.map(p => p.categoria)))];
  const produtosFiltrados = filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro);

  return (
    <div className="min-h-screen bg-gray-50 font-sans px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Materiais de Construção</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtosFiltrados.map(produto => (
          <div
            key={produto.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center relative"
          >
            {produto.estoque < 10 && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                Últimas unidades!
              </span>
            )}
            <img src={produto.imagem} alt={produto.nome} className="w-full h-36 object-cover mb-2 rounded-lg"/>
            <h3 className="font-semibold text-center">{produto.nome}</h3>
            <p className="text-gray-500">{produto.unidade}</p>
            <p className="text-green-600 font-bold mt-1 text-lg">R$ {produto.preco.toFixed(2)}</p>
            <RedButton
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium"
              onClick={() => adicionarCarrinho(produto)}
            >
              Comprar
            </RedButton>
          </div>
        ))}
      </div>

      {/* Carrinho lateral */}
      <div className="fixed right-4 top-20 w-80 bg-white shadow-xl rounded-xl p-5 z-50">
        <h3 className="text-xl font-bold mb-4">🛒 Carrinho</h3>
        {carrinho.length === 0 ? (
          <p className="text-gray-400">Seu carrinho está vazio.</p>
        ) : (
          <>
            {carrinho.map(item => (
              <div key={item.produto.id} className="flex justify-between items-center mb-2">
                <span>{item.produto.nome} x{item.quantidade}</span>
                <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                  onClick={() => removerItem(item.produto.id)}
                >
                  Remover
                </button>
              </div>
            ))}
            <div className="text-right font-bold text-lg mt-3">Total: R$ {total.toFixed(2)}</div>
            <RedButton onClick={finalizarCompra} className="mt-3 w-full">
              Finalizar Compra no WhatsApp
            </RedButton>
          </>
        )}
      </div>
    </div>
  )
}
