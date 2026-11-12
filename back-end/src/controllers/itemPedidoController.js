import * as itemPedidoModel from "../models/itemPedidoModel.js";
import { textoValido } from "../utils/validacoes.js";
import { inteiroPositivo } from "../utils/validacoes.js";
export function listar(req, res, next) {
    itemPedidoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    itemPedidoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Item do pedido não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { pedido_id, produto_id, quantidade, preco_unitario } = req.body ?? {};
    if (!inteiroPositivo(pedido_id) || pedido_id > 9999 || !inteiroPositivo(produto_id) || produto_id > 9999 ||!inteiroPositivo(quantidade) || quantidade > 9999) {
        return res.status(400).json({
            erro: "Informe pedido_id inteiro positivo, produto_id inteiro positivo, quantidade inteiro positivo e preco_unitario."
        });
    }
    const dados = { pedido_id, produto_id, quantidade, preco_unitario };

    itemPedidoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Item do pedido cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { pedido_id, produto_id, quantidade, preco_unitario } = req.body ?? {};
    if (!inteiroPositivo(pedido_id) || pedido_id > 9999 || !inteiroPositivo(produto_id) || produto_id > 9999 ||!inteiroPositivo(quantidade) || quantidade > 9999) {
        return res.status(400).json({
            erro: "Informe pedido_id inteiro positivo, produto_id inteiro positivo, quantidade inteiro positivo e preco_unitario."
        });
    }
    const dados = { pedido_id, produto_id, quantidade, preco_unitario };

    // Consulta didática para confirmar que o registro existe antes de editar.
    itemPedidoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Item do pedido não encontrado" });
        }
        itemPedidoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Item do pedido atualizado com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    itemPedidoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Item do pedido não encontrado" });
        }
        return res.status(200).json({ mensagem: "Item do pedido excluído com sucesso" });
    });
};