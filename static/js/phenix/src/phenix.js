define(function(require, exports, module) {
	var $ = require('$');
	var _ = require('underscore');
	var B = require('Backbone');
//  var Base = require('../../base/src/base');
    var Base = require('sarike/base/0.0.1/base');

	var blazeTemplate = require('./templates/blaze.tpl');

    var BlazeModel = B.Model.extend({
        initialize: function(){
            if(!this.has('position'))
                console.error('No Position specified to BlazeModel!');
        }
    });

	var Blaze = Base.DragableView.extend({
		template: _.template(blazeTemplate),
        className: 'blaze',
        tagName: 'span',

        events: function(){
            return _.extend({},Base.DragableView.prototype.events,{
                'mouseover': 'onMouseOver',
                'mouseleave': 'onMouseLeave'
            });
        },

        onMouseOver: function(){
            this.stopDance();
            this.$el.css({'z-index': 100});
        },

        onMouseLeave: function(){
            this.$el.css({'z-index': this.options.z_index});
            this.mouseStatus.mouseDown = false;
            this.dance();
        },

        initialize: function(){
            this.position = this.model.get('position');
            this.stage = this.position.stage;
            this.$el.css({
                top: this.position.y,
                left: this.position.x,
                position: 'relative',
                'z-index': this.options.z_index
            });
        },

		render: function(){
			this.$el.html(this.template(this.model));
            this.$("div.img").css("background-image", "url('../static/image/"+ this.options.content + "')")
            return this;
		},
        /**
         * Keep move to the specified direction for a limited duration
         * @param direction_x
         * @param direction_y
         * @param duration
         */
        move: function(direction_x, direction_y, duration){
            this.moveInterval = setInterval($.proxy(function move(){
                this.position.x += direction_x;
                this.position.y += direction_y;
                if(this.position.touchXBorder(this.$el.width())){
                    if(this.position.x <= this.position.stage.x1)
                        direction_x = Math.abs(direction_x);
                    else
                        direction_x = Math.abs(direction_x) * (-1);
                }
                if(this.position.touchYBorder(this.$el.height())){
                    if(this.position.y <= this.position.stage.y1)
                        direction_y = Math.abs(direction_y);
                    else
                        direction_y = Math.abs(direction_y) * (-1);
                }
                this.$el.offset({ top: this.position.y, left: this.position.x });
            },this), 9);

            this.moveTimeout = setTimeout($.proxy(function(){
                if(this.moveInterval)
                    clearInterval(this.moveInterval);
            }, this), duration)
        },

        dance: function(){
            var cur_x = this.position.x,
                cur_y = this.position.y,
                move_due = Util.random(3, 5) * 1000,
                random_pos = this.stage.randomPosition(this.$el.width(), this.$el.height()),
                delta_x = random_pos.x - cur_x,
                delta_y = random_pos.y - cur_y,
                direction_x = delta_x/Math.abs(delta_x) * Math.random(),
                direction_y = delta_y/Math.abs(delta_y) * Math.random();
                this.move(direction_x, direction_y, move_due);
                this.danceTimeer = setTimeout($.proxy(this.dance, this), move_due);
        },

        stopDance: function(){
            if(this.danceTimeer){
                clearTimeout(this.danceTimeer);
            }
            if(this.moveInterval){
                clearInterval(this.moveInterval);
            }
            if(this.moveTimeout){
                clearInterval(this.moveTimeout);
            }
        }
	});


    var Util = {
        random: function(min, max){
            return Math.random() * (max - min) + min;
        }
    };

    var BlazeType = {
        IMAGE: 0,
        TEXT: 1,
        VEDIO: 2
    }

    /**
     * Define Position Class
     */
    var Position = function (x, y, stage){
        this.x = x;
        this.y = y;
        if(!stage){
            console.error('Position should be bound to a stage!');
            return;
        }
        this.stage = stage;
    };

    Position.prototype.setPos = function(x, y){
        this.x = x;
        this.y = y;
    };

    Position.prototype.touchXBorder = function(offset){
        return this.x <= this.stage.x1 || this.x >= this.stage.x2 - offset;
    };

    Position.prototype.touchYBorder = function(offset){
        return this.y <= this.stage.y1 || this.y >= this.stage.y2 - offset;
    };

    var Stage = function(x1, y1, x2, y2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    };

    Stage.stageWithEl = function(selector){
        var stageBlock = $(selector),
            offset = stageBlock.offset(),
            x1 = offset.left,
            y1 = offset.top,
            x2 = x1 + stageBlock.width(),
            y2 = y1 + stageBlock.height();

        return new Stage(x1, y1, x2, y2)
    };

    Stage.prototype.width = function(){
        return this.x2 - this.x1;
    };

    Stage.prototype.height = function(){
        return this.y2 - this.y1;
    };

    Stage.prototype.centerPos = function(){
        return new Position((this.x1+this.x2)/2, (this.y1+this.y2)/2, this);
    };

    Stage.prototype.randomPosition = function(xOffset, yOffset){
        var randomX = Util.random(this.x1, this.x2 - xOffset);
        var randomY = Util.random(this.y1, this.y2 - yOffset);
        return new Position(randomX, randomY, this);
    };

    exports.Phenix = {
        blazes: [],

        retrieveData: function(url, method){
            //请求数据
//            $.ajax({
//                url: url,
//                dataType: 'json',
//                type: method,
//                statusCode: {
//                    404: function(){
//
//                    }
//                },
//                success: $.proxy(function(res){
//                    if(res.response == 'ok'){
//                        this.blazes.append(new Blaze({
//                            model: res.data
//                        }))
//                    }
//                }, this),
//                beforeSend: function(xhr){
//
//                }
//            });
            //测试数据

            var stage = new Stage(0, 0, $(window).width(), $(window).height());
//            var stage = Stage.stageWithEl('.stage');

            for(var i = 1;i<=6;i++){
                var model = new BlazeModel({
                    position: stage.randomPosition(250, 190)
                });
                model.title = '第 ' + i + ' 炮火焰';
                this.blazes.push(new Blaze({
                    model: model,
                    z_index: i,
                    type: BlazeType.IMAGE,
                    content: i + '.png'
                }))
            }
        },

        run: function(){
            $('html').css({overflow: 'hidden'})
            _.each(this.blazes, function(blaze){
                $('body').append(blaze.render().el);
                blaze.dance();
            })
        }
	};
});
