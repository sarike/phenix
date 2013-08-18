define(function(require, exports, module) {
	var $ = require('$');
	var _ = require('underscore');
	var B = require('Backbone');

	var blazeTemplate = require('./templates/blaze.tpl');

    var BlazeModel = B.Model.extend({
        initialize: function(){
            if(!this.has('position'))
                console.error('No Position specified to BlazeModel!');
        }
    });

	var Blaze = B.View.extend({
		template: _.template(blazeTemplate),
        className: 'blaze',

        initialize: function(){
            this.position = this.model.get('position');
            this.stage = this.position.stage;
            this.$el.css({ top: this.position.y, left: this.position.x, position: 'relative' });
        },

		render: function(){
			this.$el.html(this.template(this.model));
            return this;
		},
        /**
         * Keep move to the specified direction for a limited duration
         * @param direction_x
         * @param direction_y
         * @param duration
         */
        move: function(direction_x, direction_y, duration){
            var timer = setInterval($.proxy(function move(){
                this.position.x += direction_x;
                this.position.y += direction_y;
                if(this.position.touchXBorder(this.$el.width())){
                    direction_x = -direction_x;
                }
                if(this.position.touchYBorder(this.$el.height())){
                    direction_y = -direction_y;
                }
                this.$el.offset({ top: this.position.y, left: this.position.x });
            },this), 9);
            setTimeout(function(){clearInterval(timer)}, duration)
        },

        dance: function(){
            var cur_x = this.position.x,
                cur_y = this.position.y,
                random_pos = this.stage.randomPosition(this.$el.width(), this.$el.height()),
                delta_x = random_pos.x - cur_x,
                delta_y = random_pos.y - cur_y,
                direction_x = delta_x/Math.abs(delta_x) * Math.random(),
                direction_y = delta_y/Math.abs(delta_y) * Math.random();
            this.move(direction_x, direction_y, 3000);
            setTimeout($.proxy(this.dance, this), 3000);
        }
	});


    var Util = {
        random: function(min, max){
            return Math.random() * (max - min) + min;
        }
    };

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
        var stageBlock = $(selector);
        var position = stageBlock.offset();
        var x1 = position.left;
        var y1 = position.top;
        var x2 = x1 + stageBlock.width();
        var y2 = y1 + stageBlock.height();
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

//            var stage = new Stage(20, 20, 800, 800);
            var stage = Stage.stageWithEl('.stage');

            for(var i = 0;i<20;i++){
                var model = new BlazeModel({
                    position: stage.randomPosition(150, 20)
                });
                model.title = '第 ' + i + ' 炮火焰';
                this.blazes.push(new Blaze({
                    model: model
                }))
            }
        },

        run: function(){
            _.each(this.blazes, function(blaze){
                $('body').append(blaze.render().el);
                blaze.dance();
            })
        }
	};
});
