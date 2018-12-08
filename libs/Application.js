let Spider = require('./Spider');

class Application {
    constructor(){
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

Application.Spider = Spider;



module.exports =Application;
