import conexao from "../../config/db.js";
export function listar(callback) {
    const sql = "SELECT * FROM categorias ORDER BY id";
    conexao.query(sql, callback);
};
export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM categorias WHERE id = ?";
    conexao.query(sql, [id], callback);
};
export function criar(dados, callback) {
    const sql = "INSERT INTO categorias (nome, descricao) VALUES (?, ?)";
    conexao.query(sql, [dados.nome, dados.descricao], callback);
};
export function atualizar(id, dados, callback) {
    const sql = "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?";
    conexao.query(sql, [dados.nome, dados.descricao, id], callback);
};
export function excluir(id, callback) {
    const sql = "DELETE FROM categorias WHERE id = ?";
    conexao.query(sql, [id], callback);
};