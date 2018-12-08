const Events = require('events');
const request = require('request');
const Utils = require('../utils/Utils');
const ObjectAction = require('../utils/ObjectAction');
class Spider extends Events {
    constructor(config={}) {
        super();
        this.middlewares = [];
        this.retryTimes = 3;
        this.urls = [];
        let _config = {
            method: 'GET',
            headers: Utils.getHeaders(),
            time: true,
            timeout: 3000,
            gzip: true
        };

        config = config||{};
        if(Utils.getType(config) !=='Object'){
            this.emit('error','参数必须是纯Object类型-->{xxx:xxx}');
        }
        if (Utils.getType(config) == 'Object') {
            ObjectAction.mergeSame(_config,config);
        }
        this.requestConfig = _config;
    }

    _getDefaultConfig(){
        return ObjectAction.deepCopy(this.requestConfig);
    }

    //产生URL对象
    _RequestFactory(url,config){
        let allRequest=[];
        if(Utils.getType(url)=='String'){
            let config_req = ObjectAction.mergeSame(this._getDefaultConfig(),config);
            config_req.url = url;
            config_req.times=0;
            allRequest.push(config_req);
        }
        if(Utils.getType(url)=='Array'){
            url.forEach((item)=>{
                let config_req = ObjectAction.mergeSame(this._getDefaultConfig(),config);
                config_req.url = item;
                config_req.times=0;
                allRequest.push(config_req);
            });
        }
        return allRequest;
    }

    //添加请求
    addRequest(url,config={}) {
        let _this = this;
        //判定是否为空
        if(!url){
            return;
        }

        switch (Utils.getType(url)) {
            case 'String':
                if(!Utils.isUrl(url)){
                    this.emit('error','addRequest的第一个参数url格式错误');
                }
                break;
            case 'Array':
                url.forEach((item)=>{
                    if(!Utils.isUrl(item)){
                        this.emit('error','addRequest的第一个参数url格式错误');
                    }
                });
                break;
            default:
                _this.emit('error','url只允许是String或Array类型');
        }

        if (Utils.getType(config)!=='Object'){
            this.emit('error','addRequest的第二个参数config格式错误');
        }
        this.urls = this._RequestFactory(url,config).concat(this.urls);
    }

    changeConfig(config) {
        this.retryTimes = config.retryTimes;
    }

    use(fn) {
        this.middlewares.push(fn);
    }

    _request(config) {
        return new Promise((resolve, reject) => {
            request(config, function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response)
            })
        })
    }

    //初始化事件
    _init() {
        let _this = this;
        //处理错误事件
        if(this.listenerCount('error')==0){
            this.on('error', (err) => {
                throw new Error(err);
            });
        }
        this.on('req', () => {
            _this._exRequest(_this);
        });
    }

    //执行请求
    _exRequest(_this) {
        let reqCon = _this.urls.pop();
        let time = reqCon.times;
        _this._request(reqCon).then((res) => {
            if (res.statusCode > 399) {
                _this.emit('error', res);
            } else {
                Utils.pipeline(_this.middlewares)(res);
            }
        }).catch((e) => {
            if (time < 3) {
                reqCon.times++;
                _this.urls.unshift(reqCon);
            }else{
                _this.emit('req-fail', e);
            }
        });

    }

    //开启爬虫
    async _start() {
        let _this = this;
        this._init();
        setInterval(() => {
            let len = _this.urls.length;
            if (len > 0) {
                _this.emit('req')
            }
        }, 0)
    }
}

module.exports = Spider;



