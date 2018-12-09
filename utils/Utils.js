class Utils {
    static getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    static getHeaders() {
        const USER_AGENT = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
            'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/63.0'
        ];
        let HEADERS = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
            'Cache-Control': 'max-age=0',
            'Connection': 'Keep-Alive',
            'User-Agent': USER_AGENT[Math.round(this.getRandom(0, USER_AGENT.length-1))]
        };
        return HEADERS;
    }
    //管道函数
    static pipeline(funcs) {
        return (val) => {
            return funcs.reduce((a, b) => {
                return b(a);
            }, val)
        };
    }
    //判断类型
    static getType(data){
        let typeStr = Object.prototype.toString.apply(data);
        switch (typeStr) {
            case "[object String]":
                return 'String';
            case "[object Object]":
                return 'Object';
            case  "[object Array]":
                return 'Array';
            case "[object Number]":
                return 'Number';
            case "[object Null]":
                return 'Null';
            case  "[object Undefined]":
                return 'Undefined';
            case "[object Symbol]":
                return 'Symbol';
            case "[object Function]":
                return 'Function';

        }
    }
    //检测URL
    static isUrl(url){
        return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ig.test(url);
    }
}
module.exports = Utils;
