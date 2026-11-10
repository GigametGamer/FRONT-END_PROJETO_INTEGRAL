const menuToggle = document.querySelector("#menuToggle");
const homeNav = document.querySelector("#homeNav");

if (menuToggle && homeNav) {
    menuToggle.addEventListener("click", () => {
        const menuEstaAberto = homeNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(menuEstaAberto));
        menuToggle.setAttribute("aria-label", menuEstaAberto ? "Fechar menu" : "Abrir menu");
    });

    homeNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            homeNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        });
    });
}


// Atualiza a quantidade de itens exibida no botão flutuante do carrinho.
function atualizarContadorCarrinho() {
    const contador = document.querySelector("#cartCount");
    if (!contador) return;

    try {
        const carrinhoSalvo = JSON.parse(localStorage.getItem("biostoreCart")) || [];
        const itens = Array.isArray(carrinhoSalvo)
            ? carrinhoSalvo
            : (Array.isArray(carrinhoSalvo.items) ? carrinhoSalvo.items : []);

        const quantidade = itens.reduce((total, item) => {
            const qtd = Number(item.quantidade ?? item.quantity ?? 1);
            return total + (Number.isFinite(qtd) && qtd > 0 ? qtd : 0);
        }, 0);

        contador.textContent = quantidade > 99 ? "99+" : String(quantidade);
    } catch (erro) {
        contador.textContent = "0";
        console.error("Não foi possível ler os itens do carrinho:", erro);
    }
}

atualizarContadorCarrinho();
window.addEventListener("storage", atualizarContadorCarrinho);
window.addEventListener("carrinhoAtualizado", atualizarContadorCarrinho);


// Carrossel de categorias: mostra três cards por vez em telas grandes.
const categoryTrack = document.querySelector("#categoryTrack");
const categoryPrev = document.querySelector("#categoryPrev");
const categoryNext = document.querySelector("#categoryNext");

if (categoryTrack && categoryPrev && categoryNext) {
    const categoryCards = Array.from(categoryTrack.querySelectorAll(".home-category-card"));
    let categoryIndex = 0;

    function quantidadeVisivelCategorias() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function atualizarCarrosselCategorias() {
        const maxIndex = Math.max(0, categoryCards.length - quantidadeVisivelCategorias());
        categoryIndex = Math.min(categoryIndex, maxIndex);

        const deslocamento = categoryCards[categoryIndex]?.offsetLeft || 0;
        categoryTrack.style.transform = `translateX(-${deslocamento}px)`;

        categoryPrev.disabled = categoryIndex === 0;
        categoryNext.disabled = categoryIndex >= maxIndex;
    }

    categoryPrev.addEventListener("click", () => {
        categoryIndex = Math.max(0, categoryIndex - 1);
        atualizarCarrosselCategorias();
    });

    categoryNext.addEventListener("click", () => {
        const maxIndex = Math.max(0, categoryCards.length - quantidadeVisivelCategorias());
        categoryIndex = Math.min(maxIndex, categoryIndex + 1);
        atualizarCarrosselCategorias();
    });

    window.addEventListener("resize", atualizarCarrosselCategorias);
    atualizarCarrosselCategorias();
}
