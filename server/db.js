const mysql=require('mysql2');
const db = mysql.createConnection({
    host: "localhost",
    user:"root",    
    //password:"password",
    password:"database",
    //password:"valjeta1!",
    //password: "mysqldb",
    //password:"mysql123",
    //password: "mysqldb",
    //password:"mysql123",
    //password:"valjeta1!",
    database:"hospital_management",
    
   

});
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});
module.exports=db;
