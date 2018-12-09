let Spider = require('../../libs/Spider');


let novelSpider = new Spider();
function parseNext(response){

}
function parseIndex(response){
    novelSpider.addRequest('http://www.555x.org/html/kehuanxiaoshuo/list_74_1.html',parseNext)
}



novelSpider.addRequest('http://www.555x.org/',parseIndex);


novelSpider._start();
