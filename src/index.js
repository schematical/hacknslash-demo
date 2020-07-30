const express = require('express')
const app = express()
const port = 80
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sanitizeHtml = require('sanitize-html');
app.use(cookieParser())
app.use(bodyParser.urlencoded({}));
app.get('/', (req, res) => {

    res.send('Cheese');
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