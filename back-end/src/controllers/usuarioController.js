import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import * as usuarioModel from "../models/usuarioModel.js";
import { textoValido, emailValido } from "../utils/validacoes.js";

function gerarHash(senha) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, salt, 64).toString("hex");
  return salt + ":" + hash;
}

function conferirSenha(senha, armazenada) {
  if (typeof armazenada !== "string" || !armazenada.includes(":")) return false;
  const [salt, hash] = armazenada.split(":");
  const tentativa = scryptSync(senha, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === tentativa.length && timingSafeEqual(original, tentativa);
}

export function listar(req, res, next) {
  usuarioModel.listar((erro, resultado) => erro ? next(erro) : res.status(200).json(resultado));
}

export function buscarPorId(req, res, next) {
  usuarioModel.buscarPorId(req.id, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.length) return res.status(404).json({ erro: "Usuário não encontrado" });
    return res.status(200).json(resultado[0]);
  });
}

export function criar(req, res, next) {
  const { nome, email, senha, telefone } = req.body ?? {};
  if (!textoValido(nome, 150) || !emailValido(email) || typeof senha !== "string" || senha.length < 8) {
    return res.status(400).json({ erro: "Informe nome, e-mail válido e senha com pelo menos 8 caracteres." });
  }
  usuarioModel.criar({ nome: nome.trim(), email: email.trim().toLowerCase(), senha: gerarHash(senha), telefone }, (erro, resultado) => {
    if (erro) return next(erro);
    return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso", id: resultado.insertId });
  });
}

export function login(req, res, next) {
  const { email, senha } = req.body ?? {};
  if (!emailValido(email) || typeof senha !== "string" || !senha) {
    return res.status(400).json({ erro: "Informe e-mail e senha." });
  }
  usuarioModel.buscarPorEmail(email.trim().toLowerCase(), (erro, resultado) => {
    if (erro) return next(erro);
    const usuario = resultado[0];
    if (!usuario || !conferirSenha(senha, usuario.senha)) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }
    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  });
}

export function excluir(req, res, next) {
  usuarioModel.excluir(req.id, (erro, resultado) => {
    if (erro) return next(erro);
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Usuário não encontrado" });
    return res.status(200).json({ mensagem: "Usuário excluído com sucesso" });
  });
}
