SELECT employee.id, CONCAT(first_name, ' ', last_name) AS employee_name, manager_id, title, salary, name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;