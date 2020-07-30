module.exports = (app)=>{
    app.services = {};
    require('./mysql')(app);
}