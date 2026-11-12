import { promisify } from "node:util";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import * as usuarioModel from "../models/usuarioModel.js";
import { textoValido, emailValido } from "../utils/validacoes.js";

const scrypt = promisify(scryptCallback);

async function gerarHashSenha(senha) {
    const sal = randomBytes(16).toString("hex");
    const hash = await scrypt(senha, sal, 64);
    return `scrypt:${sal}:${hash.toString("hex")}`;
}

function validarDados({ nome, email, senha, telefone }) {
    return textoValido(nome, 150) &&
        emailValido(email) &&
        textoValido(senha, 128) &&
        senha.length >= 8 &&
        (telefone == null || telefone === "" || textoValido(String(telefone), 20));
}

export function listar(req, res, next) {
    usuarioModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
    usuarioModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.length) return res.status(404).json({ erro: "Usuário não encontrado." });
        return res.status(200).json(resultado[0]);
    });
}

export async function criar(req, res, next) {
    try {
        const dados = req.body ?? {};
        if (!validarDados(dados)) {
            return res.status(400).json({ erro: "Informe nome, e-mail válido e senha com pelo menos 8 caracteres." });
        }

        const senhaHash = await gerarHashSenha(dados.senha);
        const novoUsuario = {
            nome: dados.nome.trim(),
            email: dados.email.trim().toLowerCase(),
            senha: senhaHash,
            telefone: dados.telefone ?? null,
            data_cadastro: dados.data_cadastro ?? new Date()
        };

        usuarioModel.criar(novoUsuario, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso.", id: resultado.insertId });
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const dados = req.body ?? {};
        if (!validarDados(dados)) {
            return res.status(400).json({ erro: "Informe nome, e-mail válido e senha com pelo menos 8 caracteres." });
        }

        const senhaHash = await gerarHashSenha(dados.senha);
        const dadosAtualizados = {
            nome: dados.nome.trim(),
            email: dados.email.trim().toLowerCase(),
            senha: senhaHash,
            telefone: dados.telefone ?? null,
            data_cadastro: dados.data_cadastro ?? new Date()
        };

        usuarioModel.buscarPorId(req.id, (erro, registros) => {
            if (erro) return next(erro);
            if (!registros.length) return res.status(404).json({ erro: "Usuário não encontrado." });
            usuarioModel.atualizar(req.id, dadosAtualizados, (erro) =>
                erro ? next(erro) : res.status(200).json({ mensagem: "Usuário atualizado com sucesso." })
            );
        });
    } catch (erro) {
        return next(erro);
    }
}

export function excluir(req, res, next) {
    usuarioModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: "Usuário não encontrado." });
        return res.status(200).json({ mensagem: "Usuário excluído com sucesso." });
    });
}
