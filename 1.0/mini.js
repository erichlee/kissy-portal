/**
 * @fileoverview 
 * @author 铉铭<jinping.ljp@alibaba-inc.com>
 * @module kissy-portal
 **/
KISSY.add(function (S, Node, Lang) {
    var $ = Node.all,
        EventTarget = S.Event.Target;
    /**
     *
     * @class KissyPortal
     * @constructor
     */
    function KissyPortal(config) {

    }

    S.augment(KissyPortal, EventTarget, /** @lends KissyPortal.prototype*/{

    });

    return KissyPortal;

}, {requires:['node', 'lang']});



