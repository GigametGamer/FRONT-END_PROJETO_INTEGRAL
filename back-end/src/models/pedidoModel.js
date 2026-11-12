import conexao from "../../config/db.js";

export function listar(callback) {
    conexao.query("SELECT * FROM pedidos ORDER BY id", callback);
}

export function buscarPorId(id, callback) {
    conexao.query("SELECT * FROM pedidos WHERE id = ?", [id], callback);
}

export function criar(dados, callback) {
    const sql = "INSERT INTO pedidos (usuario_id, data_pedido, status, valor_total) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.usuario_id, dados.data_pedido, dados.status, dados.valor_total], callback);
}

export function atualizar(id, dados, callback) {
    const sql = "UPDATE pedidos SET usuario_id = ?, data_pedido = ?, status = ?, valor_total = ? WHERE id = ?";
    conexao.query(sql, [dados.usuario_id, dados.data_pedido, dados.status, dados.valor_total, id], callback);
}

export function excluir(id, callback) {
    conexao.query("DELETE FROM pedidos WHERE id = ?", [id], callback);
}
