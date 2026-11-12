const API_URL = "http://localhost:3000";

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
    formularioLogin.addEventListener("submit", async (event) => {
        event.preventDefault();
        mensagemLogin.textContent = "";

        if (!formularioLogin.reportValidity()) return;

        const botaoEnviar = formularioLogin.querySelector('button[type="submit"]');
        const textoOriginal = botaoEnviar.textContent;
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Entrando...";

        try {
            const resposta = await fetch(`${API_URL}/usuario/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: document.querySelector("#email").value.trim(),
                    senha: campoSenha.value
                })
            });

            const dados = await resposta.json().catch(() => ({}));
            if (!resposta.ok) {
                throw new Error(dados.erro || dados.mensagem || "Não foi possível entrar na sua conta.");
            }

            if (!dados.usuario?.id) {
                throw new Error("A API respondeu, mas não retornou os dados do usuário.");
            }

            localStorage.setItem("biostoreUsuario", JSON.stringify(dados.usuario));
            mensagemLogin.textContent = "Login realizado! Redirecionando...";
            const destino = new URLSearchParams(window.location.search).get("redirect");
            window.location.href = destino === "cart" ? "../cart/cart.html" : "../home/home.html";
        } catch (erro) {
            mensagemLogin.textContent = erro.message.includes("Failed to fetch")
                ? "Não foi possível conectar à API. Confira se o backend está ligado."
                : erro.message;
            mensagemLogin.classList.add("form-error");
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = textoOriginal;
        }
    });
}
