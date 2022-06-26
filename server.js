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

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

const allFunctions = {
    viewAllDepartments() {
        db.query('SELECT * FROM department', (err, results) => {
            if (err) console.error(err);
            console.table(results);
            return init();
        })
    }
}

const init = () => {
    const choices = [
        {name: 'View All Departments', value: 'viewAllDepartments'},
        {name: 'View All roles', value: 'viewAllRoles'},
        {name: 'View All Employees', value: 'viewAllEmployees'},
        {name: 'Add a Deparment', value: 'addDepartment'},
        {name: 'Add a Role', value: 'addRole'},
        {name: 'Add an Employee', value: 'addEmployee'},
        {name: 'Update an Employee Role', value: 'updateRole'},
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

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 