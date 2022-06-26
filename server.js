// set up dependencies

const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_data'
    }
);

const allFunctions = {
    viewAllDepartments() {
        db.query('SELECT * FROM department', (err, results) => {
            if (err) console.error(err);
            console.table(results);
            return init();
        });
    },
    viewAllRoles() {
        db.query('SELECT * FROM role', (err, results) => {
            if (err) console.error(err);
            console.table(results);
            return init();
        });
    },
    viewAllEmployees() {
        db.query('SELECT employee.id, CONCAT(first_name, \' \', last_name) AS employee_name, manager_id, title, salary, name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;' 
            , (err, results) => {
            if (err) console.error(err);
            console.table(results);
            return init();
        });
    },
    // WHEN I choose to add a department
    // THEN I am prompted to enter the name of the department and that department is added to the database
    addDepartment() {
        inquirer.prompt(
            {
                type: 'input',
                message: 'What is the department\'s name?',
                name: 'newDepartment'
            }
        ).then((answer) => {
            const command = `INSERT INTO department (name) VALUES ('${answer.newDepartment}'); `;
            db.query(command.toString(), (err, results) => {
                if (err) console.error(err);
                console.table(results);
                return init();
            });
        });
    },
}

const init = () => {
    const choices = [
        {name: 'View All Departments', value: 'viewAllDepartments'},
        {name: 'View All roles', value: 'viewAllRoles'},
        {name: 'View All Employees', value: 'viewAllEmployees'},
        {name: 'Add a Deparment', value: 'addDepartment'},
        // {name: 'Add a Role', value: 'addRole'},
        // {name: 'Add an Employee', value: 'addEmployee'},
        // {name: 'Update an Employee Role', value: 'updateRole'},
    ];

    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'query',
            message: 'Select an Option',
            choices,
        }
    ]).then((answers) => allFunctions[answers.query]());
};

init();


// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 