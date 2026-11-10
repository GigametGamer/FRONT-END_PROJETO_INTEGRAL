const campoSenha = document.querySelector("#password");
const botaoMostrarSenha = document.querySelector("#togglePassword");
const formularioLogin = document.querySelector("#loginForm");
const mensagemLogin = document.querySelector("#loginMessage");

if (botaoMostrarSenha && campoSenha) {
    botaoMostrarSenha.addEventListener("click", () => {
        const senhaEstaOculta = campoSenha.type === "password";
        campoSenha.type = senhaEstaOculta ? "text" : "password";
        botaoMostrarSenha.textContent = senhaEstaOculta ? "Ocultar" : "Mostrar";
        botaoMostrarSenha.setAttribute("aria-label", senhaEstaOculta ? "Ocultar senha" : "Mostrar senha");
        botaoMostrarSenha.setAttribute("aria-pressed", String(senhaEstaOculta));
    });
}

if (formularioLogin) {
    formularioLogin.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!formularioLogin.reportValidity()) return;
        mensagemLogin.textContent = "A tela está pronta, mas o login ainda precisa ser conectado à API para validar sua conta.";
    });
}