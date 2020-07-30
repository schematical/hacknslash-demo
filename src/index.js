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
    let query = 'INSERT INTO `hacknslash`.`Users` (`username`,`bio`) VALUES ("' + username + '", "' + req.body.bio + '")';
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
        '<textarea name="bio"></textarea>' +
        '<button type="submit">Save</button>' +
        '</form>' +
        '')
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