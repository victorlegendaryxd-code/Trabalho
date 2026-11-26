-- EstudaComigo (MySQL 8+)
CREATE DATABASE IF NOT EXISTS estudacomigo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE estudacomigo;
CREATE TABLE users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('student','tutor','teacher') NOT NULL DEFAULT 'student',
 bio TEXT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE subjects (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL UNIQUE,
 description VARCHAR(255) NULL
);
CREATE TABLE tutor_subjects (
 tutor_id BIGINT UNSIGNED NOT NULL,
 subject_id BIGINT UNSIGNED NOT NULL,
 hourly_rate DECIMAL(8,2) NULL,
 PRIMARY KEY(tutor_id,subject_id),
 FOREIGN KEY(tutor_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE TABLE study_sessions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 student_id BIGINT UNSIGNED NOT NULL,
 tutor_id BIGINT UNSIGNED NOT NULL,
 subject_id BIGINT UNSIGNED NOT NULL,
 scheduled_at DATETIME NOT NULL,
 status ENUM('requested','confirmed','cancelled','completed') DEFAULT 'requested',
 notes TEXT NULL,
 FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(tutor_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(subject_id) REFERENCES subjects(id)
);
CREATE TABLE study_materials (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 session_id BIGINT UNSIGNED NULL,
 uploader_id BIGINT UNSIGNED NOT NULL,
 subject_id BIGINT UNSIGNED NOT NULL,
 title VARCHAR(180) NOT NULL,
 url VARCHAR(2048) NOT NULL,
 description TEXT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(session_id) REFERENCES study_sessions(id) ON DELETE SET NULL,
 FOREIGN KEY(uploader_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(subject_id) REFERENCES subjects(id)
);
INSERT INTO subjects(name,description) VALUES
('Matemática','Álgebra, geometria e resolução de exercícios'),
('Português','Gramática e interpretação'),
('Física','Conceitos e exercícios'),
('Química','Reações e conteúdos'),
('Biologia','Vida e ciências'),
('História','Sociedade e passado'),
('Geografia','Espaço e território'),
('Inglês','Vocabulário e conversação'),
('Informática','Tecnologia e programação'),
('Redação','Escrita e argumentação'),
('Filosofia','Ideias e pensamento'),
('Sociologia','Sociedade e cultura');
