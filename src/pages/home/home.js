const menuToggle = document.querySelector("#menuToggle");
const homeNav = document.querySelector("#homeNav");
const categorySearch = document.querySelector("#categorySearch");
const categoryCards = document.querySelectorAll(".category-card");
const noCategoryResults = document.querySelector("#noCategoryResults");

if (menuToggle && homeNav) {
    menuToggle.addEventListener("click", () => {
        const menuEstaAberto = homeNav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(menuEstaAberto));
        menuToggle.setAttribute(
            "aria-label",
            menuEstaAberto ? "Fechar menu" : "Abrir menu"
        );
    });

    homeNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            homeNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        });
    });
}

if (categorySearch) {
    categorySearch.addEventListener("input", () => {
        const termo = categorySearch.value.trim().toLowerCase();
        let categoriasVisiveis = 0;

        categoryCards.forEach((card) => {
            const nomeCategoria = card.dataset.category;
            const corresponde = nomeCategoria.includes(termo);

            card.hidden = !corresponde;

            if (corresponde) {
                categoriasVisiveis++;
            }
        });

        noCategoryResults.hidden = categoriasVisiveis > 0;
    });
}
