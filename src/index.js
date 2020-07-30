const express = require('express');
const app = express();
const port = 80;
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sanitizeHtml = require('sanitize-html');
app.use(cookieParser())
app.use(bodyParser.urlencoded({}));
require('./services')(app);
app.get('/', (req, res) => {

    res.send('Cheese');
})
app.get('/users', (req, res) => {
    const connection = app.services.mysql.connect();
    connection.query('SELECT * FROM Users', function (error, results, fields) {
        if (error) {
            res.status(500);
console.log(error);
            return res.send(error.message);
        }
        return res.send(JSON.stringify(results, null, 3));
    });
})
app.post('/users', (req, res) => {
    const connection = app.services.mysql.connect();
    let username = req.body.username;
    if(!username){
        res.status(400);
        return res.send("Gimme a username");
    }
    let password = req.body.password;
    if(!password){
        res.status(400);
        return res.send("Gimme a password");
    }
    let query = 'INSERT INTO `hacknslash`.`Users` (`username`, `password`, `bio`) VALUES ("' + username + '", "'  + password + '", "'  + req.body.bio + '")';
    console.log(query);
    connection.query(query, function (error, results, fields) {
        if (error) {
            res.status(500);
            console.log(error);
            return res.send(error.message);
        }
        return res.send(JSON.stringify(results, null, 3));
    });
})

app.get('/users/new', (req, res) => {

    res.send('' +
        '<form action="/users" method="post">' +
        '<input type="text" name="username" />' +
        '<input type="password" name="password" />' +
        '<textarea name="bio"></textarea>' +
        '<button type="submit">Save</button>' +
        '</form>' +
        '')
})
app.get('/users/login', (req, res) => {

    res.send('' +
        '<form action="/users/login" method="post">' +
        '<input type="text" name="username" />' +
        '<input type="password" name="password" />' +
        '<button type="submit">Save</button>' +
        '</form>' +
        '')
})
app.post('/users/login', (req, res) => {

    const connection = app.services.mysql.connect();
    let username = req.body.username;
    let password = req.body.password;
    let allowEvil = true;
    if(!allowEvil){
        username = connection.escape(req.body.username);
        password = connection.escape(req.body.password);
    }
    let query = 'SELECT * FROM Users WHERE username = "' + username + "' AND password = '" + password + '"';
    console.log(query);
    connection.query(query, function (error, results, fields) {
        if (error) {
            res.status(500);
            console.log(error);
            return res.send(error.message);
        }
        return res.send(JSON.stringify(results, null, 3));
    });
})
app.get('/users/:user', (req, res) => {
    const connection = app.services.mysql.connect();

    let query = 'SELECT * FROM `hacknslash`.`Users` WHERE username = "' + req.params.user +'"';
    console.log(query);
    connection.query(query, function (error, results, fields) {
        if (error) {
            res.status(500);
            console.log(error);
            return res.send(error.message);
        }
        return res.send(JSON.stringify(results, null, 3));
    });
})
app.get('/profile/edit', (req, res) => {
    let body = fs.readFileSync('/home/user1a/mlea/WebstormProjects/hack-n-slash/tmp/blah.json');

    res.send('' +
        '<form action="/profile" method="post">' +
        '<textarea name="text">' + body + '</textarea>' +
        '<button type="submit">Save</button>' +
        '</form>' +
        '')
})
app.get('/profile', (req, res) => {
    let body = fs.readFileSync('/home/user1a/mlea/WebstormProjects/hack-n-slash/tmp/blah.json');

    res.send('' +
        '<h1>Schematical\'s Proifle</h1>' +
        '<a href="/profile/edit">Edit</a><br/>' +
        body +

        '')
})
app.post('/profile', (req, res) => {
    //If you want to allow evil use the following:
    let allowEvil = true;
    let escapedText = req.body.text;
    if(!allowEvil) {
        escapedText = sanitizeHtml(req.body.text);
    }
    fs.writeFileSync('/home/user1a/mlea/WebstormProjects/hack-n-slash/tmp/blah.json', escapedText);
    res.send("Saved");
})
app.get('/debug', (req, res) => {
    res.send(JSON.stringify(req.cookies, null, 3));
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))