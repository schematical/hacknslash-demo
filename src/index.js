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
require('./routes')(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))