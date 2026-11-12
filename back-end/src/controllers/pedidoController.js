import * as pedidoModel from "../models/pedidoModel.js";
import { inteiroPositivo, textoValido, numeroNaoNegativo } from "../utils/validacoes.js";

export function listar(req, res, next) {
  pedidoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
  pedidoModel.buscarPorId(req.id, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.length) return res.status(404).json({ erro: "Pedido não encontrado" });
    return res.status(200).json(resultado[0]);
  });
}

export function criar(req, res, next) {
  const { usuario_id, status = "Pendente", valor_total = 0 } = req.body ?? {};
  if (!inteiroPositivo(usuario_id) || !textoValido(status, 50) || !numeroNaoNegativo(valor_total)) {
    return res.status(400).json({ erro: "Informe usuario_id, status e valor_total válidos." });
  }
  pedidoModel.criar({ usuario_id, status, valor_total: Number(valor_total) }, (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso", id: resultado.insertId });
  });
}

export function atualizar(req, res, next) {
  const { usuario_id, status, valor_total } = req.body ?? {};
  if (!inteiroPositivo(usuario_id) || !textoValido(status, 50) || !numeroNaoNegativo(valor_total)) {
    return res.status(400).json({ erro: "Informe usuario_id, status e valor_total válidos." });
  }
  pedidoModel.atualizar(req.id, { usuario_id, status, valor_total: Number(valor_total) }, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Pedido não encontrado" });
    return res.status(200).json({ mensagem: "Pedido atualizado com sucesso" });
  });
}

export function excluir(req, res, next) {
  pedidoModel.excluir(req.id, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Pedido não encontrado" });
    return res.status(200).json({ mensagem: "Pedido excluído com sucesso" });
  });
}
