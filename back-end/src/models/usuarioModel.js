import conexao from "../../config/db.js";

export function listar(callback) {
  conexao.query("SELECT id, nome, email, telefone, data_cadastro FROM usuarios ORDER BY id", callback);
}

export function buscarPorId(id, callback) {
  conexao.query("SELECT id, nome, email, telefone, data_cadastro FROM usuarios WHERE id = ?", [id], callback);
}

export function buscarPorEmail(email, callback) {
  conexao.query("SELECT id, nome, email, senha FROM usuarios WHERE email = ? LIMIT 1", [email], callback);
}

export function criar(dados, callback) {
  const sql = "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)";
  conexao.query(sql, [dados.nome, dados.email, dados.senha, dados.telefone || null], callback);
}

export function excluir(id, callback) {
  conexao.query("DELETE FROM usuarios WHERE id = ?", [id], callback);
}
