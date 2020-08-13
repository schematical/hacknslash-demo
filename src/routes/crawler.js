const Xray = require('x-ray')
module.exports = (app)=>{
    app.get('/crawl', (req, res) => {

        var x = Xray()
        x('https://files.minecraftforge.net/', 'li:not(.elem-active)', [
            {
                title: 'a',
                link: 'a@href'
            }
        ])
        //.paginate('.nav-previous a@href')
        .limit(10)
        .then(function(results) {
            res.send(JSON.stringify(results, null, 3));
        })
        .catch(function(err) {
            res.status(500).send("ERROR:" + err.message);
        })
    })
}