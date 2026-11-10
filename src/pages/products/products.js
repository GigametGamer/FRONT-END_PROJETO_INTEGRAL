const produtos = [
    {
        id: "terrario-mini",
        nome: "Terrário Mini",
        categoria: "terrarios",
        descricao: "Um pequeno ecossistema decorativo para observar a natureza.",
        preco: 59.90,
        icone: "🪴",
        destaque: true
    },
    {
        id: "terrario-vidro",
        nome: "Terrário de Vidro",
        categoria: "terrarios",
        descricao: "Recipiente de vidro para montar seu próprio terrário.",
        preco: 89.90,
        icone: "🌱",
        destaque: true
    },
    {
        id: "lupa-escolar",
        nome: "Lupa de Observação",
        categoria: "materiais",
        descricao: "Apoio para observar detalhes de folhas, rochas e outros objetos.",
        preco: 24.90,
        icone: "🔎",
        destaque: true
    },
    {
        id: "kit-biologia",
        nome: "Kit de Estudos de Biologia",
        categoria: "materiais",
        descricao: "Materiais didáticos para acompanhar atividades de biologia.",
        preco: 74.90,
        icone: "🔬",
        destaque: false
    },
    {
        id: "caderno-ciencias",
        nome: "Caderno de Ciências",
        categoria: "educacao",
        descricao: "Caderno para anotações, observações e estudos.",
        preco: 29.90,
        icone: "📓",
        destaque: false
    },
    {
        id: "guia-natureza",
        nome: "Guia Ilustrado da Natureza",
        categoria: "educacao",
        descricao: "Material educativo para conhecer melhor o mundo natural.",
        preco: 39.90,
        icone: "📚",
        destaque: true
    }
];

const gradeProdutos = document.querySelector("#productsGrid");
const campoBusca = document.querySelector("#productsSearchInput");
const formularioBusca = document.querySelector("#productsSearchForm");
const filtroCategoria = document.querySelector("#categoryFilter");
const filtroOrdem = document.querySelector("#sortFilter");
const contadorProdutos = document.querySelector("#productsCount");
const semResultados = document.querySelector("#productsNoResults");
const limparFiltros = document.querySelector("#clearFiltersButton");

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

function atualizarCarrinho(itens) {
    localStorage.setItem("biostoreCart", JSON.stringify(itens));
    window.dispatchEvent(new Event("carrinhoAtualizado"));
    atualizarContadorCarrinho();
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
    const existente = itens.find(item => String(item.id ?? item.productId) === produto.id);

    if (existente) {
        existente.quantidade = Number(existente.quantidade ?? existente.quantity ?? 1) + 1;
    } else {
        itens.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            imagem: ""
        });
    }

    atualizarCarrinho(itens);
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
    imagem.textContent = produto.icone;

    const categoria = document.createElement("span");
    categoria.className = "product-card-category";
    categoria.textContent = {
        terrarios: "Terrários",
        materiais: "Materiais de Biologia",
        culturas: "Culturas",
        educacao: "Conteúdo educativo"
    }[produto.categoria];

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.className = "product-card-description";
    descricao.textContent = produto.descricao;

    const rodape = document.createElement("div");
    rodape.className = "product-card-footer";

    const preco = document.createElement("strong");
    preco.textContent = formatarMoeda(produto.preco);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "product-add-button";
    botao.dataset.add = produto.id;
    botao.textContent = "Adicionar ao carrinho";
    botao.addEventListener("click", () => adicionarAoCarrinho(produto));

    rodape.append(preco, botao);
    card.append(imagem, categoria, nome, descricao, rodape);
    return card;
}

function renderizarProdutos() {
    const termo = normalizarTexto(campoBusca.value.trim());
    const categoria = filtroCategoria.value;
    let filtrados = produtos.filter(produto => {
        const correspondeBusca = normalizarTexto(
            produto.nome + " " + produto.descricao + " " + produto.categoria
        ).includes(termo);
        const correspondeCategoria = categoria === "todas" || produto.categoria === categoria;
        return correspondeBusca && correspondeCategoria;
    });

    if (filtroOrdem.value === "name") {
        filtrados.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    } else if (filtroOrdem.value === "price-asc") {
        filtrados.sort((a, b) => a.preco - b.preco);
    } else if (filtroOrdem.value === "price-desc") {
        filtrados.sort((a, b) => b.preco - a.preco);
    } else {
        filtrados.sort((a, b) => Number(b.destaque) - Number(a.destaque));
    }

    gradeProdutos.replaceChildren(...filtrados.map(criarCard));
    contadorProdutos.textContent = filtrados.length + (filtrados.length === 1 ? " produto" : " produtos");
    semResultados.hidden = filtrados.length > 0;
    gradeProdutos.hidden = filtrados.length === 0;
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
renderizarProdutos();
window.addEventListener("storage", atualizarContadorCarrinho);
window.addEventListener("carrinhoAtualizado", atualizarContadorCarrinho);