CREATE DATABASE IF NOT EXISTS doacao_db;
USE doacao_db;

--  TABELAS

-- Tabela: Usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  idade INT NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  condicoes_saude TEXT,
  tipo_sanguineo VARCHAR(3) NOT NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Profissionais
CREATE TABLE profissionais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  registro_profissional VARCHAR(50) NOT NULL,
  contato VARCHAR(50),
  email VARCHAR(100),
  senha VARCHAR(255)
);

-- Tabela: Campanhas
CREATE TABLE campanhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL
);

-- Tabela: Admins
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Agendamentos
CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  data_agendamento DATE NOT NULL,
  horario TIME NOT NULL,
  status ENUM('PENDENTE','CONFIRMADO','CANCELADO') DEFAULT 'PENDENTE',
  campanha_id INT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (campanha_id) REFERENCES campanhas(id)
);

-- Tabela: Triagens
CREATE TABLE triagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agendamento_id INT NOT NULL,
  profissional_id INT NOT NULL,
  pressao VARCHAR(20),
  batimentos INT,
  temperatura DECIMAL(4,1),
  observacoes TEXT,
  status ENUM('APROVADO','REPROVADO') NOT NULL,
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id),
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
);

-- Tabela: Doações
CREATE TABLE doacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agendamento_id INT NOT NULL,
  usuario_id INT NOT NULL,
  data_doacao DATE NOT NULL,
  volume_coletado INT NOT NULL,
  tipo_sanguineo VARCHAR(3) NOT NULL,
  campanha_id INT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id),
  FOREIGN KEY (campanha_id) REFERENCES campanhas(id)
);

--  FUNCTIONS

DELIMITER //
CREATE FUNCTION pode_doar(p_usuario_id INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE ultima DATE;

    SELECT MAX(data_doacao)
    INTO ultima
    FROM doacoes
    WHERE usuario_id = p_usuario_id;

    IF ultima IS NULL THEN 
        RETURN TRUE;
    END IF;

    RETURN DATEDIFF(CURDATE(), ultima) >= 60;
END //
DELIMITER ;

--  VIEWS

CREATE OR REPLACE VIEW vw_agendamentos AS
SELECT 
    a.id,
    u.nome AS usuario,
    a.data_agendamento,
    a.horario,
    a.status,
    c.titulo AS campanha
FROM agendamentos a
LEFT JOIN campanhas c ON c.id = a.campanha_id
JOIN usuarios u ON u.id = a.usuario_id;

CREATE OR REPLACE VIEW vw_doacoes AS
SELECT 
    d.id,
    u.nome AS usuario,
    d.data_doacao,
    d.volume_coletado,
    d.tipo_sanguineo,
    c.titulo AS campanha
FROM doacoes d
LEFT JOIN campanhas c ON c.id = d.campanha_id
JOIN usuarios u ON u.id = d.usuario_id;

CREATE OR REPLACE VIEW vw_triagens AS
SELECT 
    t.id,
    t.agendamento_id,
    u.nome AS usuario,
    p.nome AS profissional,
    t.pressao,
    t.batimentos,
    t.temperatura,
    t.observacoes,
    t.status,
    a.data_agendamento
FROM triagens t
JOIN agendamentos a ON a.id = t.agendamento_id
JOIN usuarios u ON u.id = a.usuario_id
JOIN profissionais p ON p.id = t.profissional_id;

--  TRIGGERS

DELIMITER //
-- Impede agendamento duplicado por usuário no mesmo dia
CREATE TRIGGER trg_agendamento_unico
BEFORE INSERT ON agendamentos
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM agendamentos
        WHERE usuario_id = NEW.usuario_id
          AND data_agendamento = NEW.data_agendamento
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Usuário já possui agendamento neste dia.';
    END IF;
END //
DELIMITER ;

DELIMITER //
-- Cria doação automaticamente após triagem aprovada
CREATE TRIGGER trg_criar_doacao
AFTER INSERT ON triagens
FOR EACH ROW
BEGIN
    IF NEW.status = 'APROVADO' THEN
        INSERT INTO doacoes
        (agendamento_id, usuario_id, data_doacao, volume_coletado, tipo_sanguineo, campanha_id)
        SELECT 
            a.id,
            a.usuario_id,
            CURDATE(),
            450,
            u.tipo_sanguineo,
            a.campanha_id
        FROM agendamentos a
        JOIN usuarios u ON u.id = a.usuario_id
        WHERE a.id = NEW.agendamento_id;
    END IF;
END //
DELIMITER ;

--  PROCEDURES - CRUD COMPLETO

-- CRUD USUARIOS
DELIMITER //
CREATE PROCEDURE criar_usuario(
  IN p_nome VARCHAR(100),
  IN p_email VARCHAR(100),
  IN p_senha VARCHAR(255),
  IN p_idade INT,
  IN p_peso DECIMAL(5,2),
  IN p_condicoes TEXT,
  IN p_tipo VARCHAR(3)
)
BEGIN
  INSERT INTO usuarios (nome, email, senha, idade, peso, condicoes_saude, tipo_sanguineo)
  VALUES (p_nome, p_email, p_senha, p_idade, p_peso, p_condicoes, p_tipo);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE atualizar_usuario(
  IN p_id INT,
  IN p_nome VARCHAR(100),
  IN p_email VARCHAR(100),
  IN p_senha VARCHAR(255),
  IN p_idade INT,
  IN p_peso DECIMAL(5,2),
  IN p_condicoes TEXT,
  IN p_tipo VARCHAR(3)
)
BEGIN
  UPDATE usuarios
  SET nome = p_nome,
      email = p_email,
      senha = p_senha,
      idade = p_idade,
      peso = p_peso,
      condicoes_saude = p_condicoes,
      tipo_sanguineo = p_tipo
  WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE remover_usuario(IN p_id INT)
BEGIN
  DELETE FROM usuarios WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE listar_usuarios()
BEGIN
  SELECT * FROM usuarios ORDER BY data_cadastro DESC;
END //
DELIMITER ;

-- CRUD PROFISSIONAIS
DELIMITER //
CREATE PROCEDURE criar_profissional(
  IN p_nome VARCHAR(100),
  IN p_registro VARCHAR(50),
  IN p_contato VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_senha VARCHAR(255)
)
BEGIN
  INSERT INTO profissionais (nome, registro_profissional, contato, email, senha)
  VALUES (p_nome, p_registro, p_contato, p_email, p_senha);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE atualizar_profissional(
  IN p_id INT,
  IN p_nome VARCHAR(100),
  IN p_registro VARCHAR(50),
  IN p_contato VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_senha VARCHAR(255)
)
BEGIN
  UPDATE profissionais
  SET nome = p_nome,
      registro_profissional = p_registro,
      contato = p_contato,
      email = p_email,
      senha = p_senha
  WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE remover_profissional(IN p_id INT)
BEGIN
  DELETE FROM profissionais WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE listar_profissionais()
BEGIN
  SELECT * FROM profissionais ORDER BY nome;
END //
DELIMITER ;

-- CRUD CAMPANHAS
DELIMITER //
CREATE PROCEDURE criar_campanha(
  IN p_titulo VARCHAR(100),
  IN p_descricao TEXT,
  IN p_inicio DATE,
  IN p_fim DATE
)
BEGIN
  INSERT INTO campanhas (titulo, descricao, data_inicio, data_fim)
  VALUES (p_titulo, p_descricao, p_inicio, p_fim);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE atualizar_campanha(
  IN p_id INT,
  IN p_titulo VARCHAR(100),
  IN p_descricao TEXT,
  IN p_inicio DATE,
  IN p_fim DATE
)
BEGIN
  UPDATE campanhas
  SET titulo = p_titulo,
      descricao = p_descricao,
      data_inicio = p_inicio,
      data_fim = p_fim
  WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE remover_campanha(IN p_id INT)
BEGIN
  DELETE FROM campanhas WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE listar_campanhas()
BEGIN
  SELECT * FROM campanhas ORDER BY data_inicio DESC;
END //
DELIMITER ;

-- CRUD ADMINS
DELIMITER //
CREATE PROCEDURE criar_admin(
  IN p_nome VARCHAR(100),
  IN p_email VARCHAR(120),
  IN p_senha VARCHAR(255)
)
BEGIN
  INSERT INTO admins (nome, email, senha)
  VALUES (p_nome, p_email, p_senha);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE atualizar_admin(
  IN p_id INT,
  IN p_nome VARCHAR(100),
  IN p_email VARCHAR(120)
)
BEGIN
  UPDATE admins
  SET nome = p_nome, email = p_email
  WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE remover_admin(IN p_id INT)
BEGIN
  DELETE FROM admins WHERE id = p_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE listar_admins()
BEGIN
  SELECT id, nome, email, data_criacao FROM admins ORDER BY nome;
END //
DELIMITER ;

--  PROCEDURES - AGENDAMENTO (WORKFLOW COMPLETO)

-- Criar agendamento
DELIMITER //
CREATE PROCEDURE registrar_agendamento(
    IN p_usuario_id INT,
    IN p_data DATE,
    IN p_horario TIME,
    IN p_campanha_id INT
)
BEGIN
    INSERT INTO agendamentos (usuario_id, data_agendamento, horario, campanha_id)
    VALUES (p_usuario_id, p_data, p_horario, p_campanha_id);
END //
DELIMITER ;

-- Confirmar agendamento
DELIMITER //
CREATE PROCEDURE confirmar_agendamento(
    IN p_agendamento_id INT
)
BEGIN
    DECLARE v_status VARCHAR(20);

    SELECT status INTO v_status
    FROM agendamentos
    WHERE id = p_agendamento_id;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Agendamento não encontrado.';
    END IF;

    IF v_status = 'CANCELADO' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Agendamento cancelado não pode ser confirmado.';
    END IF;

    IF v_status = 'CONFIRMADO' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Agendamento já está confirmado.';
    END IF;

    UPDATE agendamentos
    SET status = 'CONFIRMADO'
    WHERE id = p_agendamento_id;
END //
DELIMITER ;

-- Cancelar agendamento
DELIMITER //
CREATE PROCEDURE cancelar_agendamento(
    IN p_agendamento_id INT
)
BEGIN
    DECLARE v_status VARCHAR(20);

    SELECT status INTO v_status
    FROM agendamentos
    WHERE id = p_agendamento_id;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Agendamento não encontrado.';
    END IF;

    IF v_status = 'CANCELADO' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Agendamento já está cancelado.';
    END IF;

    UPDATE agendamentos
    SET status = 'CANCELADO'
    WHERE id = p_agendamento_id;
END //
DELIMITER ;

--  TRIAGEM E DOAÇÃO

DELIMITER //
CREATE PROCEDURE registrar_triagem(
    IN p_agendamento INT,
    IN p_profissional INT,
    IN p_pressao VARCHAR(20),
    IN p_batimentos INT,
    IN p_temp DECIMAL(4,1),
    IN p_obs TEXT,
    IN p_status ENUM('APROVADO','REPROVADO')
)
BEGIN
    INSERT INTO triagens (agendamento_id, profissional_id, pressao, batimentos, temperatura, observacoes, status)
    VALUES (p_agendamento, p_profissional, p_pressao, p_batimentos, p_temp, p_obs, p_status);
END //
DELIMITER ;