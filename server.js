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
        ]).then((answers) => {
            const newRoleTitle = answers.newRoleTitle;
            const newRoleSalary = answers.newRoleSalary;

            const getChoices = `SELECT * FROM department`;

            db.query(getChoices, (err, results) => {
                if (err) console.error(err);
                const deptChoices = results.map(({name, id}) => ({name: name, value: id}));
                
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dept',
                        message: 'What department is this role in?',
                        choices: deptChoices
                    },
                ]).then((deptChoice) => {
                    const dept = deptChoice.dept;
                    const newRoleSql = `INSERT INTO role (title, salary, department_id) VALUES ('${newRoleTitle}', ${newRoleSalary}, ${dept});`
                    
                    db.query(newRoleSql, (err, results) => {
                        if (err) console.error(err);
                        console.log(results);
                        console.log(`${newRoleTitle} successfully added`);
                        return init();
                    })
                })
            })
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
        
        ]).then((answers) => {
            const firstName = answers.firstName;
            const lastName = answers.lastName;

            const getRoleChoices = `SELECT id, title FROM role;`;

            db.query(getRoleChoices, (err, results) => {
                if (err) console.error(err);
                const roleChoices = results.map(({title, id}) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'What is this employee\'s role?',
                        name: 'role',
                        choices: roleChoices
                    },
                ]).then((answer) => {
                    const role = answer.role;

                    const getManagerChoices = `SELECT CONCAT(first_name, last_name) AS name, id FROM employee;`;

                    db.query(getManagerChoices, (err, results) => {
                        if (err) console.error(err);
                        const managerChoices = results.map(({name, id}) => ({ name: name, value: id }));

                        inquirer.prompt([
                            {
                                type: 'list',
                                message: 'Who is this employee\'s manager?',
                                name: 'manager',
                                choices: managerChoices
                            }
                        ]).then((answer) => {
                            const manager = answer.manager;

                            const addEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${role}, ${manager});`

                            db.query(addEmployeeSql, (err, results) => {
                                if (err) console.error(err);
                                console.log(results);
                                console.log(`${firstName}${lastName} has been successfully added to employee`);
                                return init();
                            })
                        })
                    })
                })
            })
        })
    },
 
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




