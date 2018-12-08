let utils = require('../../utils/Utils');
const assert = require('assert').strict;
describe('工具集',function () {
    it('随机User-Agent测试', function () {
       for (let i=0;i<50;i++){
          assert.notDeepStrictEqual(undefined,utils.getHeaders()["User-Agent"]);
       }
    });
    it('管道函数测试', function () {
        assert.deepStrictEqual(10,utils.pipeline([(val)=>{
            return val*2
        },(val)=>{
            return val+2
        }])(4))
    });
    it('类型判断', function () {
        assert.deepStrictEqual('String',utils.getType('https://www.baidu.com'));
        assert.deepStrictEqual('Object',utils.getType({}));
        assert.deepStrictEqual('Number',utils.getType(12));
        assert.deepStrictEqual('Symbol',utils.getType(Symbol('xx')));
        assert.deepStrictEqual('Array',utils.getType([]));
        assert.deepStrictEqual('Null',utils.getType(null));
        assert.deepStrictEqual('Undefined',utils.getType(undefined));
    });
});
