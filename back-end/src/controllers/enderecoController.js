import * as enderecoModel from "../models/enderecoModel.js";
import { textoValido, inteiroPositivo, inteiroNaoNegativo } from "../utils/validacoes.js";
const validarDados = ({ usuario_id, logradouro, numero, bairro, cidade, estado, cep }) =>
    inteiroPositivo(usuario_id) && textoValido(logradouro, 150) && inteiroNaoNegativo(numero) &&
    textoValido(bairro, 150) && textoValido(cidade, 150) && textoValido(estado, 150) &&
    textoValido(String(cep ?? ""), 9);
export function listar(req, res, next) {
    enderecoModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}
export function buscarPorId(req, res, next) {
    enderecoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Endereço não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}
export function criar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Confira usuário, logradouro, número, bairro, cidade, estado e CEP." });
    enderecoModel.criar(dados, (erro, resultado) => erro ? next(erro) : res.status(201).json({ mensagem: "Endereço cadastrado com sucesso.", id: resultado.insertId }));
}
export function atualizar(req, res, next) {
    const dados = req.body ?? {};
    if (!validarDados(dados)) return res.status(400).json({ erro: "Confira usuário, logradouro, número, bairro, cidade, estado e CEP." });
    enderecoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (!registros.length) return res.status(404).json({ erro: "Endereço não encontrado." });
        enderecoModel.atualizar(req.id, dados, (erro) => erro ? next(erro) : res.status(200).json({ mensagem: "Endereço atualizado com sucesso." }));
    });
}
export function excluir(req, res, next) {
    enderecoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Endereço não encontrado." });
        return res.status(200).json({ mensagem: "Endereço excluído com sucesso." });
    });
}
