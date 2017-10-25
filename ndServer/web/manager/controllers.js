const controllers = {

    helloWorld:function(req,res,next){
        res.send('Hello');
    }

}

module.exports = {
    controllers: controllers
}
