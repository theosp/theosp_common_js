(function () {
    Array.isArray = 
        Array.isArray || // Part of ECMAScript5
        function (o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        };

    // Returns the size of an object
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    // In the scripts I write an error object is an object that has the error
    // property
    var ErrorObject = function (error_msg, additional_params) {
        this.error = error_msg;

        if (typeof additional_params !== 'undefined') {
            for (var param in additional_params) {
                if (additional_params.hasOwnProperty(param)) {
                    this[param] = additional_params[param];
                }
            }
        }
    };

    var global;
    // If this script has been loaded using CommonJS's require, we assing the
    // variables we want to share to the exports object, otherwise we assign
    // them to the global scope (which `this` points to since we call the
    // function without the new operator).
    if (typeof module === 'object' && typeof module.exports === 'object') {
        global = exports;
    } else {
        global = this;
    }

    global.ErrorObject = ErrorObject;
})();
