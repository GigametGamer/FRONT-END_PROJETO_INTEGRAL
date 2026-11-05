const campoSenha = document.querySelector("#password");
const botaoMostrarSenha = document.querySelector("#togglePassword");

botaoMostrarSenha.addEventListener("click", () => {
    const senhaEstaOculta = campoSenha.type === "password";

    campoSenha.type = senhaEstaOculta ? "text" : "password";
    botaoMostrarSenha.textContent = senhaEstaOculta ? "Ocultar" : "Mostrar";
    botaoMostrarSenha.setAttribute("aria-label", senhaEstaOculta ? "Ocultar senha" : "Mostrar senha");
    botaoMostrarSenha.setAttribute("aria-pressed", String(senhaEstaOculta));
});
