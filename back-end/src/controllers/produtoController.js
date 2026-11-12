import * as produtoModel from "../models/produtoModel.js";
import { textoValido, inteiroPositivo, numeroNaoNegativo } from "../utils/validacoes.js";

export function listar(req, res, next) {
  produtoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
  produtoModel.buscarPorId(req.id, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.length) return res.status(404).json({ erro: "Produto não encontrado" });
    return res.status(200).json(resultado[0]);
  });
}

export function criar(req, res, next) {
  const { categoria_id, fornecedor_id, nome, descricao, preco, estoque } = req.body ?? {};
  if (!inteiroPositivo(categoria_id) || !inteiroPositivo(fornecedor_id) ||
      !textoValido(nome, 160) || !numeroNaoNegativo(preco) ||
      !Number.isInteger(Number(estoque)) || Number(estoque) < 0) {
    return res.status(400).json({ erro: "Informe categoria_id, fornecedor_id, nome, preço e estoque válidos." });
  }
  produtoModel.criar({ categoria_id, fornecedor_id, nome: nome.trim(), descricao: descricao || "", preco: Number(preco), estoque: Number(estoque) }, (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(201).json({ mensagem: "Produto cadastrado com sucesso", id: resultado.insertId });
  });
}

export function atualizar(req, res, next) {
  const { categoria_id, fornecedor_id, nome, descricao, preco, estoque } = req.body ?? {};
  if (!inteiroPositivo(categoria_id) || !inteiroPositivo(fornecedor_id) ||
      !textoValido(nome, 160) || !numeroNaoNegativo(preco) ||
      !Number.isInteger(Number(estoque)) || Number(estoque) < 0) {
    return res.status(400).json({ erro: "Informe categoria_id, fornecedor_id, nome, preço e estoque válidos." });
  }
  produtoModel.atualizar(req.id, { categoria_id, fornecedor_id, nome: nome.trim(), descricao: descricao || "", preco: Number(preco), estoque: Number(estoque) }, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Produto não encontrado" });
    return res.status(200).json({ mensagem: "Produto atualizado com sucesso" });
  });
}

export function excluir(req, res, next) {
  produtoModel.excluir(req.id, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Produto não encontrado" });
    return res.status(200).json({ mensagem: "Produto excluído com sucesso" });
  });
}
