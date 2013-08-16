define(function(require, exports, module) {
	var $ = require('$');
	var _ = require('underscore');
	var B = require('Backbone');

	var blazeTemplate = require('./templates/blaze.tpl');

    var BlazeModel = B.Model.extend({
        initialize: function(){
            this.position = new Position(0, 0);
        }
    });

	var Blaze = B.View.extend({
		template: _.template(blazeTemplate),

		render: function(){
			this.$el.html(this.template(this.model));
            return this;
		},

        runTo: function(position){
            var cur_x = this.model.position.x;
            var cur_y = this.model.position.y;
            var step_x = 1,
                step_y = 1;
            var delta_x = position.x - cur_x;
            var delta_y = position.y - cur_y;
            step_x = step_y * (delta_x/delta_y);
            console.info(delta_x+":"+delta_y);
            var timer = window.setInterval($.proxy(function(){
                var new_pos = new Position(this.model.position.x, this.model.position.y);
                if(delta_x > 0)
                    new_pos.x += step_x;
                else
                    new_pos.x -= step_x;
                if(delta_y > 0)
                    new_pos.y += step_y;
                else
                    new_pos.y -= step_y;
                console.info(new_pos);
                this.model.position = new_pos;
                this.$el.offset({ top: this.model.position.y, left: this.model.position.x });
            }, this), 5);
            setTimeout(function(){window.clearInterval(timer);},2000);
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

        dance: function(){
            _.each(this.blazes, $.proxy(function(blaze){
                $('body').append(blaze.render().el);
                var random_pos = Position.randomPosition(0, $(window).width(), 0, $(window).height());
                blaze.runTo(random_pos)
            }, this))
        }
	};
});
