import * as pagamentoModel from "../models/pagamentoModel.js";
import { textoValido } from "../utils/validacoes.js";
import { inteiroPositivo } from "../utils/validacoes.js";
export function listar(req, res, next) {
    pagamentoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    pagamentoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Pagamento não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { pedido_id, metodo, status, data_pagamento } = req.body ?? {};
    if (!inteiroPositivo(pedido_id) || pedido_id > 9999 || !textoValido(metodo, 560) || !textoValido(status, 560)) {
        return res.status(400).json({
            erro: "Informe pedido_id inteiro positivo, metodo, status e data_pagamento."
        });
    }
    const dados = { pedido_id, metodo, status, data_pagamento };

    pagamentoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Pagamento cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { pedido_id, metodo, status, data_pagamento } = req.body ?? {};
    if (!inteiroPositivo(pedido_id) || pedido_id > 9999 || !textoValido(metodo, 560) || !textoValido(status, 560)) {
        return res.status(400).json({
            erro: "Informe pedido_id inteiro positivo, metodo, status e data_pagamento."
        });
    }
    const dados = { pedido_id, metodo, status, data_pagamento };

    // Consulta didática para confirmar que o registro existe antes de editar.
    pagamentoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Pagamento não encontrado" });
        }
        pagamentoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Pagamento atualizado com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    pagamentoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Pagamento não encontrado" });
        }
        return res.status(200).json({ mensagem: "Pagamento excluído com sucesso" });
    });
};