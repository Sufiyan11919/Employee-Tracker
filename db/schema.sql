DROP DATABASE IF EXISTS register_db;
CREATE DATABASE register_db;

USE register_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT ,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(40),
    salary DECIMAL(10,3) NOT NULL,
    department_id INT, FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);
 
CREATE TABLE employee (
    id INT AUTO_INCREMENT ,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    role_id INT, FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    manager_id INT,
    PRIMARY KEY (id)
);