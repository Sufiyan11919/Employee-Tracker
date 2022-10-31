INSERT INTO department (name)
VALUES 
    ("Quality"),
    ("Adminstrative"),
    ("HR"),
    ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("HR Head", 205000, 3),
    ("Adminstrative manager", 100000, 2),
    ("Jr Engineer", 250000, 4),
    ("Sr Engineer", 275000, 2),
    ("Quality Consultant", 160000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Subedar", "verna", 3, null),
    ("Rehan", "Sombhu", 2, 2),
    ("Abid", "Chaman", 1, 1),
    ("Suraj","Rand", 6, 1),
    ("Kaantmalkar", "Shaikh", 4, 3);