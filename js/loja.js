/* ==========================================================================
   BAR DU LÉO — FUNÇÕES COMPARTILHADAS (carrinho, horários, mensagem WhatsApp)
   Carregue js/produtos.js ANTES deste arquivo.
   ========================================================================== */
"use strict";

const CART_KEY = "barduleo.carrinho.v2";
const DIAS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

/* ---------- utilitários ---------- */
const toCents = v => Math.round(Number(v) * 100);
const formatCents = c => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const money = v => formatCents(toCents(v));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const normalizar = s => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const $id = id => document.getElementById(id);

/* Remove caracteres de controle e marcas de formatação do WhatsApp (* _ ~ `) do texto digitado pelo cliente */
function limparTexto(texto, max) {
  return String(texto ?? "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/* ---------- armazenamento (à prova de falhas: modo privado, cota cheia etc.) ---------- */
function lerStorage(chave, padrao) {
  try {
    const v = JSON.parse(localStorage.getItem(chave));
    return v ?? padrao;
  } catch (e) { return padrao; }
}
function gravarStorage(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* ignora */ }
}

/* ---------- produtos ---------- */
const getProduto = id => PRODUCTS.find(p => p.id === id);
const fotoProduto = p => (p && p.image ? "imagens/produtos/" + p.image : null);

/* ---------- carrinho ---------- */
const Carrinho = {
  itens: [],

  carregar() {
    const salvo = lerStorage(CART_KEY, []);
    /* revalida com o catálogo: descarta itens de produtos que não existem mais e usa sempre o preço atual */
    this.itens = (Array.isArray(salvo) ? salvo : []).map(i => {
      const p = getProduto(i.id);
      if (!p || !(i.quantity > 0)) return null;
      return { ...i, name: nomeNoCarrinho(p, i.option), price: p.price, quantity: Math.min(99, Math.floor(i.quantity)) };
    }).filter(Boolean);
    return this.itens;
  },

  salvar() { gravarStorage(CART_KEY, this.itens); },

  chave: (id, option) => id + "|" + (option || ""),

  achar(id, option) { return this.itens.find(i => i.id === id && (i.option || "") === (option || "")); },

  adicionar(id, option = "") {
    const p = getProduto(id);
    if (!p) return null;
    let item = this.achar(id, option);
    if (item) item.quantity = Math.min(99, item.quantity + 1);
    else {
      item = { id: p.id, option, name: nomeNoCarrinho(p, option), price: p.price, alcohol: !!p.alcohol, quantity: 1 };
      this.itens.push(item);
    }
    this.salvar();
    return item;
  },

  alterar(id, option, delta) {
    const item = this.achar(id, option);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) this.remover(id, option);
    else { item.quantity = Math.min(99, item.quantity); this.salvar(); }
  },

  remover(id, option) {
    this.itens = this.itens.filter(i => !(i.id === id && (i.option || "") === (option || "")));
    this.salvar();
  },

  limpar() { this.itens = []; this.salvar(); },

  quantidade() { return this.itens.reduce((s, i) => s + i.quantity, 0); },

  /* total em centavos (evita erros de ponto flutuante) */
  subtotalCents() { return this.itens.reduce((s, i) => s + toCents(i.price) * i.quantity, 0); },

  temAlcool() { return this.itens.some(i => i.alcohol); }
};

function nomeNoCarrinho(p, option) {
  if (!option) return p.name;
  return p.optionMode === "replace" ? option : p.name + " - " + option;
}

/* ---------- horário de funcionamento ---------- */
function formatarHora(h) { return String(h).padStart(2, "0") + "h"; }

function faixaDoDia(dia) { return HORARIOS[dia]; }

function lojaStatus(data = new Date()) {
  const dia = data.getDay();
  const h = data.getHours() + data.getMinutes() / 60;
  const faixa = faixaDoDia(dia);
  if (!faixa) return { aberto: false, texto: "Fechado hoje", detalhe: "Abrimos na terça-feira, às 08h." };
  if (h >= faixa[0] && h < faixa[1]) return { aberto: true, texto: "Aberto agora", detalhe: "Atendemos até as " + formatarHora(faixa[1]) + "." };
  if (h < faixa[0]) return { aberto: false, texto: "Fechado agora", detalhe: "Hoje abrimos às " + formatarHora(faixa[0]) + "." };
  /* já fechou hoje: procura o próximo dia aberto */
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (faixaDoDia(d)) return { aberto: false, texto: "Fechado agora", detalhe: "Abrimos " + (i === 1 ? "amanhã" : "na " + DIAS[d].toLowerCase()) + ", às " + formatarHora(faixaDoDia(d)[0]) + "." };
  }
  return { aberto: false, texto: "Fechado agora", detalhe: "" };
}

/* ---------- mensagem do WhatsApp ---------- */
/* pedido = { nome, entrega: "delivery"|"retirada", endereco: {...}|null, pagamento, troco, observacoes } */
function montarMensagem(itens, pedido) {
  const L = [];
  const sub = itens.reduce((s, i) => s + toCents(i.price) * i.quantity, 0);
  L.push("*NOVO PEDIDO - " + CONFIG.nome.toUpperCase() + "*");
  L.push("");
  L.push("*Cliente:* " + pedido.nome);
  L.push("*Atendimento:* " + (pedido.entrega === "delivery" ? "Delivery" : "Retirada no bar"));
  if (pedido.entrega === "delivery" && pedido.endereco) {
    const a = pedido.endereco;
    let linha = a.rua + ", " + a.numero;
    if (a.complemento) linha += " - " + a.complemento;
    linha += " - " + a.bairro;
    if (a.cep) linha += " (CEP " + a.cep + ")";
    L.push("*Endereço:* " + linha);
    if (a.referencia) L.push("*Referência:* " + a.referencia);
  }
  L.push("");
  L.push("*ITENS DO PEDIDO*");
  itens.forEach(i => {
    L.push(i.quantity + "x " + i.name + " - " + formatCents(toCents(i.price)) + " cada = " + formatCents(toCents(i.price) * i.quantity));
  });
  L.push("");
  L.push("*Subtotal dos produtos:* " + formatCents(sub));
  if (pedido.entrega === "delivery") L.push("*Taxa de entrega:* a confirmar");
  L.push("*TOTAL DOS PRODUTOS:* " + formatCents(sub) + (pedido.entrega === "delivery" ? " (+ taxa de entrega)" : ""));
  L.push("");
  let pg = "*Pagamento:* " + pedido.pagamento;
  if (pedido.pagamento === "Dinheiro" && pedido.troco) pg += " (troco para " + formatCents(toCents(pedido.troco)) + ")";
  L.push(pg);
  if (pedido.observacoes) L.push("*Observações:* " + pedido.observacoes);
  return L.join("\n");
}

function urlWhatsApp(mensagem) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(mensagem);
}

/* Permite testes em Node sem alterar o comportamento no navegador */
if (typeof module !== "undefined") {
  module.exports = { toCents, formatCents, money, limparTexto, montarMensagem, urlWhatsApp, lojaStatus, Carrinho, nomeNoCarrinho };
}
