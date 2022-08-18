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
  connection.query(`INSERT INTO oper (title, amount, comment, category, date, addedAt) VALUES ("${b.title}", ${b.amount}, "${b.comment}", ${b.category}, "${b.date}", NOW())`, function (err, result) {
    console.log('add(o): done!')
  });
  res.redirect('/');
})

app.post('/api/edit', (req, res) => {
  const b = req.body
  connection.query(`UPDATE oper SET title="${b.title}", amount=${b.amount}, comment="${b.comment}", category=${b.category}, date="${b.date}" WHERE ID=${b.id}`, function (err, result) {
    console.log('edit(o): done!')
  });
  res.redirect('/');
})

app.post('/api/reg', (req, res) => {
  const b = req.body
  connection.query(`INSERT INTO work (amount, date, rate, addedAt) VALUES ("${b.amount}", "${b.date}", ${b.rate}, NOW())`, function (err, result) {
    console.log('add(w): done!')
  });
  res.redirect('/reg.html');
})

app.get('/api/info/:id', (req, res) => {
  connection.query(`SELECT * FROM oper WHERE oper.id = ${req.params.id}`, function (err, result) {
    res.send(result);
  });
})

app.get('/api/remove/:id', (req, res) => {
  connection.query(`DELETE FROM oper WHERE oper.id = ${req.params.id}`, function (err, result) {
    console.log('remove(o): done!')
  });
  res.redirect('/');
})

app.get('/api/reg/remove/:id', (req, res) => {
  connection.query(`DELETE FROM work WHERE work.id = ${req.params.id}`, function (err, result) {
    console.log('remove(w): done!')
  });
  res.redirect('/reg.html');
})

app.get('/api/reg/clear', (req, res) => {
  connection.query(`DELETE FROM work`, function (err, result) {
    console.log('remove(w+): done!')
    res.send(result);
  });
  res.redirect('/reg.html');
})

app.get('/api/load', (req, res) => {
  connection.query("SELECT * FROM oper ORDER BY date DESC, addedAt DESC, id DESC", function (err, result) {
    res.send(result);
  });
})

app.get('/api/load/reg', (req, res) => {
  connection.query("SELECT * FROM work ORDER BY date DESC, addedAt DESC, id DESC", function (err, result) {
    res.send(result);
  });
})

app.listen(port)

// --------------------------------------------------- //
// MAIN FUNCTIONS //
