import conexao from "../../config/db.js";

export function listar(callback) {
  conexao.query("SELECT * FROM fornecedores ORDER BY id", callback);
}
export function buscarPorId(id, callback) {
  conexao.query("SELECT * FROM fornecedores WHERE id = ?", [id], callback);
}
export function criar(dados, callback) {
  const sql = "INSERT INTO fornecedores (razao_social, cnpj, contato) VALUES (?, ?, ?)";
  conexao.query(sql, [dados.razao_social, dados.cnpj, dados.contato], callback);
}
export function atualizar(id, dados, callback) {
  const sql = "UPDATE fornecedores SET razao_social = ?, cnpj = ?, contato = ? WHERE id = ?";
  conexao.query(sql, [dados.razao_social, dados.cnpj, dados.contato, id], callback);
}
export function excluir(id, callback) {
  conexao.query("DELETE FROM fornecedores WHERE id = ?", [id], callback);
}
