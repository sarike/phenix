define("sarike/base/0.0.1/base",["jquery/jquery/1.10.1/jquery","gallery/underscore/1.4.4/underscore","gallery/backbone/1.0.0/backbone","$"],function(a,b){a("jquery/jquery/1.10.1/jquery"),a("gallery/underscore/1.4.4/underscore");var c=a("gallery/backbone/1.0.0/backbone");b.DragableView=c.View.extend({events:{mouseleave:"_onMouseLeave",mousedown:"_onMouseDown",mousemove:"_onMouseMove",mouseup:"_onMouseUp"},mouseStatus:{mouseDown:!1,current_x:0,current_y:0},_onMouseLeave:function(){this.mouseStatus.mouseDown=!1,this.onMouseLeave()},_onMouseUp:function(){this.mouseStatus.mouseDown=!1,this.onMouseUp()},_onMouseDown:function(a){this.mouseStatus.mouseDown=!0,this.mouseStatus.current_x=a.clientX,this.mouseStatus.current_y=a.clientY,this.onMouseDown()},_onMouseMove:function(a){this.mouseStatus.mouseDown&&(this.position.x+=a.clientX-this.mouseStatus.current_x,this.position.y+=a.clientY-this.mouseStatus.current_y,this.mouseStatus.current_x=a.clientX,this.mouseStatus.current_y=a.clientY,this.$el.offset({top:this.position.y,left:this.position.x})),this.onMouseMove()},onMouseLeave:function(){},onMouseUp:function(){},onMouseDown:function(){},onMouseMove:function(){}})});