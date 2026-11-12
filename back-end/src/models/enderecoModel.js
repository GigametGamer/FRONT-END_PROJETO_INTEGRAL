import conexao from "../../config/db.js";
export function listar(callback) {
    const sql = "SELECT * FROM enderecos ORDER BY id";
    conexao.query(sql, callback);
};
export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM enderecos WHERE id = ?";
    conexao.query(sql, [id], callback);
};
export function criar(dados, callback) {
    const sql = "INSERT INTO enderecos (usuario_id, logradouro, numero, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)";
    conexao.query(sql, [dados.usuario_id, dados.numero, dados.bairro, dados.cidade, dados.estado, dados.cep], callback);
};
export function atualizar(id, dados, callback) {
    const sql = "UPDATE enderecos SET usuario_id = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ? WHERE id = ?";
    conexao.query(sql, [dados.usuario_id, dados.numero, dados.bairro, dados.cidade, dados.estado, dados.cep, id], callback);
};
export function excluir(id, callback) {
    const sql = "DELETE FROM enderecos WHERE id = ?";
    conexao.query(sql, [id], callback);
};
