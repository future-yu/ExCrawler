let App = require('../../libs/Application');

let app = new App();
let Spider = app.Spider;

let baiduSpider = new Spider();
baiduSpider.addRequest('http://www.codeceo.com/article/tag/java');
baiduSpider.use(function (response) {
    baiduSpider.addRequest('http://www.codeceo.com/article/tag/java');
});

app.addSpider(baiduSpider);

app.run();



