-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS reservas;
USE reservas;

-- Tabla usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL
);

-- Tabla tipos_recurso
CREATE TABLE tipos_recurso (
    id_tipo INT PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL
);

-- Tabla recursos_turisticos
CREATE TABLE recursos_turisticos (
    id_recurso INT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    id_tipo INT NOT NULL,
    descripcion TEXT,
    plazas INT NOT NULL,
    precio DECIMAL(8,2) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    hora_inicio TIME,
    hora_fin TIME,
    FOREIGN KEY (id_tipo) REFERENCES tipos_recurso(id_tipo)
);

-- Tabla reservas
CREATE TABLE reservas (
    id_reserva INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_recurso INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado VARCHAR(20) NOT NULL,
    presupuesto DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_recurso) REFERENCES recursos_turisticos(id_recurso)
);

-- Tabla detalle_reserva
CREATE TABLE detalle_reserva (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT NOT NULL,
    cantidad_personas INT NOT NULL,
    observaciones VARCHAR(255),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva)
);