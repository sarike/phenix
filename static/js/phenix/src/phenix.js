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

        events: {
            'mouseover': 'onMouseOver',
            'mouseleave': 'onMouseLeave'
        },

        onMouseOver: function(){
            console.info('mouseOver');
            this.stopDance();
        },

        onMouseLeave: function(){
            this.dance();
        },

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
         * @param direction_z
         * @param duration
         */
        move: function(direction_x, direction_y, direction_z, duration){
            this.moveInterval = setInterval($.proxy(function move(){
                if(this.position.touchXBorder(this.$el.width())){
                    direction_x = -direction_x;
                }
                if(this.position.touchYBorder(this.$el.height())){
                    direction_y = -direction_y;
                }
                if(this.position.touchZBorder())
                    direction_z = -direction_z;
                this.position.x += direction_x;
                this.position.y += direction_y;
                this.position.z += direction_z;
                this.$el.css({
                            width: this.$el.width()*(1+this.position.z*0.001) + 'px',
                            height: this.$el.height()*(1+this.position.z*0.001 + 'px')
                        }).offset({ top: this.position.y, left: this.position.x });
            },this), 9);

            this.moveTimeout = setTimeout($.proxy(function(){
                if(this.moveInterval)
                    clearInterval(this.moveInterval);
            }, this), duration)
        },

        dance: function(){
            var cur_x = this.position.x,
                cur_y = this.position.y,
                cur_z = this.position.z,
                random_pos = this.stage.randomPosition(this.$el.width(), this.$el.height()),
                delta_x = random_pos.x - cur_x,
                delta_y = random_pos.y - cur_y,
                delta_z = random_pos.z - cur_z,
                direction_x = delta_x/Math.abs(delta_x) * Math.random(),
                direction_y = delta_y/Math.abs(delta_y) * Math.random(),
                direction_z = delta_z/Math.abs(delta_z) * Math.random();
                this.move(direction_x, direction_y, direction_z, 3000);
                this.danceTimeer = setTimeout($.proxy(this.dance, this), 3000);
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

    /**
     * Define Position Class
     */
    var Position = function (x, y, z, stage){
        this.x = x;
        this.y = y;
        this.z = z;
        if(!stage){
            console.error('Position should be bound to a stage!');
            return;
        }
        this.stage = stage;
    };

    Position.prototype.setPos = function(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    };

    Position.prototype.touchXBorder = function(offset){
        return this.x <= this.stage.x1 || this.x >= this.stage.x2 - offset;
    };

    Position.prototype.touchYBorder = function(offset){
        return this.y <= this.stage.y1 || this.y >= this.stage.y2 - offset;
    };

    Position.prototype.touchZBorder = function(){
        return this.y <= this.stage.z1 || this.y >= this.stage.z2;
    };

    var Stage = function(x1, y1, z1, x2, y2, z2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.z1 = z1;
        this.z2 = z2;
    };

    Stage.stageWithEl = function(selector, z1, z2){
        var stageBlock = $(selector),
            offset = stageBlock.offset(),
            x1 = offset.left,
            y1 = offset.top,
            z1 = z1? z1:0,
            x2 = x1 + stageBlock.width(),
            y2 = y1 + stageBlock.height(),
            z2 = z2? z2:0;
        return new Stage(x1, y1, z1, x2, y2, z2);
    };

    Stage.prototype.width = function(){
        return this.x2 - this.x1;
    };

    Stage.prototype.height = function(){
        return this.y2 - this.y1;
    };

    Stage.prototype.centerPos = function(){
        return new Position((this.x1+this.x2)/2, (this.y1+this.y2)/2, (this.z1+this.z2)/2, this);
    };

    Stage.prototype.randomPosition = function(xOffset, yOffset){
        var randomX = Util.random(this.x1, this.x2 - xOffset),
            randomY = Util.random(this.y1, this.y2 - yOffset),
            randomZ = Util.random(this.z1, this.z2);
        console.info(new Position(randomX, randomY, randomZ, this));

        return new Position(randomX, randomY, randomZ, this);
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
            var stage = Stage.stageWithEl('.stage', 0, 200);

            for(var i = 0;i<10;i++){
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
