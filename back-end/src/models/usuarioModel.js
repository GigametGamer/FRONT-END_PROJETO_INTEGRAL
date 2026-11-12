import conexao from "../../config/db.js";
export function listar(callback) {
    const sql = "SELECT * FROM usuarios ORDER BY id";
    conexao.query(sql, callback);
};
export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM usuarios WHERE id = ?";
    conexao.query(sql, [id], callback);
};
export function criar(dados, callback) {
    const sql = "INSERT INTO usuarios (nome, email, senha, telefone, data_cadastro) VALUES (?, ?, ?, ?, ?)";
    conexao.query(sql, [dados.nome, dados.email, dados.senha, dados.telefone, dados.data_cadastro], callback);
};
export function atualizar(id, dados, callback) {
    const sql = "UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ?, data_cadastro = ?, WHERE id = ?";
    conexao.query(sql, [dados.nome, dados.email, dados.senha, dados.telefone, dados.data_cadastro, id], callback);
};
export function excluir(id, callback) {
    const sql = "DELETE FROM usuarios WHERE id = ?";
    conexao.query(sql, [id], callback);
};
