/*
combined files : 

gallery/kissy-portal/1.0/index

*/
/**
 * @fileoverview 
 * @author 铉铭<jinping.ljp@alibaba-inc.com>
 * @module kissy-portal
 **/
KISSY.add('gallery/kissy-portal/1.0/index',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class KissyPortal
     * @constructor
     * @extends Base
     */
    function KissyPortal(comConfig) {
        var self = this;
        //调用父类构造函数
        KissyPortal.superclass.constructor.call(self, comConfig);
    }
    S.extend(KissyPortal, Base, /** @lends KissyPortal.prototype*/{
        
    }, {ATTRS : /** @lends KissyPortal*/{

    }});
    return KissyPortal;
}, {requires:['node', 'base']});




