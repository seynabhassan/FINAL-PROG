const { Connection, Request, TYPES } = require('tedious');
const config = require('./config');

const Users = (operation, obj) => new Promise((resolve, reject) => {
        const connection = new Connection(config);
        let response = "";
        let query = '';
        let parameters = {};

        switch (operation) {
            case 'create':
                query = 'INSERT INTO Users (username, password, weight, age, gender) VALUES (@username, @password, @weight, @age, @gender)';
                parameters = {
                    username: TYPES.NVarChar,
                    password: TYPES.NVarChar,
                    weight: TYPES.Int,
                    age: TYPES.Int,
                    gender: TYPES.NVarChar
                };
                break;
            case 'get':
                query = 'SELECT * FROM Users WHERE username = @username';
                parameters = {
                    username: TYPES.NVarChar
                };
                break;
            default:
                console.log('No operation specified');
                reject(new Error('No operation specified'));
        }

        const request = new Request(query, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(response);
                connection.close();
            }
        });

        Object.keys(parameters).forEach((name) => {
            request.addParameter(name, parameters[name], obj[name]);
        });

        request.on('row', (columns) => {
            response = {};
            columns.forEach((column) => {
                response[column.metadata.colName] = column.value;
            });
        });

        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                connection.execSql(request);
            }
        });

        connection.connect();
    });

module.exports = Users;
