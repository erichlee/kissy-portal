/*
combined files : 

gallery/kissy-portal/1.0/index

*/
/**
 * @fileoverview
 * @author 铉铭<jinping.ljp@alibaba-inc.com>
 * @module kissy-portal
 **/
KISSY.add('gallery/kissy-portal/1.0/index',function (S, Base, Dom, Event, DD, Scroll, Proxy) {
    "use strict";
    var EMPTY = '';
    var DraggableDelegate = DD.DraggableDelegate,
        DroppableDelegate = DD.DroppableDelegate;

    var ATTRS = {
        id: {
            value: EMPTY
        },
        cols: {
            value: 3
        },
        colWidth: {
            value: 300
        },
        header: {
            value: '<div class="ui-portlet-header">' +
                '<span class="title"></span>' +
                '<span class="close"></span><span class="resize"></span><span class="refresh clearfix"></span>' +
                '</div>'
        },
        content: {
            value: '<div class="ui-portlet-content"></div>'
        },
        tpl: {
            value: '<div class="ui-portlet-item"></div>'
        }
    };

    var prototype = {
        initializer: function () {
            var that = this;
            that._initAttr();
            that._bindEvent();
        },
        _initAttr: function () {
            var that = this;
            that.wrap = S.one("#" + that.get("id"));
            that.cols = S.isNumber(that.get("cols")) ? that.get("cols") : 3;
            that.colWidth = S.isNumber(that.get("colWidth")) ? that.get("colWidth") : 300;
            that.portlets = that.wrap.children("div");
            that._create();
        },
        _create: function () {
            var that = this;
            that.colWraps = [];
            that.wrap.addClass("ui-portlet clearfix");
            for (var i = that.cols - 1; i >= 0; i--) {
                //add columns
                that.colWraps[i] = S.one('<div class="ui-portlet-column' + (i == that.cols-1 ? " last clearfix" : "") + '"></div>').width(that.colWidth);
                that.wrap.prepend(that.colWraps[i]);
            }
            //add portlets
            that._createPortletsFromHtml();
            //bind draggable and droppable
            that._initDD();
        },
        _createPortletsFromHtml: function () {
            var that = this;
            if (that.portlets && that.portlets.length > 0) {
                S.each(that.portlets, function (elem) {
                    var portlet = that.wrap.one(elem);
                    var title = S.isString(portlet.attr("title")) ? portlet.attr("title") : EMPTY;
                    var width = S.isString(portlet.attr("width")) ? portlet.attr("width") : "100%";
                    var height = S.isString(portlet.attr("height")) ? portlet.attr("height") : "auto";
                    var pos = portlet.attr("pos").split(",");
                    if (!S.isArray(pos) || pos.length != 2) {
                        pos = [1, 1];
                    }
                    portlet.wrapInner(that.get('content'));
                    portlet.prepend(that.get('header'));
                    S.one(".title", portlet).html(title);
                    S.one(".ui-portlet-content", portlet).width(width).height(height);

                    portlet.addClass("ui-portlet-item").removeAttr("title");
                    S.one(portlet).appendTo(that.colWraps[pos[1]-1]);
                });
                S.each(that.colWraps,function(column){
                    //that.wrap.one(column).height(that.wrap.height());
                });
            }
        },
        _bindEvent: function () {
            var that = this;
            Event.delegate(that.wrap, 'click', '.refresh', that._refreshHanddler);
            Event.delegate(that.wrap, 'dblclick', '.refresh', that._haltHandler);
            Event.delegate(that.wrap, 'click', '.resize', that._resizeHandler);
            Event.delegate(that.wrap, 'dblclick', '.resize', that._haltHandler);
            Event.delegate(that.wrap, 'click', '.close', that._closeHandler);
            Event.delegate(that.wrap, 'dblclick', '.close', that._haltHandler);
        },
        _refreshHanddler: function (e) {
            var target = S.one(e.currentTarget);
            var parent = target.parent(".ui-portlet-item");
            that.fire("refresh", S.one(".ui-portlet-content", parent));
        },
        _resizeHandler: function (e) {
            var that = this;
            var target = S.one(e.currentTarget);
            var parent = target.parent(".ui-portlet-item");
            S.one(".resize", parent).toggleClass(".plus");
            S.one(".ui-portlet-content", parent).toggle();
            that.fire("resize", S.one(".ui-portlet-content", parent));
        },
        _closeHandler: function (e) {
            var that = this;
            var target = S.one(e.currentTarget);
            var parent = target.parent(".ui-portlet-item");
            parent.remove();
            that.fire("resize", parent);
        },
        _haltHandler: function (e) {
            e.halt();
        },
        _initDD: function () {
            var that = this;
            var elem = "#" + that.get("id");
            var dragDelegate = new DraggableDelegate({
                container: elem,
                move: 1,
                handlers: ['.ui-portlet-header'],
                selector: function (el) {
                    el = S.one(el);
                    return el.hasClass('ui-portlet-item');
                },
                plugins: [
                    new Proxy({
                        node: function (drag) {
                            var n = drag.get("dragNode")[0].cloneNode(true);
                            return S.one(n).css("opacity", 1);
                        },
                        moveOnEnd: false,
                        destroyOnEnd: true
                    })
                ]
            });
            new DroppableDelegate({
                container: elem,
                selector: '.ui-portlet-item'
            });
            new DroppableDelegate({
                container: elem,
                selector: '.ui-portlet-column'
            });
            dragDelegate.on("dragover", function (ev) {
                var drag = ev.drag;
                var drop = ev.drop;
                var dragNode = drag.get("dragNode"),
                    dropNode = drop.get("node");
                if (dragNode.hasClass(".ui-portlet-item")) {
                    if (dropNode.hasClass(".ui-portlet-column")) {
                        var nodes = dropNode.all(".ui-portlet-item");
                        if (nodes.length) {
                            if (nodes.length == 1 &&
                                ( nodes[0] === drag.get("node")[0] &&
                                    nodes[0] !== drag.get("dragNode")[0])
                                ) {
                            } else {
                                return;
                            }
                        }
                        //空列
                        dropNode.append(dragNode);
                    } else {
                        var middleDropY = (dropNode.offset().top * 2 + dropNode.height()) / 2;
                        if (ev.pageY > middleDropY) {
                            var next = dropNode.next();
                            if (next && next[0] == dragNode) {
                            } else {
                                dragNode.insertAfter(dropNode);
                            }
                        } else {
                            var prev = dropNode.prev();
                            if (prev && prev[0] == dragNode) {
                            } else {
                                dragNode.insertBefore(dropNode);
                            }
                        }
                    }
                }

            });
        }
    };

    return Base.extend(prototype, {ATTRS: ATTRS});
}, {requires: ['base', 'dom', 'event', 'dd', 'dd/plugin/scroll', 'dd/plugin/proxy', 'gallery/gallery/kissy-portal/1.0/index.css']});




