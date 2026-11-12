import * as pedidoModel from "../models/pedidoModel.js";
import { inteiroPositivo, numeroNaoNegativo, textoValido, dataValida } from "../utils/validacoes.js";

const validarDados = ({ usuario_id, data_pedido, status, valor_total }) =>
    inteiroPositivo(usuario_id) &&
    textoValido(status, 50) &&
    numeroNaoNegativo(valor_total) &&
    dataValida(data_pedido);

export function listar(req, res, next) {
    pedidoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
    pedidoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Pedido não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe usuario_id, status, valor_total não negativo e uma data válida." });
    pedidoModel.criar(dados, (erro, resultado) => erro ? next(erro) : res.status(201).json({ mensagem: "Pedido cadastrado com sucesso.", id: resultado.insertId }));
}

export function atualizar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe usuario_id, status, valor_total não negativo e uma data válida." });
    pedidoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (!registros.length) return res.status(404).json({ erro: "Pedido não encontrado." });
        pedidoModel.atualizar(req.id, dados, (erro) => erro ? next(erro) : res.status(200).json({ mensagem: "Pedido atualizado com sucesso." }));
    });
}

export function excluir(req, res, next) {
    pedidoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Pedido não encontrado." });
        return res.status(200).json({ mensagem: "Pedido excluído com sucesso." });
    });
}
