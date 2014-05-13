KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('kissy-portal', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','gallery/kissy-portal/1.0/']});