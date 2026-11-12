import conexao from "../../config/db.js";
export function listar(callback) {
    const sql = "SELECT * FROM pagamentos ORDER BY id";
    conexao.query(sql, callback);
};
export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM pagamentos WHERE id = ?";
    conexao.query(sql, [id], callback);
};
export function criar(dados, callback) {
    const sql = "INSERT INTO pagamentos (pedido_id, metodo, status, data_pagamento) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.pedido_id, dados.metodo, dados.status, dados.data_pagamento], callback);
};
export function atualizar(id, dados, callback) {
    const sql = "UPDATE pagamentos SET pedido_id = ?, metodo = ?, status = ?, data_pagamento = ?, WHERE id = ?";
    conexao.query(sql, [dados.pedido_id, dados.metodo, dados.status, dados.data_pagamento, id], callback);
};
export function excluir(id, callback) {
    const sql = "DELETE FROM pagamentos WHERE id = ?";
    conexao.query(sql, [id], callback);
};
