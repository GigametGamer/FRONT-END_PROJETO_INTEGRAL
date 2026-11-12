export default function tratarErro(err, req, res, next) {
    console.error("Erro interno:", err);

    if (res.headersSent) return next(err);

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ erro: "Já existe um registro com esses dados." });
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({ erro: "Não é possível concluir: existem registros relacionados." });
    }

    return res.status(500).json({ erro: "Erro interno no servidor." });
}
