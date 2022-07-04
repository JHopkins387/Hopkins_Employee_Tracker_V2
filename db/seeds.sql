USE employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 85000, 1),
    ('Lead Engineer', 125000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 180000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 300000, 4),
    ('Lawyer', 185000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 1, NULL),
    ('Sam', 'Wayne', 2, 1),
    ('Ashley', 'Lopez', 3, NULL),
    ('Kevin', 'Rodriguez', 4, 3),
    ('Alexander', 'Williams', 5, NULL),
    ('Maria', 'Alvez', 6, 5),
    ('Clark', 'Kent', 7, NULL),
    ('Barry', 'Allen', 8, 7);