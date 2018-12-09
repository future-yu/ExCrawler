const Events = require('events');
const request = require('request');
const Utils = require('../utils/Utils');
const ObjectAction = require('../utils/ObjectAction');
class Spider extends Events {
    constructor(config={}) {
        super();
        this.retryTimes = 3;
        this.urls = [];
        let _config = {
            method: 'GET',
            headers: Utils.getHeaders(),
            time: true,
            timeout: 3000,
            gzip: true
        };

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
    _RequestFactory(url,parse,config){
        let allRequest=[];
        if(Utils.getType(url)=='String'){
            let reqObj = {};
            let config_req = ObjectAction.mergeSame(this._getDefaultConfig(),config);
            config_req.url = url;
            reqObj.times=0;
            reqObj.parse = parse;
            reqObj.config_req = config_req;
            allRequest.push(reqObj);
        }
        if(Utils.getType(url)=='Array'){
            url.forEach((item)=>{
                let reqObj = {};
                let config_req = ObjectAction.mergeSame(this._getDefaultConfig(),config);
                config_req.url = item;
                reqObj.times=0;
                reqObj.parse = parse;
                reqObj.config_req = config_req;
                allRequest.push(reqObj);
            });
        }
        return allRequest;
    }

    //添加请求
    addRequest(url,parse,config={}) {
        let _this = this;
        //判定是否为空
        if(!url){
            return;
        }
        //判断解析函数
        if(!parse){
            return;
        }
        let allParse = [];
        //判断parse类型
        switch (Utils.getType(parse)) {
            case 'Function':
                allParse.push(parse);
                break;
            case 'Array':
                parse.forEach((item)=>{
                    if(Utils.getType(item)!=='Function'){
                        _this.emit('error','解析数组内只能是Function类型');
                    }
                });
                allParse = parse;
                break;
            default:
                _this.emit('error','解析参数只能是Function或含Function的数组');
        }

        //判断url类型
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

        //判断config类型
        if (Utils.getType(config)!=='Object'){
            this.emit('error','addRequest的第二个参数config格式错误');
        }
        this.urls = this._RequestFactory(url,allParse,config).concat(this.urls);
    }

    changeConfig(config) {
        this.retryTimes = config.retryTimes;
    }

    _request(config) {
        return new Promise((resolve, reject) => {
            request(config, function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
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
        _this._request(reqCon.config_req).then((res) => {
            if (res.statusCode > 399) {
                _this.emit('error', res);
            } else {
                Utils.pipeline(reqCon.parse)(res);
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



