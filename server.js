// set up dependencies

const mysql = require('mysql2');
const inquirer = require('inquirer');
const { debounce } = require('rxjs');
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
    addRole() {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is this role\'s name?',
                name: 'newRoleTitle'
            },
            {
                type: 'input',
                message: 'What is the salary for this role?',
                name: 'newRoleSalary'
            },
            {
                type: 'input',
                message: 'What department is the role a part of?',
                name: 'newRoleDept'
            },
        ]).then((answers) => {
            const depIdTemp = `SELECT id FROM department WHERE name = '${answers.newRoleDept}'`;
            db.query(depIdTemp.toString(), (err, results) => {
                if (err) console.error(err);
                const print = Object.values(results[0]).toString();
                console.log(parseInt(print));
                const inputID = parseInt(print);
                const command = `INSERT INTO role (title, salary, department_id) VALUES ('${answers.newRoleTitle}', ${answers.newRoleSalary}, ${inputID})`;
                db.query(command.toString(), (err, results) => {
                    if (err) console.error(err);
                    console.table(results);
                    return init();
            });
            });
            
        });
    },
    addEmployee() {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the employee\'s first name',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'What is the employee\'s last name',
                name: 'lastName'
            },
            {
                type: 'input',
                message: 'What is the employee\'s role',
                name: 'role'
            },
            {
                type: 'input',
                message: 'What is the employee\'s manager\'s name? If none, enter \'none\'',
                name: 'manager'
            },
        ]).then((answers) => {
            const getManagerId = `SELECT id FROM employee WHERE CONCAT(first_name, \' \', last_name) = \'${answers.manager}\';`;
            const getRoleId = `SELECT id FROM role WHERE title = \'${answers.role}\'`;
            db.query(getRoleId, (err, results) => {
                if (err) console.error(err);
                const str = Object.values(results[0]).toString();
                console.log(parseInt(str));
                const roleID = parseInt(str);
                if (results.manager === 'none') {
                    const command = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (\'${answers.firstName}\', \'${answers.lastName}\', ${roleID}, NULL);`;
                    db.query(command, (err, results) => {
                        if (err) console.error(err);
                        console.table(results);
                        return init();
                    })
                } else {
                    db.query(getManagerId, (err, results) => {
                        if (err) console.error(err);
                        const print = Object.values(results[0]).toString();
                        console.log(parseInt(print));
                        const inputID = parseInt(print);
                        const command = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (\'${answers.firstName}\', \'${answers.lastName}\', ${roleID}, ${inputID});`;
                        db.query(command, (err, results) => {
                            if (err) console.error(err);
                            console.table(results);
                            return init();
                        })
                    }) 
                } 
            })
        })
    },
    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
    // updateRole() {
    //     const getEmployeeChoices = 'SELECT * FROM employee'
    //     db.query(getEmployeeChoices, (err, results) => {
    //         if (err) console.error(err);
    //         const employeeChoices = results.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
    //         inquirer.prompt([
    //             {
    //                 type: 'list',
    //                 name: 'name',
    //                 message: 'Which employee do you want to update?',
    //                 choices: employeeChoices
    //             }
    //         ]).then(choice => {
    //             const 
    //         })
    //     })
    // }
}

const init = () => {
    const choices = [
        {name: 'View All Departments', value: 'viewAllDepartments'},
        {name: 'View All roles', value: 'viewAllRoles'},
        {name: 'View All Employees', value: 'viewAllEmployees'},
        {name: 'Add a Deparment', value: 'addDepartment'},
        {name: 'Add a Role', value: 'addRole'},
        {name: 'Add an Employee', value: 'addEmployee'},
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




