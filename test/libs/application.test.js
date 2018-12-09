let Gentm = require('../../libs/Application');
let {Spider} = Gentm;
let app = new Gentm();
let HomeSpider = new Spider();
function parseBaiDu(response){

}

HomeSpider.addRequest('http://www.baidu.com',parseBaiDu);

app.addSpider(HomeSpider);
app.run();




