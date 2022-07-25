const inquirer = require('inquirer');
const cTable = require('console.table');
//require connection.js page for mysql2 setup
const db = require('./db/connection');
const res = require('express/lib/response');

//Start Prompts
const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do now?',
        choices: [
            'View all current employees',
            'Add a employee',
            'Update a employee Role',
            'View all roles',
            'Add a role',
            'View all departments',
            'Add a department',
            'Quit'
        ]
    }
]

//Add a new employee
const employeeInfo = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is their first name?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is their last name?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the role ID?'
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the manager ID?'
    }
]

//Update roles
const employees = [
    {
        type: 'input',
        name: 'employeeID',
        message: 'Input a Employee ID'
    },
    {
        type: 'input',
        name: 'roleID',
        message: 'Input a updated role ID'
    }
]

//Create a new role
const newRole = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the role title?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary they make?'
    },
    {
        type: 'input',
        name: 'dept',
        message: 'What is the dept ID for this role gonna be?'
    }
]

//Create a new department
const newDept = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?'
    }
]

//View all the employees
let viewAllEmployees = function () {
    db.query(
        'SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN department ON roles.department_id = department.id',
        function (err, results) {
            console.table(results);
            init();
        })
}

//-------Add the Employee functions----------

//creatting a function that grabs the role values from the database and uses the  map method to add them to an array. The array is then saved to a variable called 'role' and 'managerName'
let addEmployeePrompt = function () {
    let sql =
        `SELECT  
    roles.id,
    roles.title, 
    roles.salary,
    employee.manager_id,
    CONCAT(manager.first_name, " ", manager.last_name) 
    AS manager 
    FROM employee 
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    `
    db.query(sql, (err, results) => {
        if (err) throw err;
        const role = results.map(({ title, salary }) => ({
            title: title,
            salary: salary
        }));
        const managerName = results.map(({ manager }) => ({
            firstLastName: manager
        }));

        console.table(role);
        console.table(managerName);
        addEmployeeArray(role, managerName);
    });
}

//Now we add the array 'role' to the list of choices that our prompt has
let addEmployeeArray = function (x, y) {
    console.log(x);
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is their first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is their last name?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the role ID?',
            choices: x
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'What is the manager ID?',
            choices: y
        }
    ]).then((answers) => {
        addEmployee(answers)
    })
}

//Here we take the answers from we get from the prompt and insert them into database

let addEmployee = function (answers) {
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
    const params = [answers.first_name, answers.last_name, answers.role_id, answers.manager_id];
    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        viewAllEmployees();
    })
}
//--- The end of the add Employee Functions Section ---


//-----Updating Employee Roles-----

let getRoles = function () {
    let sql =
        `SELECT * FROM roles`
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
    })
}

let updateRole = function (answers) {
    const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const params = [answers.roleID, answers.employeeID]

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        viewAllEmployees();
    })
}

//View all the roles
let viewRoles = function () {
    db.query('SELECT department.name, roles.title, roles.salary, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id',
        function (err, results) {
            console.table(results);
            init();
        })
}

//Adding new roles
let addRole = function (answers) {
    const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)';
    const params = [answers.title, answers.salary, answers.dept];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        viewRoles();
    })
}

//Viewing all the departments
let viewDepts = function () {
    db.query('SELECT * FROM department',
        function (err, results) {
            console.table(results);
            init();
        })
}

//Adding a new department
let newDepartment = function (answers) {
    const sql = 'INSERT INTO department (name) VALUES (?)';
    const params = [answers.name];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        viewDepts();
    })
}

//---Starting/Initializing the app ---

let init = function () {
    inquirer.prompt(questions)
        .then((answers) => {
            if (answers.action === 'View all current employees') {
                viewAllEmployees();
            }
            if (answers.action === 'Add a employee') {

                addEmployeePrompt();
            }
            if (answers.action === 'Update a employee Role') {
                inquirer.prompt(employees).then((answers) => {
                    getRoles();
                })
            }
            if (answers.action === 'View all roles') {
                viewRoles()
            }
            if (answers.action === 'Add a role') {
                inquirer.prompt(newRole).then((answers) => {
                    addRole(answers);
                })
            }
            if (answers.action === 'View all departments') {
                viewDepts();
            }
            if (answers.action === 'Add a department') {
                inquirer.prompt(newDept).then((answers) => {
                    newDepartment(answers);
                })
            }
        })
}


init();

/______________/
