const request = require('supertest');
const sql = require('mssql');
const server = require('../server'); // Import the Express server instance
const Users = require('../Public/User'); // Import your Users module

describe('POST /signup', () => {
  let pool;

  beforeAll(async () => {
    // Establish database connection pool
    const config = {
      user: '',
      password: '',
      server: '',
      database: '',
      options: {
        encrypt: true, // For Azure SQL
        trustServerCertificate: false // For Azure SQL
      }
    };

    pool = await sql.connect(config);
  });

  afterAll(async () => {
    // Close database connection pool after all tests are done
    await pool.close();
  });

  it('should create a new user in the database when signing up', async () => {
    const newUser = {
      username: 'user6789',
      password: 'testpassword',
      weight: 70,
      age: 25,
      gender: 'male'
    };

    // Insert the new user into the database directly
    await pool.request()
      .input('username', sql.NVarChar, newUser.username)
      .input('password', sql.NVarChar, newUser.password)
      .input('weight', sql.Int, newUser.weight)
      .input('age', sql.Int, newUser.age)
      .input('gender', sql.NVarChar, newUser.gender)
      .query('INSERT INTO Users (username, password, weight, age, gender) VALUES (@username, @password, @weight, @age, @gender)');

    // Check if the user is created in the database
    const result = await pool.query`SELECT * FROM Users WHERE username = ${newUser.username}`;
    const user = result.recordset[0];

    expect(user).toBeDefined(); // Assert that the user exists in the database
    expect(user.username).toBe(newUser.username); 
  });
});
