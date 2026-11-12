import * as fornecedorModel from "../models/fornecedorModel.js";
import { textoValido } from "../utils/validacoes.js";

const validarDados = ({ razao_social, cnpj, contato }) =>
    textoValido(razao_social, 150) && textoValido(String(cnpj ?? ""), 18) && textoValido(String(contato ?? ""), 150);

export function listar(req, res, next) {
    fornecedorModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
    fornecedorModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Fornecedor não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe razão social, CNPJ e contato válidos." });
    fornecedorModel.criar(dados, (erro, resultado) => erro ? next(erro) : res.status(201).json({ mensagem: "Fornecedor cadastrado com sucesso.", id: resultado.insertId }));
}

export function atualizar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Informe razão social, CNPJ e contato válidos." });
    fornecedorModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (!registros.length) return res.status(404).json({ erro: "Fornecedor não encontrado." });
        fornecedorModel.atualizar(req.id, dados, (erro) => erro ? next(erro) : res.status(200).json({ mensagem: "Fornecedor atualizado com sucesso." }));
    });
}

export function excluir(req, res, next) {
    fornecedorModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Fornecedor não encontrado." });
        return res.status(200).json({ mensagem: "Fornecedor excluído com sucesso." });
    });
}
