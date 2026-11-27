/* ==========================================================================
   BAR DU LÉO — FINALIZAR PEDIDO PELO WHATSAPP
   Ordem dos scripts: produtos.js → loja.js → checkout.js
   ========================================================================== */
(function () {
  "use strict";

  const form = $id("checkoutForm");
  const tipo = $id("deliveryType");
  const camposEndereco = $id("addressFields");
  const campos = ["customerName", "street", "number", "neighborhood", "payment", "changeFor"];

  /* ---------------- resumo do pedido ---------------- */
  function renderizarResumo() {
    const box = $id("checkoutSummary");
    box.innerHTML = "";
    const vazio = Carrinho.itens.length === 0;
    $id("emptyState").hidden = !vazio;
    $id("checkoutContent").hidden = vazio;
    if (vazio) return;

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
      b[0].onclick = () => { Carrinho.alterar(item.id, item.option, -1); renderizarResumo(); };
      b[1].onclick = () => { Carrinho.alterar(item.id, item.option, +1); renderizarResumo(); };
      b[2].onclick = () => { Carrinho.remover(item.id, item.option); renderizarResumo(); };
      box.appendChild(row);
    });
    atualizarTotais();
  }

  function atualizarTotais() {
    const delivery = tipo.value === "delivery";
    const sub = Carrinho.subtotalCents();
    $id("checkoutSubtotal").textContent = formatCents(sub);
    $id("deliveryFee").textContent = delivery ? "A confirmar" : "Sem entrega (retirada)";
    $id("checkoutTotal").textContent = formatCents(sub) + (delivery ? " + entrega" : "");
    const falta = toCents(CONFIG.pedidoMinimoDelivery) - sub;
    const aviso = $id("minNotice");
    aviso.hidden = !(delivery && falta > 0);
    aviso.textContent = "Pedido mínimo para delivery: " + money(CONFIG.pedidoMinimoDelivery) + ". Faltam " + formatCents(falta) + ".";
  }

  function aplicarTipoEntrega() {
    const delivery = tipo.value === "delivery";
    camposEndereco.hidden = !delivery;
    ["street", "number", "neighborhood"].forEach(id => { $id(id).required = delivery; });
    atualizarTotais();
  }

  function aplicarPagamento() {
    const dinheiro = $id("payment").value === "Dinheiro";
    $id("changeField").hidden = !dinheiro;
    if (!dinheiro) $id("changeFor").value = "";
  }

  function mostrarStatusLoja() {
    const st = lojaStatus();
    const el = $id("statusNotice");
    if (st.aberto) { el.hidden = true; return; }
    el.hidden = false;
    el.textContent = st.texto + ". " + st.detalhe + (CONFIG.bloquearForaDoHorario
      ? " No momento não é possível enviar pedidos."
      : " Você pode enviar o pedido mesmo assim; ele será atendido quando abrirmos.");
  }

  /* ---------------- validação ---------------- */
  function erro(id, msg) {
    const input = $id(id);
    const span = $id("err-" + id);
    if (span) span.textContent = msg || "";
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function validar() {
    const delivery = tipo.value === "delivery";
    const sub = Carrinho.subtotalCents();
    let ok = true, primeiro = null;
    const marca = (id, msg) => { const v = erro(id, msg); if (!v && !primeiro) primeiro = id; ok = ok && v; };

    marca("customerName", limparTexto($id("customerName").value, 80).length < 2 ? "Informe seu nome." : "");
    if (delivery) {
      marca("street", limparTexto($id("street").value, 100) ? "" : "Informe a rua.");
      marca("number", limparTexto($id("number").value, 15) ? "" : "Informe o número.");
      marca("neighborhood", limparTexto($id("neighborhood").value, 60) ? "" : "Informe o bairro.");
    } else {
      ["street", "number", "neighborhood"].forEach(id => erro(id, ""));
    }
    marca("payment", $id("payment").value ? "" : "Escolha a forma de pagamento.");

    const troco = $id("changeFor").value;
    if ($id("payment").value === "Dinheiro" && troco !== "") {
      const t = toCents(troco);
      marca("changeFor", !(t > 0) ? "Valor inválido." : t < sub ? "O troco deve ser maior ou igual ao total do pedido (" + formatCents(sub) + ")." : "");
    } else erro("changeFor", "");

    const aviso = $id("formError");
    aviso.textContent = "";
    if (Carrinho.itens.length === 0) { aviso.textContent = "Seu pedido está vazio."; ok = false; }
    else if (delivery && sub < toCents(CONFIG.pedidoMinimoDelivery)) {
      aviso.textContent = "O pedido mínimo para delivery é " + money(CONFIG.pedidoMinimoDelivery) + ". Adicione mais itens ou escolha retirada no bar.";
      ok = false;
    }
    if (CONFIG.bloquearForaDoHorario && !lojaStatus().aberto) {
      aviso.textContent = "Estamos fechados no momento. " + lojaStatus().detalhe;
      ok = false;
    }
    if (primeiro) $id(primeiro).focus();
    return ok;
  }

  /* ---------------- envio ---------------- */
  function coletarPedido() {
    const delivery = tipo.value === "delivery";
    const cep = $id("cep").value.replace(/\D/g, "");
    return {
      nome: limparTexto($id("customerName").value, 80),
      entrega: delivery ? "delivery" : "retirada",
      endereco: delivery ? {
        cep: cep.length === 8 ? cep.slice(0, 5) + "-" + cep.slice(5) : "",
        rua: limparTexto($id("street").value, 100),
        numero: limparTexto($id("number").value, 15),
        bairro: limparTexto($id("neighborhood").value, 60),
        complemento: limparTexto($id("complement").value, 60),
        referencia: limparTexto($id("reference").value, 100)
      } : null,
      pagamento: $id("payment").value,
      troco: $id("changeFor").value,
      observacoes: limparTexto($id("notes").value, 500)
    };
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validar()) return;

    const itens = Carrinho.itens.map(i => ({ ...i }));
    const url = urlWhatsApp(montarMensagem(itens, coletarPedido()));

    /* abre o WhatsApp em nova aba; se o navegador bloquear, navega na própria página.
       (não usar a opção "noopener" aqui: ela faz window.open devolver sempre null) */
    const nova = window.open(url, "_blank");
    if (nova) { try { nova.opener = null; } catch (err) { /* ignora */ } }
    $id("sentPanel").hidden = false;
    $id("waAgain").href = url;
    $id("checkoutContent").hidden = true;
    $id("sentPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    if (!nova) window.location.href = url;
  });

  $id("newOrder").addEventListener("click", () => { Carrinho.limpar(); window.location.href = "index.html#cardapio"; });

  tipo.addEventListener("change", aplicarTipoEntrega);
  $id("payment").addEventListener("change", aplicarPagamento);
  campos.forEach(id => { const el = $id(id); if (el) el.addEventListener("input", () => erro(id, "")); });

  $id("cep").addEventListener("input", e => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 8);
    e.target.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  });

  Carrinho.carregar();
  renderizarResumo();
  aplicarTipoEntrega();
  aplicarPagamento();
  mostrarStatusLoja();
})();
