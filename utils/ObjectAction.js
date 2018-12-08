class ObjectAction {
    static shallowCopy(rawObj) {
        return Object.assign({}, rawObj);
    }
    //合并对象（相同的属性合并）
    static mergeSame(originObj,targetObj){
        for (let attr in targetObj){
            if(originObj[attr]){
                if(this.getType(originObj[attr])=='Object'&&this.getType(targetObj[attr])=='Object'){
                    this.mergeSame(originObj[attr],targetObj[attr])
                }else{
                    originObj[attr] = targetObj[attr];
                }
            }else{
                originObj[attr] = targetObj[attr];
            }
        }
        return originObj;
    }

    static deepCopy(rawObj) {
        let _this = this;
        let type =Object.prototype.toString.call(rawObj);
        if(type == '[object Array]'){
            return rawObj.map((item)=>{
                if(item instanceof Object){
                    _this.deepCopy(item);
                }else{
                    return item;
                }
            })
        }
        if(type == '[object Object]'){
            let targetObj = {};
            for (let item in rawObj) {
                //判断是否是对象类型
                if (rawObj[item] instanceof Object) {
                    targetObj[item] = _this.deepCopy(rawObj[item]);
                } else {
                    targetObj[item] = rawObj[item];
                }
            }
            return targetObj;
        }
    }
}

module.exports = ObjectAction;


