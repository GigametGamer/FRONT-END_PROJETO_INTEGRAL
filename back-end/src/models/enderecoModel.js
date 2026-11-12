import conexao from "../../config/db.js";

export function listar(callback) {
    conexao.query("SELECT * FROM enderecos ORDER BY id", callback);
}

export function buscarPorId(id, callback) {
    conexao.query("SELECT * FROM enderecos WHERE id = ?", [id], callback);
}

export function criar(dados, callback) {
    const sql = "INSERT INTO enderecos (usuario_id, logradouro, numero, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)";
    conexao.query(sql, [dados.usuario_id, dados.logradouro, dados.numero, dados.bairro, dados.cidade, dados.estado, dados.cep], callback);
}

export function atualizar(id, dados, callback) {
    const sql = "UPDATE enderecos SET usuario_id = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ? WHERE id = ?";
    conexao.query(sql, [dados.usuario_id, dados.logradouro, dados.numero, dados.bairro, dados.cidade, dados.estado, dados.cep, id], callback);
}

export function excluir(id, callback) {
    conexao.query("DELETE FROM enderecos WHERE id = ?", [id], callback);
}
