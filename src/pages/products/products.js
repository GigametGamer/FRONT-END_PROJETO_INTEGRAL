const API_URL = "http://localhost:3000";
let produtos = [];

const gradeProdutos = document.querySelector("#productsGrid");
const campoBusca = document.querySelector("#productsSearchInput");
const formularioBusca = document.querySelector("#productsSearchForm");
const filtroCategoria = document.querySelector("#categoryFilter");
const filtroOrdem = document.querySelector("#sortFilter");
const contadorProdutos = document.querySelector("#productsCount");
const semResultados = document.querySelector("#productsNoResults");
const limparFiltros = document.querySelector("#clearFiltersButton");

const categoriasSlug = {
    "terrarios": "terrarios",
    "materiais de biologia": "materiais",
    "culturas": "culturas",
    "conteudo educativo": "educacao"
};

const iconesCategoria = {
    terrarios: "🪴",
    materiais: "🔬",
    culturas: "🧫",
    educacao: "📚"
};

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizarTexto(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function lerCarrinho() {
    try {
        const salvo = JSON.parse(localStorage.getItem("biostoreCart")) || [];
        if (Array.isArray(salvo)) return salvo;
        return Array.isArray(salvo.items) ? salvo.items : [];
    } catch {
        return [];
    }
}

function atualizarContadorCarrinho() {
    const contador = document.querySelector("#cartCount");
    if (!contador) return;
    const quantidade = lerCarrinho().reduce((total, item) => {
        return total + Math.max(0, Number(item.quantidade ?? item.quantity ?? 1) || 0);
    }, 0);
    contador.textContent = quantidade > 99 ? "99+" : String(quantidade);
}

function adicionarAoCarrinho(produto) {
    const itens = lerCarrinho();
    const existente = itens.find(item => Number(item.id ?? item.productId) === Number(produto.id));

    if (existente) {
        existente.quantidade = Number(existente.quantidade ?? existente.quantity ?? 1) + 1;
    } else {
        itens.push({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidade: 1,
            imagem: ""
        });
    }

    localStorage.setItem("biostoreCart", JSON.stringify(itens));
    window.dispatchEvent(new Event("carrinhoAtualizado"));
    atualizarContadorCarrinho();

    const botao = gradeProdutos.querySelector('[data-add="' + produto.id + '"]');
    if (botao) {
        botao.textContent = "Adicionado ✓";
        setTimeout(() => { if (botao.isConnected) botao.textContent = "Adicionar ao carrinho"; }, 1100);
    }
}

function criarCard(produto) {
    const card = document.createElement("article");
    card.className = "product-card";

    const imagem = document.createElement("div");
    imagem.className = "product-card-image";
    imagem.setAttribute("aria-hidden", "true");
    imagem.textContent = iconesCategoria[produto.categoria] || "🌿";

    const categoria = document.createElement("span");
    categoria.className = "product-card-category";
    categoria.textContent = produto.categoriaNome;

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.className = "product-card-description";
    descricao.textContent = produto.descricao || "Produto BioStore.";

    const rodape = document.createElement("div");
    rodape.className = "product-card-footer";

    const preco = document.createElement("strong");
    preco.textContent = formatarMoeda(produto.preco);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "product-add-button";
    botao.dataset.add = produto.id;
    botao.textContent = "Adicionar ao carrinho";
    botao.disabled = Number(produto.estoque) <= 0;
    if (botao.disabled) botao.textContent = "Sem estoque";
    botao.addEventListener("click", () => adicionarAoCarrinho(produto));

    rodape.append(preco, botao);
    card.append(imagem, categoria, nome, descricao, rodape);
    return card;
}

function renderizarProdutos() {
    const termo = normalizarTexto(campoBusca.value.trim());
    const categoria = filtroCategoria.value;

    let filtrados = produtos.filter(produto => {
        const texto = normalizarTexto(produto.nome + " " + produto.descricao + " " + produto.categoriaNome);
        return texto.includes(termo) && (categoria === "todas" || produto.categoria === categoria);
    });

    if (filtroOrdem.value === "name") {
        filtrados.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    } else if (filtroOrdem.value === "price-asc") {
        filtrados.sort((a, b) => Number(a.preco) - Number(b.preco));
    } else if (filtroOrdem.value === "price-desc") {
        filtrados.sort((a, b) => Number(b.preco) - Number(a.preco));
    }

    gradeProdutos.replaceChildren(...filtrados.map(criarCard));
    contadorProdutos.textContent = filtrados.length + (filtrados.length === 1 ? " produto" : " produtos");
    semResultados.hidden = filtrados.length > 0;
    gradeProdutos.hidden = filtrados.length === 0;
}

async function carregarProdutos() {
    gradeProdutos.innerHTML = "<p>Carregando produtos...</p>";
    try {
        const resposta = await fetch(`${API_URL}/produto`);
        if (!resposta.ok) throw new Error("A API não conseguiu carregar os produtos.");
        const dados = await resposta.json();

        produtos = dados.map(item => {
            const categoriaNome = item.categoria || "Outros";
            const categoria = categoriasSlug[normalizarTexto(categoriaNome)] || "outros";
            return {
                id: Number(item.id),
                nome: item.nome,
                descricao: item.descricao,
                preco: Number(item.preco),
                estoque: Number(item.estoque),
                categoria,
                categoriaNome
            };
        });

        renderizarProdutos();
    } catch (erro) {
        gradeProdutos.replaceChildren();
        semResultados.hidden = false;
        semResultados.querySelector("h2").textContent = "Não foi possível carregar os produtos";
        semResultados.querySelector("p").textContent = erro.message.includes("Failed to fetch")
            ? "Confira se o MariaDB e o backend estão ligados."
            : erro.message;
        contadorProdutos.textContent = "0 produtos";
    }
}

formularioBusca.addEventListener("submit", event => {
    event.preventDefault();
    renderizarProdutos();
});
campoBusca.addEventListener("input", renderizarProdutos);
filtroCategoria.addEventListener("change", renderizarProdutos);
filtroOrdem.addEventListener("change", renderizarProdutos);

limparFiltros.addEventListener("click", () => {
    campoBusca.value = "";
    filtroCategoria.value = "todas";
    filtroOrdem.value = "featured";
    renderizarProdutos();
});

const parametros = new URLSearchParams(window.location.search);
campoBusca.value = parametros.get("q") || "";
const categoriaInicial = parametros.get("categoria");
if (["terrarios", "materiais", "culturas", "educacao"].includes(categoriaInicial)) {
    filtroCategoria.value = categoriaInicial;
}

atualizarContadorCarrinho();
carregarProdutos();
window.addEventListener("storage", atualizarContadorCarrinho);
window.addEventListener("carrinhoAtualizado", atualizarContadorCarrinho);
