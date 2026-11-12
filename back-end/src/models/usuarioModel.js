import conexao from "../../config/db.js";

export function listar(callback) {
    conexao.query("SELECT id, nome, email, telefone, data_cadastro FROM usuarios ORDER BY id", callback);
}

export function buscarPorId(id, callback) {
    conexao.query("SELECT id, nome, email, telefone, data_cadastro FROM usuarios WHERE id = ?", [id], callback);
}

export function buscarPorEmail(email, callback) {
    conexao.query("SELECT id, nome, email, senha, telefone, data_cadastro FROM usuarios WHERE email = ?", [email], callback);
}

export function criar(dados, callback) {
    const sql = "INSERT INTO usuarios (nome, email, senha, telefone, data_cadastro) VALUES (?, ?, ?, ?, ?)";
    conexao.query(sql, [dados.nome, dados.email, dados.senha, dados.telefone, dados.data_cadastro], callback);
}

export function atualizar(id, dados, callback) {
    const sql = "UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ?, data_cadastro = ? WHERE id = ?";
    conexao.query(sql, [dados.nome, dados.email, dados.senha, dados.telefone, dados.data_cadastro, id], callback);
}

export function excluir(id, callback) {
    conexao.query("DELETE FROM usuarios WHERE id = ?", [id], callback);
}
