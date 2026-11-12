import * as pagamentoModel from "../models/pagamentoModel.js";
import { inteiroPositivo, textoValido, dataValida } from "../utils/validacoes.js";

const validarDados = ({ pedido_id, metodo, status, data_pagamento }) =>
    inteiroPositivo(pedido_id) && textoValido(metodo, 50) &&
    textoValido(status, 50) && dataValida(data_pagamento);

export function listar(req, res, next) {
    pagamentoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
    pagamentoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Pagamento não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe pedido_id, método, status e data de pagamento válidos." });
    pagamentoModel.criar(dados, (erro, resultado) => erro ? next(erro) : res.status(201).json({ mensagem: "Pagamento cadastrado com sucesso.", id: resultado.insertId }));
}

export function atualizar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe pedido_id, método, status e data de pagamento válidos." });
    pagamentoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (!registros.length) return res.status(404).json({ erro: "Pagamento não encontrado." });
        pagamentoModel.atualizar(req.id, dados, (erro) => erro ? next(erro) : res.status(200).json({ mensagem: "Pagamento atualizado com sucesso." }));
    });
}

export function excluir(req, res, next) {
    pagamentoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Pagamento não encontrado." });
        return res.status(200).json({ mensagem: "Pagamento excluído com sucesso." });
    });
}
