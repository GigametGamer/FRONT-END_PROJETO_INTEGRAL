const formularioCadastro = document.querySelector("#registerForm");
const campoSenha = document.querySelector("#password");
const campoConfirmarSenha = document.querySelector("#confirmPassword");
const mensagemErro = document.querySelector("#formError");

const botaoMostrarSenha = document.querySelector("#togglePassword");
const botaoMostrarConfirmacao = document.querySelector("#toggleConfirmPassword");

function configurarVisibilidadeSenha(campo, botao, textoAria) {
    botao.addEventListener("click", () => {
        const senhaEstaOculta = campo.type === "password";

        campo.type = senhaEstaOculta ? "text" : "password";
        botao.textContent = senhaEstaOculta ? "Ocultar" : "Mostrar";
        botao.setAttribute("aria-label", senhaEstaOculta ? `Ocultar ${textoAria}` : `Mostrar ${textoAria}`);
        botao.setAttribute("aria-pressed", String(senhaEstaOculta));
    });
}

configurarVisibilidadeSenha(campoSenha, botaoMostrarSenha, "senha");
configurarVisibilidadeSenha(campoConfirmarSenha, botaoMostrarConfirmacao, "confirmação de senha");

formularioCadastro.addEventListener("submit", (event) => {
    event.preventDefault();
    mensagemErro.textContent = "";

    if (campoSenha.value !== campoConfirmarSenha.value) {
        mensagemErro.textContent = "As senhas não coincidem. Confira os campos e tente novamente.";
        campoConfirmarSenha.focus();
        return;
    }

    // Demonstração: ainda não existe integração com banco de dados.
    window.location.href = "../home/home.html";
});