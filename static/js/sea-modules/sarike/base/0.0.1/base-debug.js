/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-8-21
 * Time: 下午8:30
 * To change this template use File | Settings | File Templates.
 */
define("sarike/base/0.0.1/base-debug", [ "jquery/jquery/1.10.1/jquery-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "$-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.10.1/jquery-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var B = require("gallery/backbone/1.0.0/backbone-debug");
    exports.DragableView = B.View.extend({
        events: {
            mouseleave: "_onMouseLeave",
            mousedown: "_onMouseDown",
            mousemove: "_onMouseMove",
            mouseup: "_onMouseUp"
        },
        mouseStatus: {
            mouseDown: false,
            current_x: 0,
            current_y: 0
        },
        _onMouseLeave: function() {
            this.mouseStatus.mouseDown = false;
            this.onMouseLeave();
        },
        _onMouseUp: function() {
            this.mouseStatus.mouseDown = false;
            this.onMouseUp();
        },
        _onMouseDown: function(e) {
            this.mouseStatus.mouseDown = true;
            this.mouseStatus.current_x = e.clientX;
            this.mouseStatus.current_y = e.clientY;
            this.onMouseDown();
        },
        _onMouseMove: function(e) {
            if (this.mouseStatus.mouseDown) {
                this.position.x += e.clientX - this.mouseStatus.current_x;
                this.position.y += e.clientY - this.mouseStatus.current_y;
                this.mouseStatus.current_x = e.clientX;
                this.mouseStatus.current_y = e.clientY;
                this.$el.offset({
                    top: this.position.y,
                    left: this.position.x
                });
            }
            this.onMouseMove();
        },
        onMouseLeave: function() {},
        onMouseUp: function() {},
        onMouseDown: function() {},
        onMouseMove: function() {}
    });
});
