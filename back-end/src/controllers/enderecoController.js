import * as enderecoModel from "../models/enderecoModel.js";
import { textoValido } from "../utils/validacoes.js";
import { inteiroPositivo } from "../utils/validacoes.js";
export function listar(req, res, next) {
    enderecoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
};

export function buscarPorId(req, res, next) {
    enderecoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Endereço não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
};

export function criar(req, res, next) {
    const { usuario_id, logradouro, numero, bairro, cidade, estado, cep } = req.body ?? {};
    if (!textoValido(logradouro, 150) || !inteiroPositivo(numero) || numero > 9999 || !inteiroPositivo(usuario_id) || !textoValido(bairro, 150) || !textoValido(cidade, 150) || !textoValido(estado, 150)) {
        return res.status(400).json({
            erro: "Informe usuario_id inteiro positivo, logradouro (até 150 caracteres), numero de 1 a 9999, logradouro (até 150 caracteres), bairro (até 150 caracteres), cidade (até 150 caracteres), estado (até 150 caracteres) e cep."
        });
    }
    const dados = { usuario_id, logradouro: logradouro.trim(), numero, bairro: bairro.trim(), cidade: cidade.trim(), estado: estado.trim(), cep };

    enderecoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Endereço cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

export function atualizar(req, res, next) {
    const { usuario_id, logradouro, numero, bairro, cidade, estado, cep } = req.body ?? {};
    if (!textoValido(logradouro, 150) || !inteiroPositivo(numero) || numero > 9999 || !inteiroPositivo(usuario_id) || !textoValido(bairro, 150) || !textoValido(cidade, 150) || !textoValido(estado, 150)) {
        return res.status(400).json({
            erro: "Informe usuario_id inteiro positivo, logradouro (até 150 caracteres), numero de 1 a 9999, logradouro (até 150 caracteres), bairro (até 150 caracteres), cidade (até 150 caracteres), estado (até 150 caracteres) e cep."
        });
    }
    const dados = { usuario_id, logradouro: logradouro.trim(), numero, bairro: bairro.trim(), cidade: cidade.trim(), estado: estado.trim(), cep };

    // Consulta didática para confirmar que o registro existe antes de editar.
    enderecoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Endereço não encontrado" });
        }
        enderecoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Endereço atualizado com sucesso" });
        });
    });
};

export function excluir(req, res, next) {
    enderecoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Endereço não encontrado" });
        }
        return res.status(200).json({ mensagem: "Endereço excluído com sucesso" });
    });
};