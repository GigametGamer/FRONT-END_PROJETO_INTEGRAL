import conexao from "../../config/db.js";

export function listar(callback) {
  conexao.query("SELECT * FROM pagamentos ORDER BY id", callback);
}
export function buscarPorId(id, callback) {
  conexao.query("SELECT * FROM pagamentos WHERE id = ?", [id], callback);
}
export function criar(dados, callback) {
  const sql = "INSERT INTO pagamentos (pedido_id, metodo, status, data_pagamento) VALUES (?, ?, ?, ?)";
  conexao.query(sql, [dados.pedido_id, dados.metodo, dados.status, dados.data_pagamento || null], callback);
}
export function atualizar(id, dados, callback) {
  const sql = "UPDATE pagamentos SET pedido_id = ?, metodo = ?, status = ?, data_pagamento = ? WHERE id = ?";
  conexao.query(sql, [dados.pedido_id, dados.metodo, dados.status, dados.data_pagamento, id], callback);
}
export function excluir(id, callback) {
  conexao.query("DELETE FROM pagamentos WHERE id = ?", [id], callback);
}
