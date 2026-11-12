export default function validarId(req, res, next) {
    const { id } = req.params;
    if (id && isNaN(Number(id))) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }
    next();
}