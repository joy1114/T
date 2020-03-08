var mysql = require('mysql');

module.exports = function(sql, arr, callback) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'read',
    port: 3306
  });
  
  connection.connect();
  
  connection.query(sql, arr, callback);
  
  connection.end();
}