"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/component/Logo"
import { RedButton } from "@/component/RedButton"
import { ShoppingCart, User, X } from "lucide-react" 

// Interface Produto mantida...
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
  const [mostrarCarrinho, setMostrarCarrinho] = useState(true) 
  const [filtro, setFiltro] = useState<string>("Todos")

  // --- Lógica de Dados e Funções (Inalteradas) ---
  const produtos: Produto[] = [
    // Produtos originais
    { id: 1, nome: "Cimento Portland", preco: 25.90, unidade: "50kg", estoque: 100, imagem: "https://static.wixstatic.com/media/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg/v1/fill/w_420,h_420,al_c,lg_1,q_80/e645de_4c98327f16584cdabd476aa3f29bbf2f~mv2.jpg", categoria: "Cimento" },
    { id: 2, nome: "Tijolo Cerâmico", preco: 0.85, unidade: "unidade", estoque: 5000, imagem: "https://images.tcdn.com.br/img/img_prod/999130/tijolo_ceramico_de_vedacao_14x19x39cm_8073_1_68fe793c144c5af92ec609f70aa76c52.jpeg", categoria: "Tijolo" },
    { id: 3, nome: "Areia Média", preco: 45.00, unidade: "1m³", estoque: 50, imagem: "https://images.tcdn.com.br/img/img_prod/1184849/areia_media_lavada_m3_367_1_4135efa86a10d532849f5a31cc56f1de.jpg", categoria: "Areia e Brita" },
    { id: 4, nome: "Brita 1", preco: 55.00, unidade: "1m³", estoque: 60, imagem: "https://images.tcdn.com.br/img/img_prod/1320315/pedra_brita_1_m3_3637_1_28fb2f1c6626fac1a56bee92facf4d7b.jpg", categoria: "Areia e Brita" },
    { id: 5, nome: "Ferro 10mm", preco: 28.50, unidade: "barra", estoque: 200, imagem: "https://padovani.vtexassets.com/arquivos/ids/160012/barra-de-ferro-ca50-ca60-gerdau.jpg?v=635666043946270000", categoria: "Ferro" },
    { id: 6, nome: "Telha Cerâmica", preco: 1.20, unidade: "unidade", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/telha_ceramica_comum_unidade_193_1_20181011131917.png", categoria: "Telha" },
    { id: 7, nome: "Porcelanato Tipo B 80x80 cm Polido Essence Bege", preco: 63.30, unidade: "m²", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/porcelanato_tipo_b_80x80_cm_polido_essence_bege_m_a_vista_2475_1_7e83ef0ccc0a4b3a2c7243813165e786.jpg", categoria: "Pisos e Revestimentos" },
    { id: 8, nome: "Revestimento Vizcaya Código 201520 - 80x80 cm Tipo A", preco: 71.90, unidade: "m²", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/revestimento_vizcaya_cdo_201520_80x80_cm_1851_1_fb9afff7b46ad3492a5d4e6cb954f168.jpeg", categoria: "Pisos e Revestimentos" },
    { id: 9, nome: "Piso Pisoforte Orlando Acetinado Classe A 44 x 44 Cm", preco: 25.10, unidade: "m²", estoque: 2000, imagem: "https://images.tcdn.com.br/img/img_prod/551909/piso_pisoforte_orlando_acetinado_classe_a_44_x_44_1_20251009152354_0fbf91a64554.jpg", categoria: "Pisos e Revestimentos" },
    { id: 10, nome: "Cimento Montes Claros 50 Kg", preco: 44.50, unidade: "50kg", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/551909/cimento_montes_claros_50_kg_a_vista_entrega_em_ubaira_zona_rural_entrega_em_cidades_vizinhas_763_2_0098b569731ab5777df24903c0d270ec.jpg", categoria: "Cimento" },
    // Novos itens corrigidos e padronizados
    { id: 11, nome: "Bloco de Concreto", preco: 2.00, unidade: "unidade", estoque: 100, imagem: "https://www.millato.com.br/assets/uploads/produtos/millato-Produtos-13092019175513.png", categoria: "Tijolo" },
    { id: 12, nome: "Cal Usical", preco: 20.90, unidade: "20kg", estoque: 100, imagem: "https://multigeral.com.br/image/cache/catalog/geral/produto/argamassa_ac3_usical-800x800.jpg", categoria: "Tintas e Outros" },
    { id: 13, nome: "Piso Cerâmico Branco", preco: 37.00, unidade: "m²", estoque: 100, imagem: "https://cdn.leroymerlin.com.br/products/piso_brilhante_esna_rt60_1014_60x60cm_embramaco_91801136_70e1_220x220.jpg", categoria: "Pisos e Revestimentos" },
    { id: 14, nome: "Piso Cerâmico Efeito Madeira", preco: 31.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3WpjFTL6DQtmvAqqSnw082h1tL_QGbJkOhA&s", categoria: "Pisos e Revestimentos" },
    { id: 15, nome: "Piso Cerâmico Cinza", preco: 35.00, unidade: "m²", estoque: 100, imagem: "https://casamattos.fbitsstatic.net/img/p/piso-ceramica-rocha-forte-acetinado-cinza-escuro-em-hd-70x70cm-73882/260467.jpg?w=370&h=370&v=no-change&qs=ignore - peso ceramico cinza", categoria: "Pisos e Revestimentos" },
    { id: 16, nome: "Caixa D'água Fortlev 15000L", preco: 35.00, unidade: "unidade", estoque: 100, imagem: "https://efizi.com.br/cdn/shop/files/02020033-CAIXA-D-AGUA-POLIETILENO-15.000L-AZUL-FORTLEV-1.jpg?v=1727381140", categoria: "Caixa D'água" },
    { id: 17, nome: "Piso Efeito Mármore", preco: 28.00, unidade: "m²", estoque: 100, imagem: "https://www.papeleparede.com.br/29120-large_default/revestimento-flexivel-decorativo-efeito-marmore-cinza-90x60cm.jpg", categoria: "Pisos e Revestimentos" },
    { id: 18, nome: "Piso Xadrez Decorado", preco: 35.00, unidade: "m²", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/754030/porcelanato_decorado_xadrez_cinza_piacenza_20x20cm_peca_1638_1_6c064518c89aeaed9d3b0945038fe3c2.jpg", categoria: "Pisos e Revestimentos" },
    { id: 19, nome: "Revestimento Madeira para Parede", preco: 38.00, unidade: "m²", estoque: 100, imagem: "http://construindodecor.com.br/wp-content/uploads/2016/07/revestimentos-de-parede-1.jpg", categoria: "Pisos e Revestimentos"},
    { id: 20, nome: "Telha Ondulada", preco: 40.00, unidade: "unidade", estoque: 100, imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfmH4q6EhdUL7QYhbjifaCosM6J4cGF2dDsw&s", categoria: "Telha" },
    { id: 21, nome: "Cerâmica Retificada", preco: 40.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSmXRDVpTnDHQIQoY0OG_QOPHkUEFzY7azlGaoN9-O4RTyz8M-LezaBgcdu02rXQjHKiXUJmUtRj728ji3zqwo74OrAMJaf8a_IkqJNMmvK&usqp=CAc", categoria: "Pisos e Revestimentos" },
    { id: 22, nome: "Tinta Suvinil Branco Gelo", preco: 145.00, unidade: "galão 3.6L", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/1048952/tinta_acrilica_glasu_18_litros_fosco_completo_cor_gelo_3565_2_4dddfdfc5b56a684b360e639bb188704.jpg", categoria: "Tintas e Outros" },
    { id: 23, nome: "Piso Cerâmico Pastilhado", preco: 25.00, unidade: "m²", estoque: 100, imagem: "https://www.ateliedopiso.com.br/wp-content/uploads/2022/09/pastilha-1.jpg", categoria: "Pisos e Revestimentos" },
    { id: 24, nome: "Piso de Madeira", preco: 150.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSSiLXujWkF00aFARlaZ42LRk0BvkFTTQIqnX4Y6IdZcsTZu1HcoCQ7jWKzwLCV-BdRkPAvh-ddH_d6qci70XnQeg3m9AeE8vIpI1wtlA75IgDC1371jjxK3CJCJg&usqp=CAc", categoria: "Pisos e Revestimentos" },
    { id: 25, nome: "Tijolo Laminado", preco: 1.20, unidade: "unidade", estoque: 100, imagem: "https://papodearquiteto.com.br/wp-content/uploads/Tipos-de-tijolos-Tijolinho-Laminado-ou-tijolo-de-21-furos-768x423.jpg", categoria: "Tijolo" },
    { id: 26, nome: "Tinta Suvinil Vermelha", preco: 145.00, unidade: "galão 3.6L", estoque: 100, imagem: "https://a-static.mlcdn.com.br/420x420/tinta-para-parede-vermelha-suvinil-classica-premium-antimofo-800ml/tintasrt/cla8cvermborgonha02/a9396317da39cd3ddbbd514a3b22996c.jpeg", categoria: "Tintas e Outros" },
    { id: 27, nome: "Tinta Suvinil Azul", preco: 145.00, unidade: "galão 3.6L", estoque: 100, imagem: "https://a-static.mlcdn.com.br/420x420/tinta-para-parede-azul-suvinil-classica-800ml-cor-premium-cor-azul-ceu-cor-azul-tempestade/tintasrt/cla8cazmisterio/b4f8a57f0ec43283fe99ff879b9e8a5a.jpeg", categoria: "Tintas e Outros" },
    { id: 28, nome: "Pá", preco: 33.00, unidade: "unidade", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/828968/pa_bico_c_cabo_n_4_3599_1_a26bfbc963e7163a000ae4d71907e6ad.png", categoria: "Ferramentas" },
    { id: 29, nome: "Piso Cerâmico Amadeirado", preco: 52.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR3kDk5xCxC_PqFu7JCE4G0jMSIESC2iyXRuxMtD4a-3XT6gImQ_JkBcPGQejD3uxKoMp3OTh47J-UZjodD8npzcsK9q5FHEY8f5G_JBzHvbpwtIbDAn_i_TVKlxDLUPpO3hsu6Sg&usqp=CAc", categoria: "Pisos e Revestimentos" },
    { id: 30, nome: "Tinta Suvinil Verde Kiwi", preco: 145.00, unidade: "galão 3.6L", estoque: 100, imagem: "https://down-br.img.susercontent.com/file/sg-11134201-7qvdd-lhz76c0881ex64", categoria: "Tintas e Outros" },
    { id: 31, nome: "Martelo", preco: 56.75, unidade: "unidade", estoque: 45, imagem: "https://images.tcdn.com.br/img/img_prod/665026/martelo_estwing_com_unha_curva_e_cabo_de_madeira_mrw20c_3527_1_9ac8d06d50a725c1c51ec6fe2b45f8c1.jpg", categoria: "Ferramentas" },
    { id: 32, nome: "Cerâmico Venatto", preco: 30.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTPf_k-NQWvd_Jb3QQGkGBTHHHtUew5TDrbfdq7auV7fOnTgkeaM2estzZc4tD3o5mE__nEqwnJrRQWP9J2H0uSnmeuDIoTeeLhiJshdLKB&usqp=CAc", categoria: "Pisos e Revestimentos" },
    { id: 33, nome: "Tinta Suvinil Laranja", preco: 145.00, unidade: "galão 3.6L", estoque: 100, imagem: "https://a-static.mlcdn.com.br/420x420/tinta-para-parede-acrilica-laranja-suvinil-classica-800ml-premium-antimofo/tintasrt/cla8bsalm/49a8dd5dc904b276d9f8dba64e0ebfe7.jpeg", categoria: "Tintas e Outros" },
    { id: 34, nome: "Parafusadeira", preco: 332.40, unidade: "unidade", estoque: 20, imagem: "https://static.titaferramentas.com.br/public/titaferramentas/imagens/produtos/parafusadeira-furadeira-20v-max-litio-com-impacto-dcd7781b-b3-dewalt-67041dda00201.jpg", categoria: "Ferramentas" },
    { id: 35, nome: "Caixa D'água Fortlev 310L", preco: 25.00, unidade: "unidade", estoque: 100, imagem: "https://images.tcdn.com.br/img/img_prod/639010/caixa_tanque_de_agua_310l_polietileno_com_tampa_roscavel_fortlev_13469_2_ad040a31d9ae2d96efcb5db15442a835.jpg", categoria: "Caixa D'água" },
    { id: 36, nome: "Piso Java Retificado", preco: 73.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT-issCbbDdQkXJwrLOPRCQ8VPJbVTr_50mLEwSHknYm86ht4cmxtOxUTQQZYrFYTxkly7UKbzeK1t5qDkpPuztItMy74hK7OVQm_DPeGxyUcj3bVgicQw8", categoria: "Pisos e Revestimentos" },
    { id: 37, nome: "Kit Parafusos", preco: 124.62, unidade: "kit", estoque: 20, imagem: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSM49EeVYkQtP_8_eL-O4cc9dX2dr5fjOeudV0BN5epvXxjn_6Dq93XTrSjh53EivySwwzEfXl-5M25cuYEld5txR-TQ-7n9tUjOv79F6JU4oRlPklqM53w", categoria: "Ferramentas" },
    { id: 38, nome: "Piso Java Retificado 2", preco: 73.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT-issCbbDdQkXJwrLOPRCQ8VPJbVTr_50mLEwSHknYm86ht4cmxtOxUTQQZYrFYTxkly7UKbzeK1t5qDkpPuztItMy74hK7OVQm_DPeGxyUcj3bVgicQw8", categoria: "Pisos e Revestimentos" },
    { id: 39, nome: "Tinta Suvinil Preto", preco: 145.00, unidade: "galão 3.6L", estoque: 100, imagem: "https://down-br.img.susercontent.com/file/sg-11134201-7rbni-lp9vg0scg6dz42", categoria: "Tintas e Outros" },
    { id: 40, nome: "Piso Fioranno", preco: 69.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSgKzGmhH3tZd729PkcsIQxhTw6BTnjHcS54xUB_L1USEChRRAK85MxX5vVaJpB7Dr7MJSDCNIVUKhrXe3dETiXG8xLw-tCMXLjXNl6vyWB", categoria: "Pisos e Revestimentos" },
    { id: 41, nome: "Tinta Suvinil Amarelo", preco: 145.00, unidade: "galão 3.6L", estoque: 81, imagem: "https://a-static.mlcdn.com.br/420x420/tinta-para-parede-acrilica-suvinil-classica-800ml-cor-amarelo-lavavel-premium-cor-amarelo-caju-cor-amarelo-colonial/tintasrt/cla8aamareloamendoa/319eba3a89d53b04093cf68736106573.jpeg", categoria: "Tintas e Outros" },
    { id: 42, nome: "Piso Cerâmico Polido Tiffany", preco: 214.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTCZTnpzwNHVpFCcsUpwNIF7S45x8u9WnqImiXHNnM-7iQE2pdO0LhzkCIa9w_3zFSdQk3-gK42EzmzyLl73L6wVb_J0A3o84SkyhlACQjcpqR0UZwtNhzT", categoria: "Pisos e Revestimentos" },
    { id: 43, nome: "Alicate", preco: 27.02, unidade: "unidade", estoque: 56, imagem: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT5uNMMWiYdiV7_P3jyqdU6D79ciHGlFNDxXRkUjG3j7MJNt5CWiTxhYZwhuxPwzXr6Y-1IwoIb3uvVgk70q8vI1FnOayxn0ryj7XBu0rRHedj0Bysr0ov8aA", categoria: "Ferramentas" },
    { id: 44, nome: "Piso Vinílico", preco: 400.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQuGXC1OM2ihQ1xVx2YED5-It3a2Y8FfYZ9nQLTsdwkeF9c21ODO626XrGo4RXDZ1sr5GB7QijMw1uAgwmAqrVEjVDyWIjikYDqduZ2CBQI", categoria: "Pisos e Revestimentos" },
    { id: 45, nome: "Tinta Suvinil Roxo", preco: 145.00, unidade: "galão 3.6L", estoque: 41, imagem: "https://a-static.mlcdn.com.br/420x420/tinta-para-parede-roxo-suvinil-classica-premium-antimofo-800ml/tintasrt/cla8broxomd/f6df3333bd647391b50f9a55d2281f07.jpeg", categoria: "Tintas e Outros" },
    { id: 46, nome: "Kit Chave de Fenda", preco: 60.12, unidade: "kit", estoque: 70, imagem: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQZjRxW4L55WWM0GFn9HfWnyVHYFeix9B8zXW6Rpj8QDME-WuP-ckyhoJI8cSMtczwWviNqAqmlENoaceOV6OgKMeQ8udVa9jCosJd3ewMKycs00a9Qsx4g", categoria: "Ferramentas" },
    { id: 47, nome: "Piso Santa Cecilia", preco: 27.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQBRa2WM8YciXY9QkD1_gKm8U7f3lrcg3KI9Nx0OF2ndBUPs4zMRFffuj-Vp1vNxoy0QoNyVzomWlYb4meHJn4EimA7BqZeZF8MOXkDUUBO", categoria: "Pisos e Revestimentos" },
    { id: 48, nome: "Piso Triunfo", preco: 135.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT8G-V_5tK_BmlAA7HOas8WJQ_LDEYiWlRE61U5hpzfSnlTYJMgYk8lqza9gMhNgv5Olx8ye8y3XeQypAKM1aTl63_uZ3thTLYmc6k5t1ik9CWZUg-_b5o3", categoria: "Pisos e Revestimentos" },
    { id: 49, nome: "Tinta Suvinil Rosa", preco: 145.00, unidade: "galão 3.6L", estoque: 61, imagem: "https://m.magazineluiza.com.br/a-static/420x420/tinta-para-parede-acrilica-suvinil-800ml-classica-cor-rosa-premium-cor-rosa-queimado/tintasrt/cla8crosapink/2887ffb9c9d922f2cc9f1bf20f647b28.jpeg", categoria: "Tintas e Outros" },
    { id: 50, nome: "Piso Stone", preco: 23.00, unidade: "m²", estoque: 100, imagem: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTB_6sVKPOV83rInmIk2UMIUKHe4JkzPqcNb9hFolCza3xsL-4UV7J8UqNnh64SQk6pZNrRYNABLdGsxJVLZjWspHTQLrOJYnX3UX0ndr4", categoria: "Pisos e Revestimentos" },
    { id: 51, nome: "Capacete de Obra", preco: 20.02, unidade: "unidade", estoque: 100, imagem: "https://hidrauflex.cdn.magazord.com.br/img/2025/09/produto/2614/227073-800-800.jpg?ims=600x600", categoria: "Ferramentas" },
    { id: 52, nome: "Procura-se emprego ", preco: 0.01 unidade: "1 ", estoque: 1, imagem: "https://ibb.co/7FrVMzK", categoria: "Emprego" },
  ]; 
  const adicionarCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.produto.id === produto.id)
      if (itemExistente) {
        if (itemExistente.quantidade + 1 > produto.estoque) return prev
        return prev.map(item =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      }
      setMostrarCarrinho(true)
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  const removerItem = (id: number) => setCarrinho(prev => {
    const novoCarrinho = prev.filter(item => item.produto.id !== id)
    if (novoCarrinho.length === 0) setMostrarCarrinho(false)
    return novoCarrinho
  })

  const mudarQuantidade = (id: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === id)
    if (!produto || quantidade < 1 || quantidade > produto.estoque) return
    setCarrinho(prev => prev.map(item => item.produto.id === id ? { ...item, quantidade } : item))
  }

  const finalizarCompra = () => {
    if (carrinho.length === 0) return
    const query = encodeURIComponent(JSON.stringify(carrinho))
    router.push(`/checkout?carrinho=${query}`)
  }

  const total = useMemo(() => carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0), [carrinho])
  const totalItens = useMemo(() => carrinho.reduce((acc, item) => acc + item.quantidade, 0), [carrinho])

  const categorias = ["Todos", "Cimento", "Tijolo", "Areia e Brita", "Ferro", "Telha", "Pisos e Revestimentos"]
  const produtosFiltrados = useMemo(() => {
    return filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro)
  }, [filtro, produtos])
  // --- Fim da Lógica ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Estilizado */}
      <header className="sticky top-0 bg-white shadow-lg z-20 border-b border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Logo size="small" />
          <div className="flex items-center gap-4">
            {/* Botão de Carrinho (Mobile) */}
            {carrinho.length > 0 && (
              <button
                className={`md:hidden relative p-2 rounded-full transition ${mostrarCarrinho ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
                aria-label="Abrir Carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{totalItens}</span>
              </button>
            )}

            {/* Menu Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white transition duration-200"
                onClick={() => setMostrarMenu(!mostrarMenu)}
                aria-expanded={mostrarMenu}
              >
                <User className="w-5 h-5" /> Menu
              </button>
              {mostrarMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-30 transition-opacity duration-300 opacity-100">
                  <button
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-red-600 hover:text-white transition rounded-t-lg"
                    onClick={() => router.push("/login")}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Banner Institucional */}
      <div className="bg-gradient-to-br from-red-700 to-red-500 text-white p-10 mt-0 sm:mt-4 mb-10 mx-auto max-w-7xl rounded-none sm:rounded-xl text-center shadow-2xl shadow-red-300/50">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">Construa o Seu Sonho!</h2>
        <p className="text-xl opacity-90 mb-6">Materiais de alta qualidade e com o melhor preço para sua obra.</p>
        <RedButton className="px-8 py-3 text-lg font-semibold bg-white text-red-700 hover:bg-red-100 shadow-xl border border-transparent">
          Ver Ofertas Especiais
        </RedButton>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-8">
        {/* Conteúdo Principal (Produtos) */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-8 text-center text-red-700">🛠️ Catálogo de Produtos</h1>

          {/* Filtros Estilizados em Vermelho */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center p-3 bg-white rounded-xl shadow-lg border border-gray-100">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
                  filtro === cat
                    ? "bg-red-600 text-white shadow-red-300/50"
                    : "bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700"
                }`}
                onClick={() => setFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de produtos Estilizado com Botão Curto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map(produto => (
                <div
                  key={produto.id}
                  className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col relative border border-gray-100"
                >
                  {produto.estoque < 10 && (
                    <span className="absolute top-4 right-4 bg-yellow-500 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                      Baixo Estoque!
                    </span>
                  )}
                  <div className="w-full flex justify-center mb-4">
                     <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                        <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                     </div>
                  </div>
                 
                  {/* Conteúdo do Produto - Centralizado Horizontalmente */}
                  <div className="flex flex-col items-center flex-grow w-full text-center">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2 mb-1">{produto.nome}</h2>
                    <p className="text-sm text-gray-500 mb-3">({produto.unidade})</p>
                    <p className="text-2xl text-red-600 font-extrabold mt-auto mb-4">R$ {produto.preco.toFixed(2)}</p>
                    
                    {/* BOTÃO CURTO E COM ÍCONE */}
                    <RedButton
                      className="px-6 py-2 w-full bg-red-600 hover:bg-red-700 transition duration-200 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-400 flex items-center justify-center gap-2"
                      onClick={() => adicionarCarrinho(produto)}
                      disabled={produto.estoque <= 0}
                    >
                      <ShoppingCart className="w-5 h-5"/> 
                      {produto.estoque > 0 ? 'Comprar' : 'Esgotado'} 
                    </RedButton>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-lg text-gray-500">Nenhum produto encontrado nesta categoria.</p>
            )}
          </div>
        </div>
        {/* --- Fim Produtos --- */}

        {/* Carrinho Lateral (Drawer) */}
        <div className={`
          fixed inset-y-0 right-0 w-80 sm:w-96 bg-white shadow-2xl p-6 z-40 transition-transform duration-300
          ${mostrarCarrinho ? 'translate-x-0' : 'translate-x-full'}
          md:sticky md:top-20 md:h-fit md:translate-x-0 md:shadow-xl md:rounded-xl md:p-5 border-l-4 border-red-500
        `}>
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-red-600" /> Seu Carrinho
            </h3>
            <button
              className="md:hidden text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition"
              onClick={() => setMostrarCarrinho(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {carrinho.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Seu carrinho está vazio. 🛒</p>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {carrinho.map(item => {
                  const produtoOriginal = produtos.find(p => p.id === item.produto.id); 
                  return (
                    <div key={item.produto.id} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
                      <img src={item.produto.imagem} alt={item.produto.nome} className="w-12 h-12 object-cover rounded-md flex-shrink-0 shadow" />
                      <div className="flex-grow">
                        <p className="font-medium text-sm text-gray-800 leading-tight line-clamp-2">{item.produto.nome}</p>
                        <p className="text-xs text-gray-500">R$ {item.produto.preco.toFixed(2)} / {item.produto.unidade}</p>
                        <div className="flex items-center mt-1">
                          <button
                            className="text-red-500 hover:text-red-700 text-xs font-semibold mr-3 transition"
                            onClick={() => removerItem(item.produto.id)}
                            aria-label="Remover item"
                          >
                            Remover
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max={produtoOriginal?.estoque || 999}
                            value={item.quantidade}
                            onChange={(e) => mudarQuantidade(item.produto.id, parseInt(e.target.value))}
                            className="w-14 px-1 py-0.5 text-center border rounded-md text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                          />
                        </div>
                      </div>
                      <span className="font-bold text-red-600 flex-shrink-0">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-dashed border-red-300">
                <div className="flex justify-between items-center text-xl font-extrabold text-gray-800">
                  <span>Total:</span>
                  <span className="text-red-700">R$ {total.toFixed(2)}</span>
                </div>
                <RedButton onClick={finalizarCompra} className="mt-4 w-full text-lg py-3 bg-red-600 hover:bg-red-700 shadow-red-400/50 hover:shadow-red-500/70">
                  Prosseguir para o Checkout
                </RedButton>
              </div>
            </>
          )}
        </div>
        {/* --- Fim Carrinho --- */}
      </main>

      {/* Botão Flutuante para abrir o carrinho em Mobile/Pequenas Telas */}
      {carrinho.length > 0 && !mostrarCarrinho && (
        <button
          className="fixed bottom-6 right-6 p-4 bg-red-600 text-white rounded-full shadow-2xl z-50 hover:bg-red-700 transition md:hidden"
          onClick={() => setMostrarCarrinho(true)}
          aria-label="Abrir Carrinho"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-700 rounded-full">{totalItens}</span>
        </button>
      )}

      {/* Overlay para fechar o Drawer em Mobile */}
      {mostrarCarrinho && carrinho.length > 0 && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 md:hidden"
          onClick={() => setMostrarCarrinho(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  )
}
