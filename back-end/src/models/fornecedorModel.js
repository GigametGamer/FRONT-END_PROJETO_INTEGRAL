import conexao from "../../config/db.js";
export function listar(callback) {
    const sql = "SELECT * FROM fornecedores ORDER BY id";
    conexao.query(sql, callback);
};
export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM fornecedores WHERE id = ?";
    conexao.query(sql, [id], callback);
};
export function criar(dados, callback) {
    const sql = "INSERT INTO fornecedores (razao_social, cnpj, contato) VALUES (?, ?, ?)";
    conexao.query(sql, [dados.usuario_id, dados.numero, dados.bairro, dados.cidade, dados.estado, dados.cep], callback);
};
export function atualizar(id, dados, callback) {
    const sql = "UPDATE fornecedores SET razao_social = ?, cnpj = ?, contato = ?, WHERE id = ?";
    conexao.query(sql, [dados.usuario_id, dados.numero, dados.bairro, dados.cidade, dados.estado, dados.cep, id], callback);
};
export function excluir(id, callback) {
    const sql = "DELETE FROM fornecedores WHERE id = ?";
    conexao.query(sql, [id], callback);
};
