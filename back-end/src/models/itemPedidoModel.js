import conexao from "../../config/db.js";
export function listar(callback) {
    const sql = "SELECT * FROM itens_pedido ORDER BY id";
    conexao.query(sql, callback);
};
export function buscarPorId(id, callback) {
    const sql = "SELECT * FROM itens_pedido WHERE id = ?";
    conexao.query(sql, [id], callback);
};
export function criar(dados, callback) {
    const sql = "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.pedido_id, dados.produto_id, dados.quantidade, dados.preco_unitario], callback);
};
export function atualizar(id, dados, callback) {
    const sql = "UPDATE itens_pedido SET pedido_id = ?, produto_id = ?, quantidade = ?, preco_unitario = ?, WHERE id = ?";
    conexao.query(sql, [dados.pedido_id, dados.produto_id, dados.quantidade, dados.preco_unitario, id], callback);
};
export function excluir(id, callback) {
    const sql = "DELETE FROM itens_pedido WHERE id = ?";
    conexao.query(sql, [id], callback);
};
