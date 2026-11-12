export default function tratarErro(err, req, res, next) {
    console.error("Erro interno:", err);
    res.status(500).json({
        mensagem: "Erro interno no servidor.",
        detalhe: err.message
    });
}