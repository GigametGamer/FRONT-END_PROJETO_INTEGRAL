const CHAVE_CARRINHO = "biostoreCart";
const listaCarrinho = document.querySelector("#cartItems");
const estadoVazio = document.querySelector("#cartEmpty");
const contadorItens = document.querySelector("#cartItemsCount");
const subtotalElemento = document.querySelector("#cartSubtotal");
const totalElemento = document.querySelector("#cartTotal");
const botaoLimpar = document.querySelector("#clearCartButton");
const botaoFinalizar = document.querySelector("#checkoutButton");
const mensagemFinalizar = document.querySelector("#checkoutMessage");

function lerCarrinho() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
        const itens = Array.isArray(salvo) ? salvo : (Array.isArray(salvo.items) ? salvo.items : []);
        return itens.map((item, indice) => ({
            ...item,
            id: String(item.id ?? item.productId ?? indice),
            nome: String(item.nome ?? item.name ?? item.titulo ?? "Produto BioStore"),
            preco: Math.max(0, Number(item.preco ?? item.price ?? 0) || 0),
            quantidade: Math.max(1, Math.floor(Number(item.quantidade ?? item.quantity ?? 1) || 1)),
            imagem: item.imagem ?? item.image ?? item.img ?? ""
        }));
    } catch (erro) {
        console.error("Erro ao carregar o carrinho:", erro);
        return [];
    }
}

function salvarCarrinho(itens) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    window.dispatchEvent(new Event("carrinhoAtualizado"));
}

function moeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function elemento(tag, classe, texto) {
    const node = document.createElement(tag);
    if (classe) node.className = classe;
    if (texto !== undefined) node.textContent = texto;
    return node;
}

function renderizarCarrinho() {
    const itens = lerCarrinho();
    const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);
    const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

    listaCarrinho.replaceChildren();
    estadoVazio.hidden = itens.length > 0;
    listaCarrinho.hidden = itens.length === 0;
    contadorItens.textContent = quantidadeTotal + (quantidadeTotal === 1 ? " item" : " itens");
    subtotalElemento.textContent = moeda(subtotal);
    totalElemento.textContent = moeda(subtotal);
    botaoLimpar.disabled = itens.length === 0;
    botaoFinalizar.disabled = itens.length === 0;

    itens.forEach((item) => {
        const linha = elemento("article", "cart-item");
        const imagem = elemento("div", "cart-item-image", item.imagem ? "" : "🌿");

        if (item.imagem) {
            const img = document.createElement("img");
            img.src = item.imagem;
            img.alt = item.nome;
            img.loading = "lazy";
            img.addEventListener("error", () => imagem.replaceChildren(document.createTextNode("🌿")));
            imagem.append(img);
        }

        const detalhes = elemento("div", "cart-item-details");
        detalhes.append(elemento("h3", "", item.nome), elemento("p", "cart-item-price", moeda(item.preco)));

        const acoes = elemento("div", "cart-item-actions");
        const quantidade = elemento("div", "cart-quantity");
        const diminuir = elemento("button", "", "−");
        const numero = elemento("span", "", String(item.quantidade));
        const aumentar = elemento("button", "", "+");
        diminuir.type = aumentar.type = "button";
        diminuir.disabled = item.quantidade <= 1;
        diminuir.setAttribute("aria-label", "Diminuir quantidade de " + item.nome);
        aumentar.setAttribute("aria-label", "Aumentar quantidade de " + item.nome);
        diminuir.addEventListener("click", () => alterarQuantidade(item.id, -1));
        aumentar.addEventListener("click", () => alterarQuantidade(item.id, 1));
        quantidade.append(diminuir, numero, aumentar);

        const remover = elemento("button", "cart-remove-button", "Remover");
        remover.type = "button";
        remover.addEventListener("click", () => removerItem(item.id));
        acoes.append(quantidade, remover);

        linha.append(imagem, detalhes, acoes, elemento("strong", "cart-item-total", moeda(item.preco * item.quantidade)));
        listaCarrinho.append(linha);
    });
}

function alterarQuantidade(id, variacao) {
    const itens = lerCarrinho().map((item) => {
        if (item.id === id) item.quantidade = Math.max(1, item.quantidade + variacao);
        return item;
    });
    salvarCarrinho(itens);
    renderizarCarrinho();
}

function removerItem(id) {
    salvarCarrinho(lerCarrinho().filter((item) => item.id !== id));
    renderizarCarrinho();
}

botaoLimpar.addEventListener("click", () => {
    salvarCarrinho([]);
    renderizarCarrinho();
});

botaoFinalizar.addEventListener("click", () => {
    mensagemFinalizar.textContent = "O carrinho está pronto, mas a etapa de pagamento ainda não foi integrada.";
});

window.addEventListener("storage", renderizarCarrinho);
window.addEventListener("carrinhoAtualizado", renderizarCarrinho);
renderizarCarrinho();