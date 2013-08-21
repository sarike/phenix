/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-8-21
 * Time: 下午8:30
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){
    var $ = require('$');
    var _ = require('underscore');
    var B = require('Backbone');

    exports.DragableView = B.View.extend({

        events: {
            'mouseleave': '_onMouseLeave',
            'mousedown': '_onMouseDown',
            'mousemove': '_onMouseMove',
            'mouseup': '_onMouseUp'
        },

        mouseStatus: {
            mouseDown: false,
            current_x: 0,
            current_y: 0
        },

        _onMouseLeave: function(){
            this.mouseStatus.mouseDown = false;
            this.onMouseLeave();
        },

        _onMouseUp: function(){
            this.mouseStatus.mouseDown = false;
            this.onMouseUp();
        },

        _onMouseDown: function(e){
            console.info('mouse down');
            this.mouseStatus.mouseDown = true;
            this.mouseStatus.current_x = e.clientX;
            this.mouseStatus.current_y = e.clientY;
            this.onMouseDown();
        },

        _onMouseMove: function(e){
            if(this.mouseStatus.mouseDown){
                this.position.x += e.clientX - this.mouseStatus.current_x;
                this.position.y += e.clientY - this.mouseStatus.current_y;
                this.mouseStatus.current_x = e.clientX;
                this.mouseStatus.current_y = e.clientY;
                this.$el.offset({ top: this.position.y, left: this.position.x });
            }
            this.onMouseMove();
        },

        onMouseLeave: function(){},
        onMouseUp: function(){},
        onMouseDown: function(){},
        onMouseMove: function(){}
    });
});
