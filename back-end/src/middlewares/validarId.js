export default function validarId(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido. Informe um número inteiro positivo." });
    }

    req.id = id;
    return next();
}
