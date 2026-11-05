const campoSenha = document.querySelector("#password");
const botaoMostrarSenha = document.querySelector("#togglePassword");
const formularioLogin = document.querySelector("#loginForm");

botaoMostrarSenha.addEventListener("click", () => {
    const senhaEstaOculta = campoSenha.type === "password";

    campoSenha.type = senhaEstaOculta ? "text" : "password";
    botaoMostrarSenha.textContent = senhaEstaOculta ? "Ocultar" : "Mostrar";
    botaoMostrarSenha.setAttribute("aria-label", senhaEstaOculta ? "Ocultar senha" : "Mostrar senha");
    botaoMostrarSenha.setAttribute("aria-pressed", String(senhaEstaOculta));
});

formularioLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "../home/home.html";
});
