import * as produtoModel from "../models/produtoModel.js";
import { textoValido, inteiroPositivo, inteiroNaoNegativo, numeroNaoNegativo } from "../utils/validacoes.js";
const validarDados = ({ categoria_id, fornecedor_id, nome, descricao, preco, estoque }) =>
    inteiroPositivo(categoria_id) && inteiroPositivo(fornecedor_id) && textoValido(nome, 560) &&
    textoValido(descricao, 560) && numeroNaoNegativo(preco) && inteiroNaoNegativo(estoque);
export function listar(req, res, next) {
    produtoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}
export function buscarPorId(req, res, next) {
    produtoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Produto não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}
export function criar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe categoria_id, fornecedor_id, nome, descrição, preço não negativo e estoque inteiro não negativo." });
    produtoModel.criar(dados, (erro, resultado) => erro ? next(erro) : res.status(201).json({ mensagem: "Produto cadastrado com sucesso.", id: resultado.insertId }));
}
export function atualizar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe categoria_id, fornecedor_id, nome, descrição, preço não negativo e estoque inteiro não negativo." });
    produtoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (!registros.length) return res.status(404).json({ erro: "Produto não encontrado." });
        produtoModel.atualizar(req.id, dados, (erro) => erro ? next(erro) : res.status(200).json({ mensagem: "Produto atualizado com sucesso." }));
    });
}
export function excluir(req, res, next) {
    produtoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Produto não encontrado." });
        return res.status(200).json({ mensagem: "Produto excluído com sucesso." });
    });
}
