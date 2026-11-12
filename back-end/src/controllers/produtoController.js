import * as produtoModel from "../models/produtoModel.js";
import { textoValido } from "../utils/validacoes.js";
import { inteiroPositivo } from "../utils/validacoes.js";
export function listar(req, res, next) {
    produtoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    produtoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { categoria_id, fornecedor_id, nome, descricao, preco, estoque } = req.body ?? {};
    if (!inteiroPositivo(categoria_id) || categoria_id > 9999 || !inteiroPositivo(fornecedor_id) || fornecedor_id > 9999 || !textoValido(nome, 560) || !textoValido(descricao, 560) || !inteiroPositivo(estoque)) {
        return res.status(400).json({
            erro: "Informe categoria_id inteiro positivo, status e valor_total."
        });
    }
    const dados = { categoria_id, fornecedor_id, nome, descricao, preco, estoque };

    produtoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { categoria_id, fornecedor_id, nome, descricao, preco, estoque } = req.body ?? {};
    if (!inteiroPositivo(categoria_id) || categoria_id > 9999 || !inteiroPositivo(fornecedor_id) || fornecedor_id > 9999 || !textoValido(nome, 560) || !textoValido(descricao, 560) || !inteiroPositivo(estoque)) {
        return res.status(400).json({
            erro: "Informe pedido_id inteiro positivo, metodo, status e valor_total."
        });
    }
    const dados = { categoria_id, fornecedor_id, nome, descricao, preco, estoque };

    // Consulta didática para confirmar que o registro existe antes de editar.
    produtoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        produtoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Produto atualizado com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    produtoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        return res.status(200).json({ mensagem: "Produto excluído com sucesso" });
    });
};