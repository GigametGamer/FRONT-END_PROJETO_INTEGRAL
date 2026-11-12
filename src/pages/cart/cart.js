const API_URL = "http://localhost:3000";
const CHAVE_CARRINHO = "biostoreCart";
const CHAVE_USUARIO = "biostoreUsuario";
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
    mensagemFinalizar.textContent = itens.length
        ? "Entre na sua conta para registrar o pedido. O pagamento ainda não está integrado."
        : "Adicione produtos para montar seu pedido.";

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

botaoFinalizar.addEventListener("click", async () => {
    mensagemFinalizar.textContent = "";
    let usuario;

    try {
        usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));
    } catch {
        usuario = null;
    }

    if (!usuario?.id) {
        mensagemFinalizar.textContent = "Você precisa entrar na sua conta antes de finalizar o pedido.";
        window.location.href = "../login/login.html?redirect=cart";
        return;
    }

    const itens = lerCarrinho();
    if (!itens.length) return;

    const valorTotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
    const textoOriginal = botaoFinalizar.textContent;
    botaoFinalizar.disabled = true;
    botaoFinalizar.textContent = "Registrando pedido...";

    try {
        const respostaPedido = await fetch(`${API_URL}/pedido`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: Number(usuario.id),
                status: "Pendente",
                valor_total: Number(valorTotal.toFixed(2))
            })
        });

        const dadosPedido = await respostaPedido.json().catch(() => ({}));
        if (!respostaPedido.ok || !dadosPedido.id) {
            throw new Error(dadosPedido.erro || "Não foi possível registrar o pedido.");
        }

        for (const item of itens) {
            const respostaItem = await fetch(`${API_URL}/itensPedido`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pedido_id: Number(dadosPedido.id),
                    produto_id: Number(item.id),
                    quantidade: Number(item.quantidade),
                    preco_unitario: Number(item.preco)
                })
            });

            const dadosItem = await respostaItem.json().catch(() => ({}));
            if (!respostaItem.ok) {
                throw new Error(dadosItem.erro || `O pedido ${dadosPedido.id} foi criado, mas um item não pôde ser registrado. Entre em contato com a equipe da BioStore.`);
            }
        }

        salvarCarrinho([]);
        renderizarCarrinho();
        mensagemFinalizar.textContent = `Pedido #${dadosPedido.id} registrado com sucesso! Ele está pendente. O pagamento ainda precisa ser combinado/integrado.`;
    } catch (erro) {
        mensagemFinalizar.textContent = erro.message.includes("Failed to fetch")
            ? "Não foi possível conectar à API. Confira se o backend está ligado."
            : erro.message;
    } finally {
        botaoFinalizar.disabled = lerCarrinho().length === 0;
        botaoFinalizar.textContent = textoOriginal;
    }
});

window.addEventListener("storage", renderizarCarrinho);
window.addEventListener("carrinhoAtualizado", renderizarCarrinho);
renderizarCarrinho();
