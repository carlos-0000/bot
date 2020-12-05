const mysql = require('mysql2');

class DB {
  constructor(){
    if(!DB.instance){
      this.conexion = this.connection();
      DB.instance = this;
    }
    return DB.instance;
  }

  connection(){
    return mysql.createConnection({
      host     : 'localhost',
      // user     : 'software',
      // password : 'rpbts',
      user     : 'software',
      password : 'rpbts',
      database : 'ticketsoft',
      dateStrings:true
    });
  }
}

module.exports = new DB().conexion;
