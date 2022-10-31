const inquirer = require("inquirer");
const db = require("./config/connection");
const cTable = require("console.table");

// ***********************************************************
var arrayRoles = [];
var arrayMan = [];
var departments = [];
var employeesArray = [];

const getRoles = () => {
    const roles = `SELECT title FROM role;`;
    db.query(roles, (err, sqlRows) => {
        if (!err) {
            arrayRoles = sqlRows.map(data => ({
                rolesTitle: data.first_name + " " + data.last_name
            }))
            return arrayRoles;
        }
        return console.log(err);
    });
};
arrayRoles = getRoles();

const getDepts = () => {
    const depts = `SELECT name, id FROM department;`;
    db.query(depts, (err, sqlRows) => {
        if (!err) {
            departments=sqlRows.map(data => ({
                name : data.name,
                id: data.id
            }))
            return departments;
        }  
        return console.log(err);            
    }) 
};
departments = getDepts();

const getEmps = () => {
    const sql = 'SELECT first_name, last_name FROM employee;';
    db.query(sql, (err, sqlRows) => {
        if (!err) {
            employeesArray = sqlRows.map(data => ({
                employeeFullName: data.first_name + " " + data.last_name
            }))
            return employeesArray;
        }
        return console.log(err);
    }); 
};
employeesArray = getEmps();

const getManagers = () => {
    const query = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`;
    db.query(query, (err, res) => {
        if (!err) {
            arrayMan=res.map(data => ({
                managersFullName: data.first_name + " " + data.last_name
            }))
            return arrayMan;
        }
        return console.log(err);
    });  
};
arrayMan = getManagers();

// main functions
const viewDeptartments = () => {
    const query = `SELECT * FROM department;`;

    db.query(query, (err, sqlRows) => {
        if (!err) {
            console.table(sqlRows);
            return;
        }
        console.log(err);
    });
};

const viewRoles = () => {
    const query = `SELECT * FROM role`;

    db.query(query, (err, sqlRows) => {
        if (!err) {
            console.table(sqlRows);
            return;
        }
        console.log(err);
    });
};

const viewEmployee = () => {
    const query = `SELECT * FROM employee`;

    db.query(query, (err, sqlRows) => {
        if (!err) {
            console.table(sqlRows);
            return;
        }
        console.log(err);
        
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the new department?'
        }
    ]).then(deptTitle => {
        departments.push(deptTitle.name);
        const newName = deptTitle.dept;

        const query1 = `INSERT INTO department (name) VALUES ('${newName}');`;
        const query2 = `SELECT * FROM department;`;

        db.query(query1, (err) => {
            if (!err) {
                console.log('Successfully added');
                return;
            }
            console.log(err);
        });

        db.query(query2, (err, sqlRows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(sqlRows);
        });
    })
};

const Role = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
            validate: data => {
                if (!data) {
                    console.log('plz enter a title!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary as a number.',
            validate: function (data) {
                if (isNaN(data) || !data) {
                    console.log("Invalid input");
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'department_name',
            message: 'Select the department',
            choices: departments
        }
    ]).then(roleInfo => {
        
        const { title, salary, department_name } = roleInfo;
        arrayRoles.push(title);

        const query = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, (SELECT id FROM department WHERE name='${department_name}'));`;
        db.query(query, (err) => {
            if (err) {
                console.log(err);
                console.log("Failed! Current list: ")
                return;
            }
            console.log('Successfully added new Role. Updated list:');
        });

        const query2 = `SELECT * FROM role;`;
        db.query(query2, (err, sqlRows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(sqlRows);
        });
    })
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee.',
            validate: data => {
                if (!data) {
                    console.log('plz enter a first name!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Whatis the last name of the employee.',
            validate: data => {
                if (!data) {
                    console.log('plz enter the last name!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select role in the company.',
            choices: arrayRoles,
        },
        {
            type: 'list',
            name: 'managerName',
            message: 'Select the manager.',
            choices: arrayMan
        }
    ]).then(empInfo => {
        const { first_name, last_name, role, managerName } = empInfo;
        
        const manager_first_name = managerName.split(' ')[0];
        const manager_last_name = managerName.split(' ')[1];
        
        const sql = `SELECT id FROM employee WHERE first_name='${manager_first_name}' AND last_name='${manager_last_name}';`

        var empName = empInfo.first_name + " " + empInfo.last_name;
        employeesArray.push(empName);

        db.promise().query(sql).then((sqlRows) => {
            const manager_id = sqlRows[0][0].id;
            return manager_id;
        })
        .then(manager_id => {
            const sql2 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', (SELECT id FROM role WHERE title='${role}'), ${manager_id});`;
            db.query(sql2, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Successfully added new Role.');
            })             
        });
    })
};

const update = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeName',
            message: 'Select the employee name to update.',
            choices: employeesArray
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Select a new role.',
            choices: arrayRoles
        }
    ]).then(updatedInfo => {
        const { employeeName, newRole } = updatedInfo;
        const emp_first_name = employeeName.split(' ')[0];
        const emp_last_name = employeeName.split(' ')[1];

        const query = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title='${newRole}') WHERE first_name='${emp_first_name}' AND last_name='${emp_last_name}';`;
        db.query(query, (err) => {
            if (!err) {
                console.log('Successfully updated:');
                return;
            }
            console.log(err);
            console.log("Failed! ")
        });

        const query2 = `SELECT * FROM employee;`;
        db.query(query2, (err, sqlRows) => {
            if (!err) {
                console.table(sqlRows);
                return;
            }
            console.log(err);
        });
    })
};



// ***********************************************************


const promptMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((answer) => {
      ansEngine(answer);
    });
};

promptMenu();

function ansEngine(answer) {
  switch (answer.menu) {
    case "View All Departments":
      viewDeptartments();
      break;
    case "View All Roles":
      viewRoles();
      break;
    case "View All Employees":
      viewEmployee();
      break;
    case "Add a Department":
      addDepartment();
      break;
    case "Add a Role":
      Role();
      break;
    case "Add an Employee":
      addEmployee();
      break;
    case "Update an Employee Role":
      update();
      break;
  }
}
