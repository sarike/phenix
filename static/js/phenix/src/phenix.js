define(function(require, exports, module) {
	var $ = require('$');
	var _ = require('underscore');
	var B = require('Backbone');

	var blazeTemplate = require('./templates/blaze.tpl');

    var BlazeModel = B.Model.extend({
        initialize: function(){
            this.position = new Position($(window).width()/2, $(window).height()/2);
        }
    });

	var Blaze = B.View.extend({
		template: _.template(blazeTemplate),

        initialize: function(){
            this.position = this.model.position;
        },

		render: function(){
			this.$el.html(this.template(this.model));
            return this;
		},

        move: function(direction_x, direction_y, time){
            var timer = setInterval($.proxy(function move(){
                this.position.x += direction_x;
                this.position.y += direction_y;
                if(this.position.touchXBorder()){
                    direction_x = -direction_x;
                }
                if(this.position.touchYBorder()){
                    direction_y = -direction_y;
                }
                this.$el.offset({ top: this.position.y, left: this.position.x });
            },this), 9);
            setTimeout(function(){clearInterval(timer)}, time)
        },

        dance: function(){
            var cur_x = this.position.x;
            var cur_y = this.position.y;
            var delta_x = Util.random(0, $(window).width()) - cur_x;
            var delta_y = Util.random(0, $(window).height()) - cur_y;
            var direction_x = delta_x/Math.abs(delta_x) * Math.random();
            var direction_y = delta_y/Math.abs(delta_y) * Math.random();
            this.move(direction_x, direction_y, 3000);
            setTimeout($.proxy(this.dance, this), 1000);
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
    var Position = function (x, y){
        this.x = x;
        this.y = y;
    };

    /**
     * Get a random Position instance
     * @param minX
     * @param maxX
     * @param minY
     * @param maxY
     * @returns {Position}
     */
    Position.randomPosition = function(minX, maxX, minY, maxY){
        var randomX = Util.random(minX, maxX);
        var randomY = Util.random(minY, maxY);
        return new Position(randomX, randomY)
    };

    Position.prototype.setPos = function(x, y){
        this.x = x;
        this.y = y;
    };

    Position.prototype.touchXBorder = function(){
        return this.x < 0 || this.x > $(window).width()
    }

    Position.prototype.touchYBorder = function(){
        return this.y < 0 || this.y > $(window).height()
    }

    var Scope = function(x1, y1, x2, y2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
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
            for(var i = 0;i<20;i++){
                var model = new BlazeModel();
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
