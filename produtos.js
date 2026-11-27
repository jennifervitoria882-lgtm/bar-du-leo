/* ============================================================
   BAR DU LÉO — DADOS DA LOJA (edite aqui!)
   - CONFIG: WhatsApp, pedido mínimo, horários
   - PRODUCTS: lista do cardápio (nomes, preços, descrições)
   FOTOS: cada produto procura a foto em imagens/produtos/
   com o NOME do produto, ex.: "Pastel de queijo" -> pastel-de-queijo.jpg
   Abra fotos.html para ver o nome exato de cada foto.
   ============================================================ */

const CONFIG = {
  nome: "Bar du Léo",
  whatsapp: "5532988040130",      // número que recebe os pedidos (com 55 + DDD)
  pedidoMinimo: 20,               // mínimo para delivery
  bloquearForaDoHorario: true     // true = não deixa finalizar pedido com o bar fechado
};

/* Horário: [abre, fecha] em horas. null = fechado o dia todo. 0=domingo ... 6=sábado */
const HORARIOS = { 0:[10,17], 1:null, 2:[8,21], 3:[8,21], 4:[8,21], 5:[8,21], 6:[10,17] };

const PRODUCTS = [
  {
    id: 1,
    name: "Trio da praça",
    category: "Pastéis",
    description: "3 unidades: carne, queijo e frango.",
    price: 25.00
  },
  {
    id: 2,
    name: "Pastel",
    category: "Pastéis",
    description: "Pastel preparado na hora. Escolha seu sabor.",
    price: 9.50,
    flavors: [
      "Queijo",
      "Carne",
      "Frango",
      "Palmito",
      "Pizza",
      "Linguiça",
      "Jiló",
      "Cachorro-quente",
      "Carne seca",
      "Salmão",
      "Bacalhau",
      "Camarão",
      "Banana",
      "Chocolate"
    ]
  },
  {id:20,name:"Bolinha de queijo (porção 1/4)",category:"Bolinhos",description:"Porção de bolinhas de queijo.",price:15},
  {id:21,name:"Bolinha de bacalhau (porção 1/4)",category:"Bolinhos",description:"Porção de bolinhas de bacalhau.",price:16},
  {id:22,name:"Bolinho de quibe (porção 1/4)",category:"Bolinhos",description:"Porção de quibe.",price:15},

  ...["Feijão amigo","Feijão amigo (pequeno)","Baroa","Canjiquinha","Vaca atolada","Ervilha"].map((n,i)=>({id:30+i,name:n,category:"Caldos",description:"Caldo da casa.",price:[25,20,25,25,25,25][i]})),

  ...["Sanduíche de carne cozida","Sanduíche de moela","Sanduíche de linguiça"].map((n,i)=>({id:40+i,name:n,category:"Sanduíches",description:"Sanduíche preparado na hora.",price:22})),

  ...["Mandioca","Linguiça","Moela","Fritas","Fritas com queijo","Carne cozida","Carne seca","Salaminho","Quibe cru"].map((n,i)=>({id:50+i,name:n,category:"Tira-gosto",description:"Consulte os tamanhos disponíveis: meia ou inteira.",price:[23,30,42,17,19,45,45,30,35][i]})),

  ...["Heineken / Cerveja Bar du Léo","Stella Artois","Original / Spaten","Amstel / Antarctica / Brahma","Therezópolis / Skol","Petra / Ecobier","Chopp São Bartolomeu","Long neck / Long neck zero"].map((n,i)=>({id:60+i,name:n,category:"Cervejas",description:"Cerveja gelada para acompanhar bons momentos. Venda proibida para menores de 18 anos.",price:[19,17,16,14,14,12,13,13][i],alcohol:true})),

  {id:70,name:"Caipirinha (pinga)",category:"Drinks",description:"Drink preparado na hora. Venda proibida para menores de 18 anos.",price:25,alcohol:true},
  {id:71,name:"Caipiríssima (vodka)",category:"Drinks",description:"Drink preparado na hora. Venda proibida para menores de 18 anos.",price:27,alcohol:true},

  ...["Campari","Vodka Orloff / Smirnoff","Cachaça (pinga)","Cachaça Dom Bré","Tequila","Rum / Licor 43","Whisky Red Label","Gin Tanqueray","Conhaque Domecq"].map((n,i)=>({id:80+i,name:n,category:"Doses",description:"Dose para apreciar com moderação. Venda proibida para menores de 18 anos.",price:[15,15,9,15,20,15,24,26,12][i],alcohol:true})),

  ...["Skol Beats","Xeque Mate","Vinho grande","Vinho pequeno"].map((n,i)=>({id:90+i,name:n,category:"Alcoólicas",description:"Bebida para acompanhar seu momento no Bar du Léo. Venda proibida para menores de 18 anos.",price:[17,17,57,37][i],alcohol:true})),

  ...["Refrigerante (lata)","Refrigerante (600ml)","Suco de laranja / limão","Energético Red Bull","Shot de limão","Água"].map((n,i)=>({id:100+i,name:n,category:"Não alcoólicas",description:"Bebida não alcoólica.",price:[7,10,12,17,2,5][i]}))
];


/* Descrições comerciais: valorizam o cardápio sem acrescentar ingredientes não confirmados. */
const DESCRICOES = {
  "Trio da praça":"Três pastéis em uma combinação clássica: carne, queijo e frango.",
  "Pastel":"Pastel preparado na hora, com o sabor escolhido por você.",
  "Bolinha de queijo (porção 1/4)":"Porção de bolinhas douradas, com queijo em cada mordida.",
  "Bolinha de bacalhau (porção 1/4)":"Porção de bolinhos de bacalhau, perfeita para compartilhar.",
  "Bolinho de quibe (porção 1/4)":"Quibe em porção para acompanhar bons momentos.",
  "Feijão amigo":"Caldo quentinho e reconfortante, clássico para qualquer ocasião.",
  "Feijão amigo (pequeno)":"Versão individual do nosso clássico feijão amigo.",
  "Baroa":"Creme de baroa servido quentinho e cheio de sabor.",
  "Canjiquinha":"Canjiquinha quentinha, com aquele gostinho de comida caseira.",
  "Vaca atolada":"Prato tradicional, servido bem quentinho.",
  "Ervilha":"Caldo de ervilha cremoso e reconfortante.",
  "Sanduíche de carne cozida":"Sanduíche preparado na hora para matar a fome com muito sabor.",
  "Sanduíche de moela":"Uma opção saborosa para quem aprecia os clássicos do boteco.",
  "Sanduíche de linguiça":"Sanduíche preparado na hora, ideal para acompanhar sua bebida.",
  "Mandioca":"Porção de mandioca, ótima pedida para compartilhar.",
  "Linguiça":"Porção de linguiça para deixar a mesa ainda mais gostosa.",
  "Moela":"Tira-gosto tradicional para acompanhar bons encontros.",
  "Fritas":"Porção de batatas fritas, clássica e irresistível.",
  "Fritas com queijo":"Batatas fritas com queijo: combinação que agrada sempre.",
  "Carne cozida":"Porção de carne cozida, um clássico da casa.",
  "Carne seca":"Tira-gosto de carne seca para quem gosta de sabores marcantes.",
  "Salaminho":"Porção de salaminho, perfeita para beliscar.",
  "Quibe cru":"Clássico quibe cru para quem aprecia essa tradição.",
  "Caipirinha (pinga)":"Caipirinha preparada na hora. Venda proibida para menores de 18 anos.",
  "Caipiríssima (vodka)":"Caipiríssima preparada na hora. Venda proibida para menores de 18 anos.",
  "Refrigerante (lata)":"Bebida gelada em lata para acompanhar seu pedido.",
  "Refrigerante (600ml)":"Refrigerante gelado para compartilhar.",
  "Suco de laranja / limão":"Suco para refrescar e acompanhar seu pedido.",
  "Energético Red Bull":"Energético gelado. Venda conforme a legislação vigente.",
  "Shot de limão":"Uma dose de limão para acompanhar.",
  "Água":"Água para manter a refrescância."
};

/* ---------------- funções compartilhadas (não precisa mexer) ---------------- */
const money = v => Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slugify = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
function lerJSON(chave, padrao){ try{ const v = JSON.parse(localStorage.getItem(chave)); return v ?? padrao; }catch(e){ return padrao; } }

/* Nome do arquivo de foto de um produto (sem extensão) */
const nomeFoto = p => p.image ? String(p.image).replace(/\.[A-Za-z0-9]+$/,"") : slugify(p.name);

/* Lista de caminhos que o site tenta, em ordem */
function caminhosFoto(p){
  const base = "imagens/produtos/";
  const lista = [];
  const aliases = {
    1: ["trio-da-praca .jpg", "trio-da-praca  (2).jpg"],
    2: ["pastel.jpg"],
    30: ["feijao-amigo.jpg"],
    31: ["feijao-amigo-pequeno.jpg"],
    50: ["mandioca.jpg"],
    42: ["linguica.jpg"],
    51: ["linguica.jpg"],
    52: ["moela.jpg"],
    53: ["fritas.jpg"],
    54: ["fritas-com-queijo.jpg"],
    55: ["carne-cozida.jpg"],
    56: ["carne-seca.jpg"],
    57: ["salaminho.jpg"],
    58: ["quibe-cru.jpg"],
    60: ["heineken-cerveja-bar-du-leo.jpg"],
    63: ["amstel-antarctica-brahma.jpg"],
    66: ["chopp-sao-bartolomeu.jpg"],
    70: ["caipirinha-pinga.jpg"],
    71: ["caipirissima-vodka.jpg"],
    80: ["campari.jpg"],
    81: ["vodka-orloff-smirnoff.jpg"],
    82: ["cachaca-pinga.jpg"],
    83: ["cachaca-pinga.jpg"],
    85: ["rum-licor-43.jpg"],
    86: ["whisky-red-label.jpg"],
    87: ["gin-tanqueray.jpg"],
    88: ["conhaque-domecq.jpg"],
    90: ["skol-beats.jpg"],
    91: ["xeque-mate.jpg"],
    100: ["refrigerante-lata.jpg"],
    101: ["refrigerante-600ml.jpg"],
    102: ["suco-de-laranja-limao.jpg"],
    103: ["energetico-red-bull.jpg"],
    104: ["shot-de-limao.jpg"],
    105: ["agua.jpg"]
  };
  (aliases[p.id] || []).forEach(file => lista.push(base + file));
  ["jpg","jpeg","png","webp","JPG"].forEach(e => lista.push(base + nomeFoto(p) + "." + e));
  ["jpg","png"].forEach(e => lista.push(base + p.id + "." + e));   /* compatível com o formato antigo (ID.jpg) */
  return lista;
}

/* Cria <img> que tenta cada caminho; dispara o evento "semfoto" se nenhum existir */
function criarImg(p){
  const img = new Image();
  const lista = caminhosFoto(p);
  let i = 0;
  img.alt = p.name;
  img.dataset.esperado = lista[0];
  img.onload = () => { img.dataset.achado = img.getAttribute("src"); };
  img.onerror = () => {
    i++;
    if (i < lista.length) img.src = lista[i];
    else { img.onerror = null; img.dispatchEvent(new Event("semfoto")); }
  };
  img.src = lista[0];
  return img;
}

/* Catálogo fixo do site estático: os produtos e preços são mantidos no próprio projeto. */
function getProducts(){
  return PRODUCTS.map(p => ({ ...p }));
}

/* Aberto ou fechado agora? */
function lojaStatus(){
  const d = new Date(), h = d.getHours() + d.getMinutes()/60, dia = d.getDay();
  const faixa = HORARIOS[dia];
  if (!faixa) return { aberto:false, msg:"Fechado hoje (segunda-feira). Abrimos terça às 08h." };
  if (h >= faixa[0] && h < faixa[1]) return { aberto:true, msg:"Aberto agora até as " + faixa[1] + "h" };
  if (h < faixa[0]) return { aberto:false, msg:"Fechado agora. Hoje abrimos às " + faixa[0] + "h." };
  return { aberto:false, msg:"Fechado agora. Voltamos no próximo dia de funcionamento." };
}
