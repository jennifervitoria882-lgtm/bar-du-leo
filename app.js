/* BAR DU LÉO — LOJA */

let ALL = getProducts();
let cart = lerJSON("leoCart", []).filter(i => i && Number.isFinite(Number(i.price)) && Number(i.quantity) > 0);
let activeCategory = "todos";

const grid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const pills = document.getElementById("categoryPills");

function saveCart() {
  localStorage.setItem("leoCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cartCount").textContent =
    cart.reduce((s, i) => s + i.quantity, 0);
}

function setActivePill(btn) {
  pills.querySelectorAll("button").forEach(b =>
    b.classList.toggle("active", b === btn)
  );
}

function renderCategories() {
  const categories = [...new Set(ALL.map(p => p.category))];

  const all = document.createElement("button");
  all.type = "button";
  all.textContent = "Todas";
  all.className = "active";

  all.addEventListener("click", () => {
    activeCategory = "todos";
    categoryFilter.value = "todos";
    renderProducts();
    setActivePill(all);
  });

  pills.appendChild(all);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);

    const b = document.createElement("button");
    b.type = "button";
    b.textContent = category;

    b.addEventListener("click", () => {
      activeCategory = category;
      categoryFilter.value = category;
      renderProducts();
      setActivePill(b);
    });

    pills.appendChild(b);
  });
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const selected = categoryFilter.value;

  const filtered = ALL.filter(p => {
    const sabores = p.flavors ? p.flavors.join(" ") : "";

    return (
      (selected === "todos" || p.category === selected) &&
      (activeCategory === "todos" || p.category === activeCategory) &&
      (`${p.name} ${p.description || ""} ${sabores}`)
        .toLowerCase()
        .includes(term)
    );
  });

  grid.innerHTML = "";

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image"></div>

      <div class="product-content">
        <span class="product-category">
          ${esc(product.category)}
        </span>

        <h3>${esc(product.name)}</h3>

        <p>${esc(product.description || "")}</p>

        ${
          product.flavors && product.flavors.length
            ? `
              <label class="flavor-label" for="flavor-${product.id}">
                Escolha o sabor:
              </label>

              <select class="flavor-select" id="flavor-${product.id}">
                <option value="">Selecione um sabor</option>
                ${product.flavors.map(flavor =>
                  `<option value="${esc(flavor)}">${esc(flavor)}</option>`
                ).join("")}
              </select>
            `
            : ""
        }

        <div class="product-bottom">
          <strong class="product-price">
            ${money(product.price)}
          </strong>

          <button class="add-button" type="button">
            ${product.soldOut ? "Esgotado" : "Adicionar +"}
          </button>
        </div>
      </div>
    `;

    const box = card.querySelector(".product-image");
    const img = criarImg(product);

    img.loading = "lazy";
    img.classList.add("foto-" + slugify(product.name));

    img.addEventListener("semfoto", () => {
      img.remove();
      box.textContent = "Foto indisponível";
    });

    img.alt = product.name;
    box.appendChild(img);

    const btn = card.querySelector(".add-button");

    if (product.soldOut) {
      btn.disabled = true;
      btn.style.opacity = ".5";
      btn.style.cursor = "not-allowed";
    } else {
      btn.addEventListener("click", () => {
        let flavor = "";

        if (product.flavors && product.flavors.length) {
          const select = card.querySelector(".flavor-select");
          flavor = select.value;

          if (!flavor) {
            alert("Escolha um sabor antes de adicionar ao carrinho.");
            select.focus();
            return;
          }
        }

        addToCart(product.id, flavor);
      });
    }

    grid.appendChild(card);
  });

  document.getElementById("emptyProducts").hidden =
    filtered.length > 0;
}

function addToCart(id, flavor = "") {
  const product = ALL.find(p => p.id === id);

  if (!product || product.soldOut) return;

  if (
    product.alcohol &&
    sessionStorage.getItem("leoMaior18") !== "1"
  ) {
    if (!confirm(
      "Você confirma que tem 18 anos ou mais? A venda de bebidas alcoólicas é proibida para menores de 18 anos."
    )) return;

    sessionStorage.setItem("leoMaior18", "1");
  }

  // Cada sabor de pastel fica separado no carrinho.
  const item = cart.find(i =>
    i.id === id && (i.flavor || "") === flavor
  );

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: flavor
        ? `${product.name} - ${flavor}`
        : product.name,
      flavor: flavor,
      price: product.price,
      alcohol: !!product.alcohol,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  const cartButton = document.getElementById("openCart");
  cartButton.setAttribute("aria-label", "Meu pedido atualizado");
  window.setTimeout(() => cartButton.removeAttribute("aria-label"), 1800);
}

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML =
      '<p class="muted">Seu carrinho está vazio.</p>';
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-line";

    row.innerHTML = `
      <div>
        <strong>${esc(item.name)}</strong>
        <small>${money(item.price)} cada</small>
      </div>

      <div class="quantity-controls">
        <button aria-label="Diminuir">−</button>
        <span>${item.quantity}</span>
        <button aria-label="Aumentar">+</button>
        <button aria-label="Remover">×</button>
      </div>
    `;

    const buttons = row.querySelectorAll("button");

    buttons[0].onclick = () =>
      changeQuantity(item.id, item.flavor || "", -1);

    buttons[1].onclick = () =>
      changeQuantity(item.id, item.flavor || "", 1);

    buttons[2].onclick = () => {
      cart = cart.filter(i =>
        !(i.id === item.id &&
          (i.flavor || "") === (item.flavor || ""))
      );

      saveCart();
      renderCart();
    };

    container.appendChild(row);
  });

  document.getElementById("cartSubtotal").textContent =
    money(cart.reduce((s, i) => s + i.price * i.quantity, 0));

  document.getElementById("goCheckout").disabled =
    cart.length === 0;
}

function changeQuantity(id, flavor, delta) {
  const item = cart.find(i =>
    i.id === id && (i.flavor || "") === flavor
  );

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(i =>
      !(i.id === id && (i.flavor || "") === flavor)
    );
  }

  saveCart();
  renderCart();
}

document.getElementById("openCart").onclick = () => {
  renderCart();
  document.getElementById("cartDialog").showModal();
};

document.getElementById("closeCart").onclick = () =>
  document.getElementById("cartDialog").close();

document.getElementById("goCheckout").onclick = () => {
  if (!cart.length) return;
  location.href = "checkout.html";
};

categoryFilter.addEventListener("change", () => {
  activeCategory = "todos";

  pills.querySelectorAll("button").forEach(b =>
    b.classList.remove("active")
  );

  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

renderCategories();
renderProducts();
updateCartCount();