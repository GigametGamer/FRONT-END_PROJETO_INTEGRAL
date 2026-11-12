-- BANCO DE TESTE DA BIOSTORE
-- Este script cria um banco separado chamado biostore_teste.
-- Ele NAO altera nem apaga o banco principal que voce ja possui.
-- Execute no MariaDB/MySQL (HeidiSQL, DBeaver ou terminal).

CREATE DATABASE IF NOT EXISTS biostore_teste
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biostore_teste;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(30) NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(560) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  razao_social VARCHAR(100) NOT NULL,
  cnpj VARCHAR(20) NULL,
  contato VARCHAR(150) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enderecos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  logradouro VARCHAR(150) NOT NULL,
  numero INT NOT NULL,
  bairro VARCHAR(150) NOT NULL,
  cidade VARCHAR(150) NOT NULL,
  estado VARCHAR(150) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  CONSTRAINT fk_enderecos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  fornecedor_id INT NOT NULL,
  nome VARCHAR(160) NOT NULL,
  descricao VARCHAR(560) NULL,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  estoque INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id) ON UPDATE CASCADE,
  CONSTRAINT fk_produtos_fornecedor FOREIGN KEY (fornecedor_id)
    REFERENCES fornecedores(id) ON UPDATE CASCADE,
  CONSTRAINT chk_produtos_preco CHECK (preco >= 0),
  CONSTRAINT chk_produtos_estoque CHECK (estoque >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id)
    REFERENCES produtos(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  metodo VARCHAR(60) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
  data_pagamento DATETIME NULL,
  CONSTRAINT fk_pagamentos_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dados ficticios para testar o catalogo.
INSERT INTO categorias (nome, descricao)
SELECT 'Terrários', 'Recipientes e kits para pequenos ecossistemas.'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Terrários');
INSERT INTO categorias (nome, descricao)
SELECT 'Materiais de Biologia', 'Materiais para observacao e estudo.'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Materiais de Biologia');
INSERT INTO categorias (nome, descricao)
SELECT 'Culturas', 'Culturas educativas para atividades de biologia.'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Culturas');
INSERT INTO categorias (nome, descricao)
SELECT 'Conteúdo educativo', 'Guias e materiais de apoio.'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Conteúdo educativo');

INSERT INTO fornecedores (razao_social, cnpj, contato)
SELECT 'Fornecedor de Teste BioStore', NULL, 'contato@biostore-teste.local'
WHERE NOT EXISTS (SELECT 1 FROM fornecedores WHERE razao_social = 'Fornecedor de Teste BioStore');

INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque)
SELECT c.id, f.id, 'Terrário Mini', 'Um pequeno ecossistema decorativo para observar a natureza.', 59.90, 12
FROM categorias c CROSS JOIN fornecedores f
WHERE c.nome = 'Terrários' AND f.razao_social = 'Fornecedor de Teste BioStore'
AND NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Terrário Mini');

INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque)
SELECT c.id, f.id, 'Terrário de Vidro', 'Recipiente de vidro para montar seu próprio terrário.', 89.90, 8
FROM categorias c CROSS JOIN fornecedores f
WHERE c.nome = 'Terrários' AND f.razao_social = 'Fornecedor de Teste BioStore'
AND NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Terrário de Vidro');

INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque)
SELECT c.id, f.id, 'Lupa de Observação', 'Apoio para observar detalhes de folhas, rochas e outros objetos.', 24.90, 20
FROM categorias c CROSS JOIN fornecedores f
WHERE c.nome = 'Materiais de Biologia' AND f.razao_social = 'Fornecedor de Teste BioStore'
AND NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Lupa de Observação');

INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque)
SELECT c.id, f.id, 'Kit de Estudos de Biologia', 'Materiais didáticos para acompanhar atividades de biologia.', 74.90, 10
FROM categorias c CROSS JOIN fornecedores f
WHERE c.nome = 'Materiais de Biologia' AND f.razao_social = 'Fornecedor de Teste BioStore'
AND NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Kit de Estudos de Biologia');

INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque)
SELECT c.id, f.id, 'Kit de Cultura Educativa', 'Kit demonstrativo para atividades educativas.', 39.90, 6
FROM categorias c CROSS JOIN fornecedores f
WHERE c.nome = 'Culturas' AND f.razao_social = 'Fornecedor de Teste BioStore'
AND NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Kit de Cultura Educativa');

INSERT INTO produtos (categoria_id, fornecedor_id, nome, descricao, preco, estoque)
SELECT c.id, f.id, 'Guia Ilustrado da Natureza', 'Material educativo para conhecer melhor o mundo natural.', 29.90, 15
FROM categorias c CROSS JOIN fornecedores f
WHERE c.nome = 'Conteúdo educativo' AND f.razao_social = 'Fornecedor de Teste BioStore'
AND NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Guia Ilustrado da Natureza');
