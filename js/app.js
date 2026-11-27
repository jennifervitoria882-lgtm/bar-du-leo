/* ==========================================================================
   BAR DU LÉO — PÁGINA INICIAL (cardápio, carrinho, menu, horários)
   Ordem dos scripts: produtos.js → loja.js → app.js
   ========================================================================== */
(function () {
  "use strict";

  const estado = { categoria: "todos", busca: "" };
  const grid = $id("productGrid");
  const inputBusca = $id("searchInput");
  const selectCategoria = $id("categoryFilter");
  const pills = $id("categoryPills");
  const dialog = $id("cartDialog");
  let toastTimer;

  /* ------------------------------------------------------------------ */
  /* Avisos (toast) e contador                                            */
  /* ------------------------------------------------------------------ */
  function toast(msg) {
    const el = $id("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function atualizarContadores() {
    const qtd = Carrinho.quantidade();
    $id("cartCount").textContent = qtd;
    $id("cartCount").hidden = qtd === 0;
    const bar = $id("cartBar");
    bar.hidden = qtd === 0;
    $id("cartBarText").textContent = qtd + (qtd === 1 ? " item" : " itens");
    $id("cartBarTotal").textContent = formatCents(Carrinho.subtotalCents());
    const badge = $id("cartCount");
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  }

  /* ------------------------------------------------------------------ */
  /* Categorias e filtros                                                 */
  /* ------------------------------------------------------------------ */
  function categorias() { return [...new Set(PRODUCTS.map(p => p.category))]; }

  function montarCategorias() {
    const todas = ["todos", ...categorias()];
    todas.forEach(cat => {
      const nome = cat === "todos" ? "Todas" : cat;
      const opt = document.createElement("option");
      opt.value = cat; opt.textContent = cat === "todos" ? "Todas" : cat;
      selectCategoria.appendChild(opt);

      const b = document.createElement("button");
      b.type = "button"; b.textContent = nome; b.dataset.cat = cat;
      b.setAttribute("aria-pressed", cat === "todos" ? "true" : "false");
      if (cat === "todos") b.classList.add("active");
      b.addEventListener("click", () => definirCategoria(cat));
      pills.appendChild(b);
    });
  }

  function definirCategoria(cat) {
    estado.categoria = cat;
    selectCategoria.value = cat;
    pills.querySelectorAll("button").forEach(b => {
      const ativo = b.dataset.cat === cat;
      b.classList.toggle("active", ativo);
      b.setAttribute("aria-pressed", ativo ? "true" : "false");
    });
    renderizarProdutos();
  }

  function filtrar() {
    const termo = normalizar(estado.busca.trim());
    return PRODUCTS.filter(p => {
      if (estado.categoria !== "todos" && p.category !== estado.categoria) return false;
      if (!termo) return true;
      const texto = normalizar([p.name, p.description, p.category, (p.options || []).join(" ")].join(" "));
      return termo.split(/\s+/).every(t => texto.includes(t));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cartões de produto                                                   */
  /* ------------------------------------------------------------------ */
  function prepararImagem(box, produto) {
    const src = fotoProduto(produto);
    const semFoto = () => {
      box.classList.add("no-photo");
      box.innerHTML = '<img class="logo-fallback" src="imagens/logo.jpg" alt="" width="64" height="64" loading="lazy">';
    };
    if (!src) return semFoto();
    const img = new Image();
    img.alt = produto.name;
    img.decoding = "async";
    img.loading = "lazy";
    img.onload = () => {
      /* fotos "quase quadradas" preenchem o quadro; fotos muito altas/largas aparecem inteiras sobre fundo desfocado */
      const r = img.naturalWidth / img.naturalHeight;
      box.classList.add(r >= 0.75 && r <= 1.4 ? "fit-cover" : "fit-contain");
      /* URL absoluta: caminhos relativos dentro de variáveis CSS seriam resolvidos a partir de css/style.css */
      box.style.setProperty("--foto", 'url("' + new URL(src, document.baseURI).href + '")');
    };
    img.onerror = semFoto;
    img.src = src;
    box.appendChild(img);
  }

  function criarCartao(p) {
    const card = document.createElement("article");
    card.className = "product-card";
    const temOpcoes = p.options && p.options.length;
    const idSel = "opt-" + p.id;
    card.innerHTML =
      '<div class="product-image">' + (p.alcohol ? '<span class="badge-18" title="Venda proibida para menores de 18 anos">+18</span>' : "") + "</div>" +
      '<div class="product-content">' +
        '<span class="product-category">' + esc(p.category) + "</span>" +
        "<h3>" + esc(p.name) + "</h3>" +
        '<p class="product-desc">' + esc(p.description) + "</p>" +
        (p.note ? '<p class="product-note">' + esc(p.note) + "</p>" : "") +
        (temOpcoes
          ? '<label class="option-label" for="' + idSel + '">' + esc(p.optionLabel || "Escolha uma opção") + "</label>" +
            '<select class="option-select" id="' + idSel + '"><option value="">Selecione…</option>' +
            p.options.map(o => '<option value="' + esc(o) + '">' + esc(o) + "</option>").join("") + "</select>"
          : "") +
        '<div class="product-bottom">' +
          '<strong class="product-price">' + money(p.price) + "</strong>" +
          '<button class="add-button" type="button" aria-label="Adicionar ' + esc(p.name) + ' ao pedido">Adicionar <span aria-hidden="true">+</span></button>' +
        "</div>" +
      "</div>";

    prepararImagem(card.querySelector(".product-image"), p);

    const btn = card.querySelector(".add-button");
    const select = card.querySelector(".option-select");
    if (select) select.addEventListener("change", () => select.classList.remove("invalid"));

    btn.addEventListener("click", () => {
      let opcao = "";
      if (temOpcoes) {
        opcao = select.value;
        if (!opcao) {
          select.classList.add("invalid");
          select.focus();
          toast("Escolha uma opção antes de adicionar.");
          return;
        }
      }
      if (p.alcohol && !confirmarIdade()) return;
      const item = Carrinho.adicionar(p.id, opcao);
      atualizarContadores();
      if (!dialog.open) toast("✓ " + item.name + " adicionado ao pedido");
      else renderizarCarrinho();
      btn.classList.add("added");
      btn.firstChild.textContent = "Adicionado ";
      setTimeout(() => { btn.classList.remove("added"); btn.firstChild.textContent = "Adicionar "; }, 1200);
    });
    return card;
  }

  function confirmarIdade() {
    try { if (sessionStorage.getItem("barduleo.maior18") === "1") return true; } catch (e) { /* segue */ }
    const ok = window.confirm("Você confirma que tem 18 anos ou mais? A venda de bebidas alcoólicas é proibida para menores de 18 anos.");
    if (ok) { try { sessionStorage.setItem("barduleo.maior18", "1"); } catch (e) { /* ignora */ } }
    return ok;
  }

  function renderizarProdutos() {
    const lista = filtrar();
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    lista.forEach(p => frag.appendChild(criarCartao(p)));
    grid.appendChild(frag);
    $id("emptyProducts").hidden = lista.length > 0;
    $id("resultCount").textContent = lista.length === 1 ? "1 item" : lista.length + " itens";
  }

  /* ------------------------------------------------------------------ */
  /* Carrinho (janela)                                                    */
  /* ------------------------------------------------------------------ */
  function renderizarCarrinho() {
    const box = $id("cartItems");
    box.innerHTML = "";
    const vazio = Carrinho.itens.length === 0;
    $id("cartEmpty").hidden = !vazio;
    $id("cartFooter").hidden = vazio;
    Carrinho.itens.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML =
        '<div class="cart-line-info"><strong>' + esc(item.name) + "</strong>" +
        "<small>" + money(item.price) + " cada · " + formatCents(toCents(item.price) * item.quantity) + "</small></div>" +
        '<div class="quantity-controls">' +
          '<button type="button" aria-label="Diminuir quantidade de ' + esc(item.name) + '">−</button>' +
          '<span aria-live="polite">' + item.quantity + "</span>" +
          '<button type="button" aria-label="Aumentar quantidade de ' + esc(item.name) + '">+</button>' +
          '<button type="button" class="remove" aria-label="Remover ' + esc(item.name) + '">×</button>' +
        "</div>";
      const b = row.querySelectorAll("button");
      b[0].onclick = () => { Carrinho.alterar(item.id, item.option, -1); atualizarTudo(); };
      b[1].onclick = () => { Carrinho.alterar(item.id, item.option, +1); atualizarTudo(); };
      b[2].onclick = () => { Carrinho.remover(item.id, item.option); atualizarTudo(); };
      box.appendChild(row);
    });
    $id("cartSubtotal").textContent = formatCents(Carrinho.subtotalCents());
    const min = CONFIG.pedidoMinimoDelivery;
    const falta = toCents(min) - Carrinho.subtotalCents();
    const aviso = $id("minNotice");
    aviso.hidden = falta <= 0 || vazio;
    aviso.textContent = "Para delivery, o pedido mínimo é " + money(min) + ". Faltam " + formatCents(falta) + " (retirada no bar não tem mínimo).";
  }

  function atualizarTudo() { renderizarCarrinho(); atualizarContadores(); }

  function abrirCarrinho() {
    renderizarCarrinho();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function fecharCarrinho() { if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }

  /* ------------------------------------------------------------------ */
  /* Menu mobile, horário e status                                        */
  /* ------------------------------------------------------------------ */
  function configurarMenu() {
    const btn = $id("menuToggle");
    const nav = $id("mainNav");
    const fechar = () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Abrir menu"); };
    btn.addEventListener("click", () => {
      const aberto = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", aberto ? "true" : "false");
      btn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", fechar));
    document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 860) fechar(); });
  }

  function atualizarStatus() {
    const st = lojaStatus();
    document.querySelectorAll("[data-status]").forEach(el => {
      el.classList.toggle("is-open", st.aberto);
      el.classList.toggle("is-closed", !st.aberto);
      el.querySelector(".status-text").textContent = st.texto;
    });
    document.querySelectorAll(".status-detail").forEach(el => { el.textContent = st.detalhe; });
    const hoje = new Date().getDay();
    document.querySelectorAll("[data-dia]").forEach(li => li.classList.toggle("today", Number(li.dataset.dia) === hoje));
  }

  /* ------------------------------------------------------------------ */
  /* Início                                                               */
  /* ------------------------------------------------------------------ */
  function iniciar() {
    Carrinho.carregar();
    montarCategorias();
    renderizarProdutos();
    atualizarContadores();
    atualizarStatus();
    configurarMenu();
    setInterval(atualizarStatus, 60000);

    /* placeholder mais curto em telas estreitas */
    const ajustarPlaceholder = () => { inputBusca.placeholder = window.innerWidth <= 720 ? "Buscar…" : "Buscar no cardápio…"; };
    ajustarPlaceholder(); window.addEventListener("resize", ajustarPlaceholder);

    inputBusca.addEventListener("input", () => { estado.busca = inputBusca.value; renderizarProdutos(); });
    $id("clearSearch").addEventListener("click", () => {
      inputBusca.value = ""; estado.busca = ""; definirCategoria("todos"); inputBusca.focus();
    });
    selectCategoria.addEventListener("change", () => definirCategoria(selectCategoria.value));

    $id("openCart").addEventListener("click", abrirCarrinho);
    $id("cartBar").addEventListener("click", abrirCarrinho);
    $id("closeCart").addEventListener("click", fecharCarrinho);
    $id("keepShopping").addEventListener("click", fecharCarrinho);
    $id("emptyCartShop").addEventListener("click", fecharCarrinho);
    $id("clearCart").addEventListener("click", () => {
      if (window.confirm("Remover todos os itens do pedido?")) { Carrinho.limpar(); atualizarTudo(); }
    });
    $id("goCheckout").addEventListener("click", () => { if (Carrinho.itens.length) location.href = "checkout.html"; });
    /* clicar fora da janela fecha */
    dialog.addEventListener("click", e => { if (e.target === dialog) fecharCarrinho(); });

    /* mantém o carrinho sincronizado entre abas */
    window.addEventListener("storage", e => { if (e.key === CART_KEY) { Carrinho.carregar(); atualizarTudo(); } });
    /* volta do checkout pelo botão "voltar" do navegador */
    window.addEventListener("pageshow", ev => { if (ev.persisted) { Carrinho.carregar(); atualizarTudo(); } });
  }

  iniciar();
})();
