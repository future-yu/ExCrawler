let Spider = require('./Spider');

class Application {
    constructor(){
        this.Spider = Spider;
        this.spiders=[];
    }
    addSpider(spider){
        this.spiders.push(spider);
    }
    run(){
        setInterval(()=>{
            let spider = this.spiders.shift();
            if(spider){
                spider._start();
            }
        },0)
    }
}





module.exports =Application;
