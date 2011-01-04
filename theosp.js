(function () {
    var theosp = {};

    theosp.array = {};
    theosp.array.isArray = 
        Array.isArray || // Part of ECMAScript5
        function (o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        };

    // based on jQuery's inArray
    theosp.array.indexOf = function (elem, array) {
        if (array.indexOf) {
            return array.indexOf(elem);
        }

        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === elem) {
                return i;
            }
        }

        return -1;
    };

    theosp.array.map = null;
    if (Array.prototype.map) {
        theosp.array.map = function (array, fun, thisp) {
            return Array.prototype.map.call(array, fun, thisp);
        };
    } else {
        theosp.array.map = function (array, fun /*, thisp */) {
            // based on
            // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
            if (array === void 0 || array === null)
                throw new TypeError();

            var t = Object(array);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var res = new Array(len);
            var thisp = arguments[2];
            for (var i = 0; i < len; i++)
            {
                if (i in t)
                    res[i] = fun.call(thisp, t[i], i, t);
            }

            return res;
        }
    };

    theosp.string = {};
    theosp.string.supplant = function (string, o) { 
        // based on Douglas Crockford's String.prototype.supplant
        return string.replace(/\|([^|]*)\|/g, 
            function (a, b) {  
                var r = o[b];
                return typeof r === 'string' || typeof r === "number" ? 
                    r : a; 
            }
        ); 
    };

    theosp.string.ucfirst = function (str) { 
        // based on http://phpjs.org/functions/ucfirst

        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    };

    theosp.object = {};
    theosp.object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    theosp.object.traverse = function (o, func) {
        for (i in o) {
            func.apply(this, [i, o[i]]);      
            if (typeof o[i] === "object") {
                //going on step down in the object tree!!
                traverse(o[i], func);
            }
        }
    };

    theosp.object.keys = Object.keys || function (o) {
        var result = [];
        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                result.push(name);
            }
        }
        return result;
    };

    theosp.object.deepKeys = Object.keys || function (o) {
        var result = [];
        for (var name in o) {
            result.push(name);
        }
        return result;
    };

    theosp.object.object = theosp.object.clone = function (o) {
        // Based on Douglas Crockford's object()
        function F() {}
        F.prototype = o;
        return new F();
    };

    // was taken from jQuery
    theosp.object.extend = function () {
        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging object literal values or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || jQuery.isArray(copy))) {
                        var clone = src && (jQuery.isPlainObject(src) || jQuery.isArray(src)) ? src
                            : jQuery.isArray(copy) ? [] : {};

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                    // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    // theosp.gen holds functions that generates objects
    theosp.gen = {};
    // In the scripts I write an error object is an object that has the error
    // property
    theosp.gen.error = function (error_msg, additional_params) {
        o = {};
        o.error = error_msg;

        if (typeof additional_params !== 'undefined') {
            for (var param in additional_params) {
                if (additional_params.hasOwnProperty(param)) {
                    o[param] = additional_params[param];
                }
            }
        }

        return o;
    };

    // If this script has been loaded using CommonJS's require, we assing the
    // variables we set theosp object to the module's exports property.
    // Otherwise we assign it to the global scope's theosp var (which `this`
    // points to since we call the function without the new operator).
    if (typeof module === 'object' && typeof module.exports === 'object') {
        theosp.object.extend(exports, theosp);
    } else {
        this.theosp = theosp;
    }
})();
