import conexao from "../../config/db.js";

export function listar(callback) {
  const sql = `
    SELECT p.id, p.categoria_id, p.fornecedor_id, p.nome, p.descricao,
           p.preco, p.estoque, c.nome AS categoria
    FROM produtos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    ORDER BY p.id
  `;
  conexao.query(sql, callback);
}

export function buscarPorId(id, callback) {
  conexao.query("SELECT * FROM produtos WHERE id = ?", [id], callback);
}

export function criar(dados, callback) {
  const sql = "INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque) VALUES (?, ?, ?, ?, ?, ?)";
  conexao.query(sql, [dados.categoria_id, dados.fornecedor_id, dados.nome, dados.descricao, dados.preco, dados.estoque], callback);
}

export function atualizar(id, dados, callback) {
  const sql = "UPDATE produtos SET categoria_id = ?, fornecedor_id = ?, nome = ?, descricao = ?, preco = ?, estoque = ? WHERE id = ?";
  conexao.query(sql, [dados.categoria_id, dados.fornecedor_id, dados.nome, dados.descricao, dados.preco, dados.estoque, id], callback);
}

export function excluir(id, callback) {
  conexao.query("DELETE FROM produtos WHERE id = ?", [id], callback);
}
