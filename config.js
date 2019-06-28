//load modules
require('dotenv').config();

module.exports = {
  database:{
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    socketPath: process.env.DB_SOCKET
  }
}
