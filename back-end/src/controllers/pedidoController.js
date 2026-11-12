import * as pedidoModel from "../models/pedidoModel.js";
import { textoValido } from "../utils/validacoes.js";
import { inteiroPositivo } from "../utils/validacoes.js";
export function listar(req, res, next) {
    pedidoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    pedidoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { usuario_id, data_pedido, status, valor_total } = req.body ?? {};
    if (!inteiroPositivo(usuario_id) || usuario_id > 9999 || !textoValido(status, 560)) {
        return res.status(400).json({
            erro: "Informe usuario_id inteiro positivo, status e valor_total."
        });
    }
    const dados = { usuario_id, data_pedido, status, valor_total };

    pedidoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Pedido cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { usuario_id, data_pedido, status, valor_total } = req.body ?? {};
    if (!inteiroPositivo(pedido_id) || pedido_id > 9999 || !textoValido(metodo, 560) || !textoValido(status, 560)) {
        return res.status(400).json({
            erro: "Informe pedido_id inteiro positivo, metodo, status e valor_total."
        });
    }
    const dados = { usuario_id, data_pedido, status, valor_total };

    // Consulta didática para confirmar que o registro existe antes de editar.
    pedidoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        pedidoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Pedido atualizado com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    pedidoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        return res.status(200).json({ mensagem: "Pedido excluído com sucesso" });
    });
};