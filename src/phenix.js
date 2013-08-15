define(function(require, exports, module) {
	
	var $ = require('$');
	var _ = require('_');
	var B = require('Backbone');

	var blazeTemplate = require('./templates/balze.tpl');

	var Blaze = B.View.extend({
		template: _.template(blazeTemplate),

		render: function(){
			this.$el.html(this.template(this.model));
            return this;
		},

        runTo: function(position){
            this.$el.offset({ top: position.y, left: position.x });
        }
	});

	var Phenix = {
        blazes: [],

        retriveData: function(url, method){
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
            for(var i = 0;i<30;i++){
                this.blazes.append(new Blaze({
                    model: {
                        'title':i
                    }
                }))
            }

        },

        stage: {

            width: $(window).width(),
            height: $(window).height(),

            position: function(x, y){
                this.x = x;
                this.y = y;
            },

            randomPosition: function(){
                var randomX = Math.random() * this.width;
                var randomY = Math.random() * this.height;
                return this.position(randomX, randomY)
            }
        },

        dangce: function(){
            _.each(this.blazes, function(blaze){
                blaze.runTo(this.stage.randomPosition())
            })
        }
	};


  	module.exports = Phenix;

});
