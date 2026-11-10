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
