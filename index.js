const express = require('express')
const mysql = require('mysql')
const path = require('path');

// --------------------------------------------------- //
// SQL FUNCTIONS //

function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect((err) => {
    if(err) {
      console.log('error when connecting to db:', err.code);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
      console.log('reconnecting...')
    } else throw err;
  });
}

var connection;
var db_config = {
  host:'remotemysql.com',
  user:'OFXrpcdAxU',
  password:'lYz3UbeUSw',
  database:'OFXrpcdAxU'
};

handleDisconnect();

function cmd (arg) {
  connection.query(arg, function (err, result) {
    console.log(result);
  });
}

// --------------------------------------------------- //
// EXPRESS FUNCTIONS //

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(path.join(__dirname + '/public')));

app.post('/api/post', (req, res) => {
  const b = req.body
  connection.query(`INSERT INTO oper (title, amount, comment, date, addedAt) VALUES ("${b.title}", ${b.amount}, "${b.comment}", "${b.date}", NOW())`, function (err, result) {
    console.log('add: done!')
  });
  res.redirect('/');
})

app.get('/api/remove/:id', (req, res) => {
  connection.query(`DELETE FROM oper WHERE oper.id = ${req.params.id}`, function (err, result) {
    console.log('remove: done!')
  });
  res.redirect('/');
})

app.get('/api/load', (req, res) => {
  connection.query("SELECT * FROM oper ORDER BY date", function (err, result) {
    res.send(result);
  });
})

app.listen(port)

// --------------------------------------------------- //
// MAIN FUNCTIONS //
