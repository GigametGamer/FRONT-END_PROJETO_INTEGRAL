import * as categoriaModel from "../models/categoriaModel.js";
import { textoValido } from "../utils/validacoes.js";
export function listar(req, res, next) {
    categoriaModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    categoriaModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { nome, descricao } = req.body ?? {};
    if (!textoValido(nome, 100) || !textoValido(descricao, 560)) {
        return res.status(400).json({ erro: "Informe nome (até 100 caracteres) e descricao (até 560)" });
    }
    const dados = { nome: nome.trim(), descricao: descricao.trim() };

    categoriaModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { nome, descricao } = req.body ?? {};
    if (!textoValido(nome, 100) || !textoValido(descricao, 560)) {
        return res.status(400).json({ erro: "Informe nome (até 100 caracteres) e descricao (até 560)" });
    }
    const dados = { nome: nome.trim(), descricao: descricao.trim() };

    // Consulta didática para confirmar que o registro existe antes de editar.
    categoriaModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        categoriaModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Categoria atualizada com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    categoriaModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        return res.status(200).json({ mensagem: "Categoria excluída com sucesso" });
    });
};