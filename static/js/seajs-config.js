/*map start*/
seajs.production = false;
seajs.config({
    plugins: ['text'],
    preload: "seajs/seajs-text/1.0.2/seajs-text",
    alias: {
        "$": "jquery/jquery/1.10.1/jquery",
        "Backbone": "gallery/backbone/1.0.0/backbone",
        "underscore": "gallery/underscore/1.4.4/underscore",
        "base": "sarike/base/0.0.1/base"
    }
});


/*map end*/
