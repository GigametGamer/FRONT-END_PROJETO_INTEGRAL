import * as itemPedidoModel from "../models/itemPedidoModel.js";
import { inteiroPositivo, numeroNaoNegativo } from "../utils/validacoes.js";

const validarDados = ({ pedido_id, produto_id, quantidade, preco_unitario }) =>
    inteiroPositivo(pedido_id) && inteiroPositivo(produto_id) &&
    inteiroPositivo(quantidade) && numeroNaoNegativo(preco_unitario);

export function listar(req, res, next) {
    itemPedidoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
    itemPedidoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Item do pedido não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe pedido_id, produto_id, quantidade e preço unitário válidos." });
    itemPedidoModel.criar(dados, (erro, resultado) => erro ? next(erro) : res.status(201).json({ mensagem: "Item do pedido cadastrado com sucesso.", id: resultado.insertId }));
}

export function atualizar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe pedido_id, produto_id, quantidade e preço unitário válidos." });
    itemPedidoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (!registros.length) return res.status(404).json({ erro: "Item do pedido não encontrado." });
        itemPedidoModel.atualizar(req.id, dados, (erro) => erro ? next(erro) : res.status(200).json({ mensagem: "Item do pedido atualizado com sucesso." }));
    });
}

export function excluir(req, res, next) {
    itemPedidoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Item do pedido não encontrado." });
        return res.status(200).json({ mensagem: "Item do pedido excluído com sucesso." });
    });
}
