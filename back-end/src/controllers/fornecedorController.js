import * as fornecedorModel from "../models/fornecedorModel.js";
import { textoValido } from "../utils/validacoes.js";
export function listar(req, res, next) {
    fornecedorModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    fornecedorModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Fornecedor não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { razao_social, cnpj, contato } = req.body ?? {};
    if (!textoValido(razao_social, 100)) {
        return res.status(400).json({ erro: "Informe razao_social (até 100 caracteres), cnpj e contato." });
    }
    const dados = { razao_social: razao_social.trim(), cnpj, contato };

    fornecedorModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Fornecedor cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { razao_social, cnpj, contato } = req.body ?? {};
    if (!textoValido(razao_social, 100)) {
        return res.status(400).json({ erro: "Informe razao_social (até 100 caracteres), cnpj e contato." });
    }
    const dados = { razao_social: razao_social.trim(), cnpj, contato };

    // Consulta didática para confirmar que o registro existe antes de editar.
    fornecedorModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Fornecedor não encontrado" });
        }
        fornecedorModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Fornecedor atualizado com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    fornecedorModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Fornecedor não encontrado" });
        }
        return res.status(200).json({ mensagem: "Fornecedor excluído com sucesso" });
    });
};