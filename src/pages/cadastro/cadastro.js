const API_URL = "http://localhost:3000";

const formularioCadastro = document.querySelector("#registerForm");
const campoNome = document.querySelector("#name");
const campoEmail = document.querySelector("#email");
const campoSenha = document.querySelector("#password");
const campoConfirmarSenha = document.querySelector("#confirmPassword");
const mensagemErro = document.querySelector("#formError");
const mensagemSucesso = document.querySelector("#formSuccess");
const botaoMostrarSenha = document.querySelector("#togglePassword");
const botaoMostrarConfirmacao = document.querySelector("#toggleConfirmPassword");

function configurarVisibilidadeSenha(campo, botao, textoAria) {
    if (!campo || !botao) return;
    botao.addEventListener("click", () => {
        const senhaEstaOculta = campo.type === "password";
        campo.type = senhaEstaOculta ? "text" : "password";
        botao.textContent = senhaEstaOculta ? "Ocultar" : "Mostrar";
        botao.setAttribute("aria-label", senhaEstaOculta ? "Ocultar " + textoAria : "Mostrar " + textoAria);
        botao.setAttribute("aria-pressed", String(senhaEstaOculta));
    });
}

configurarVisibilidadeSenha(campoSenha, botaoMostrarSenha, "senha");
configurarVisibilidadeSenha(campoConfirmarSenha, botaoMostrarConfirmacao, "confirmação de senha");

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", async (event) => {
        event.preventDefault();
        mensagemErro.textContent = "";
        mensagemSucesso.textContent = "";

        if (!formularioCadastro.reportValidity()) return;
        if (campoSenha.value !== campoConfirmarSenha.value) {
            mensagemErro.textContent = "As senhas não coincidem. Confira os campos e tente novamente.";
            campoConfirmarSenha.focus();
            return;
        }

        if (campoSenha.value.length < 8) {
            mensagemErro.textContent = "A senha precisa ter pelo menos 8 caracteres.";
            campoSenha.focus();
            return;
        }

        const botaoEnviar = formularioCadastro.querySelector('button[type="submit"]');
        const textoOriginal = botaoEnviar.textContent;
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Cadastrando...";

        try {
            const resposta = await fetch(`${API_URL}/usuario`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: campoNome.value.trim(),
                    email: campoEmail.value.trim(),
                    senha: campoSenha.value
                })
            });

            const dados = await resposta.json().catch(() => ({}));
            if (!resposta.ok) {
                throw new Error(dados.erro || dados.mensagem || "Não foi possível criar sua conta.");
            }

            mensagemSucesso.textContent = "Cadastro realizado com sucesso! Você será direcionado para entrar.";
            formularioCadastro.reset();
            setTimeout(() => {
                window.location.href = "../login/login.html";
            }, 1400);
        } catch (erro) {
            mensagemErro.textContent = erro.message.includes("Failed to fetch")
                ? "Não foi possível conectar à API. Confira se o backend está ligado."
                : erro.message;
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = textoOriginal;
        }
    });
}
