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
