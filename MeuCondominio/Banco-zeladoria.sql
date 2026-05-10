-- Criação e uso do Banco de Dados
CREATE DATABASE zeladoria_db;
USE zeladoria_db;

-- Criação da Tabela de Moradores
CREATE TABLE moradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- O Spring Boot salvará o hash aqui
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da Tabela de Síndicos/Zeladores
CREATE TABLE sindicos_zeladores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL, -- Ex: Síndico, Zelador Chefe
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da Tabela de Chamados
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    local_ocorrencia VARCHAR(100) NOT NULL,
    data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Aberto', 'Em Análise', 'Em Execução', 'Concluído') DEFAULT 'Aberto',
    morador_id INT NOT NULL,
    responsavel_id INT,
    CONSTRAINT fk_morador
        FOREIGN KEY (morador_id) 
        REFERENCES moradores(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_responsavel
        FOREIGN KEY (responsavel_id) 
        REFERENCES sindicos_zeladores(id)
        ON DELETE SET NULL
);

-- Inserindo Dados de Teste (Massa de Dados)
INSERT INTO sindicos_zeladores (nome, cargo, email, senha) 
VALUES ('Carlos Almeida', 'Síndico', 'sindico@condominio.com', 'hash_senha_aqui');

INSERT INTO moradores (nome, unidade, email, senha) 
VALUES ('Ana Souza', 'Apto 101', 'ana@email.com', 'hash_senha_aqui');

INSERT INTO chamados (titulo, descricao, local_ocorrencia, morador_id) 
VALUES (
    'Infiltração na garagem', 
    'Há uma goteira forte perto da vaga 12 toda vez que chove.', 
    'Garagem Subsolo', 
    1
);