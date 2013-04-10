(function () {

    // theosp {{{
    var theosp = {

        // array {{{
        array: {

            // isArray {{{
            isArray: Array.isArray || // Part of ECMAScript5
                function (o) {
                    return Object.prototype.toString.call(o) === '[object Array]';
                },
            // }}}

            // indexOf {{{
            indexOf: function (elem, array) {
                if (array.indexOf) {
                    return array.indexOf(elem);
                }

                for (var i = 0, length = array.length; i < length; i++) {
                    if (array[i] === elem) {
                        return i;
                    }
                }

                return -1;
            },
            // }}}

            // map {{{
            map: (function () {
                if (Array.prototype.map) {
                    return function (array, fun, thisp) {
                        return Array.prototype.map.call(array, fun, thisp);
                    };
                } else {
                    return function (array, fun /*, thisp */) {
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
                    };
                }
            })(),
            // }}}

            // filter {{{
            filter: (function () {
                if (Array.prototype.filter) {
                    return function (array, fun, thisp) {
                        return Array.prototype.filter.call(array, fun, thisp);
                    };
                } else {
                    return function (array, fun /*, thisp */) {
                        // based on
                        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
                        "use strict";

                        if (array === void 0 || array === null)
                          throw new TypeError();

                        var t = Object(array);
                        var len = t.length >>> 0;
                        if (typeof fun !== "function")
                          throw new TypeError();

                        var res = [];
                        var thisp = arguments[1];
                        for (var i = 0; i < len; i++)
                        {
                          if (i in t)
                          {
                            var val = t[i]; // in case fun mutates this
                            if (fun.call(thisp, val, i, t))
                              res.push(val);
                          }
                        }

                        return res;
                      };
                };
            })(),
            // }}}

            // clean {{{
            clean: function (actual) {
                // original:
                // http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
                var newArray = new Array();

                for (var i = 0; i < actual.length; i++) {
                    if (actual[i]){
                        newArray.push(actual[i]);
                    }
                }

                return newArray;
            },
            // }}}

            // extend {{{
            extend: function (array_to_extend, array) {
                array_to_extend.push.apply(array_to_extend, array);

                return array_to_extend;
            },
            // }}}

            // complement {{{
            complement: function (a, b) {
                for (var index = a.length - 1; index >= 0; --index) {
                    if (theosp.array.indexOf(a[index], b) >= 0) {
                        a.splice(index, 1);
                    }
                }
            },
            // }}}

            // unique {{{
            unique: function (array) {
                var u = {}, a = [];

                for(var i = 0, l = array.length; i < l; ++i){
                    if(u.hasOwnProperty(array[i])) {
                        continue;
                    }

                    a.push(array[i]);
                    u[array[i]] = 1;
                }

                return a;
            }
            // }}}
        },
        // }}}

        // string {{{
        string: {

            // supplant {{{
            supplant: function (string, o) { 
                // based on Douglas Crockford's String.prototype.supplant
                return string.replace(/\|([^|]*)\|/g, 
                    function (a, b) {  
                        var r = o[b];
                        if (typeof r === 'string' || typeof r === "number") {
                            return r;
                        } else if (r === null) {
                            return "";
                        } else {
                            return a;
                        }
                    }
                ); 
            },
            // }}}

            // lcfirst {{{
            lcfirst: function (str) { 
                // based on http://phpjs.org/functions/ucfirst

                str += '';
                var f = str.charAt(0).toLowerCase();
                return f + str.substr(1);
            },
            // }}}

            // ucfirst {{{
            ucfirst: function (str) {
                // based on http://phpjs.org/functions/ucfirst

                str += '';
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1);
            },
            // }}}

            // readableToCamelCased {{{
            readableToCamelCased: function (str) { 
                return theosp.string.ucfirst(str.toLowerCase().replace(/\s+(.)/g, function (match, a) {
                    return a.toUpperCase();
                }));
            },
            // }}}

            // readableToUnderscored {{{
            readableToUnderscored: function (str) { 
                return str.toLowerCase().replace(/\s+(.)/g, function (match, a) {
                    return "_" + a;
                });
            },
            // }}}

            // camelCaseToUnderScored {{{
            camelCaseToUnderScored: function (str) { 
                return str.replace(/([A-Z])/g, function (a) {
                    return "_" + a.toLowerCase();
                }).substr(1);
            },
            // }}}

            // underScoredToCamelCase {{{
            underScoredToCamelCase: function (str) { 
                return theosp.string.ucfirst(str.replace(/_(.)/g, function (match, a) {
                    return a.toUpperCase();
                }));
            },
            // }}}

            // trim {{{
            trim: function(str) {
                // http://www.somacon.com/p355.php
                return str.replace(/^\s+|\s+$/g,"");
            },
            // }}}

            // ltrim {{{
            ltrim: function(str) {
                return str.replace(/^\s+/,"");
            },
            // }}}

            // rtrim {{{
            rtrim: function(str) {
                return str.replace(/\s+$/,"");
            },
            // }}}

            // tagify {{{
            tagify: function (str) { 
                return theosp.string.trim(str).toLowerCase().replace(/\s+/g, '-');
            },
            // }}}

            // split {{{
            split: function(str, options) {
                if (typeof options === 'undefined') {
                    options = {};
                }

                options = $.extend({trim_items: true, remove_empty_items: true, seperator: ","}, options);

                var splitted = str.split(options.seperator);

                if (options.trim_items === true) {
                    splitted = theosp.array.map(splitted, theosp.string.trim);
                }

                if (options.remove_empty_items === true) {
                    splitted = theosp.array.clean(splitted);
                }

                return splitted;
            },
            // }}}

            // isEmail {{{
            isEmail: function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                return re.test(email);
            },
            // }}}
            
            // parseDjangoJsonDate {{{
            parseDjangoJsonDate: function (date_string) {
                if (typeof date_string !== "string") {
                    return date_string;
                }

                args = date_string.replace('**new Date(', '').replace(')', '').split(',');

                return new Date(args[0], args[1], args[2], args[3] || 0, args[4] || 0, args[5] || 0);
            }
            // }}}
        },
        // }}}

        // object {{{
        object: {

            // size {{{
            size: function (obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        size++;
                    }
                }
                return size;
            },
            // }}}

            // traverse {{{
            traverse: function (o, func) {
                for (i in o) {
                    func.apply(this, [i, o[i]]);      
                    if (typeof o[i] === "object") {
                        //going on step down in the object tree!!
                        this.traverse(o[i], func);
                    }
                }
            },
            // }}}

            // keys {{{
            keys: Object.keys || function (o) {
                var result = [];
                for (var name in o) {
                    if (o.hasOwnProperty(name)) {
                        result.push(name);
                    }
                }
                return result;
            },
            // }}}

            // deepKeys {{{
            deepKeys: Object.keys || function (o) {
                var result = [];
                for (var name in o) {
                    result.push(name);
                }
                return result;
            },
            // }}}

            // clone {{{
            clone: function (o) {
                // Based on Douglas Crockford's object()
                function F() {}
                F.prototype = o;
                return new F();
            },
            // }}}

            // object {{{
            object: function (o) {
                // Based on Douglas Crockford's object()
                function F() {}
                F.prototype = o;
                return new F();
            },
            // }}}

            // extend {{{
            extend: function () {
                // was taken from jQuery

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
            },
            // }}}

            // equals {{{
            equals: function( x, y ) {
                // http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
                if ( x === y ) return true;
                // if both x and y are null or undefined and exactly the same
               
                if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
                // if they are not strictly equal, they both need to be Objects
               
                if ( x.constructor !== y.constructor ) return false;
                // they must have the exact same prototype chain, the closest we can do is
                // test there constructor.
               
                for ( var p in x ) {
                    if ( ! x.hasOwnProperty( p ) ) continue;
                      // other properties were tested using x.constructor === y.constructor
                   
                    if ( ! y.hasOwnProperty( p ) ) return false;
                      // allows to compare x[ p ] and y[ p ] when set to undefined
                   
                    if ( x[ p ] === y[ p ] ) continue;
                      // if they have the same strict value or identity then they are equal
                   
                    if ( typeof( x[ p ] ) !== "object" ) return false;
                      // Numbers, Strings, Functions, Booleans must be strictly equal
                   
                    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
                      // Objects and Arrays must be tested recursively
                }
               
                for ( p in y ) {
                    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
                      // allows x[ p ] to be set to undefined
                }

                return true;
            }
            // }}}
                
        },
        // }}}

        // integer {{{
        integer: {
            getRandom: function (min, max) {
                // http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        },
        // }}}

        // functions {{{
        functions: {
            clone: function (fct) {
                // original:
                // http://stackoverflow.com/questions/447658/can-i-copy-clone-a-function-in-javascript

                var clone = function() {
                    return fct.apply(this, arguments);
                };

                clone.prototype = theosp.object.clone(fct.prototype);

                for (property in fct) {
                    if (fct.hasOwnProperty(property) && property !== 'prototype') {
                        clone[property] = fct[property];
                    }
                }
                return clone;
            }
        },
        // }}}

        // gen {{{
        // theosp.gen holds functions that generates objects
        gen: {
            error: function (error_msg, additional_params) {
                // In the scripts I write an error object is an object that has the error
                // property

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
            }
        },
        // }}}

        // feature_detection {{{
        feature_detection: {

            // ie_version {{{
            ie_version: function(){
                // https://gist.github.com/527683

                var undef,
                    v = 3,
                    div = document.createElement('div'),
                    all = div.getElementsByTagName('i');

                while (
                    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );

                return v > 4 ? v : undef;
            }
            // }}}

        },
        // }}}

        // misc {{{
        getLogger: function(log_level, coloring_system) {
            var levels = {debug: 1, info: 2, warning: 3, error: 4, fatal: 5, none: 6},
                getLevelInt = function (level) {
                    return level in levels ? levels[level] : (level.toLowerCase() in levels ? levels[level.toLowerCase()] : 100);
                },
                log_level = getLevelInt(log_level);

            var terminal_colors = {
                    red: '\u001b[31m',
                    blue: '\u001b[34m',
                    reset: '\u001b[0m'
                };

            var util = require('util');
            return function (level, message) {
                var date = new Date();
                level_int = getLevelInt(level);
                if (level_int >= log_level) {
                    var message = util.format.apply(this, Array.prototype.slice.call(arguments, 1));
                    if (coloring_system === "terminal") {
                        var color;
                        if (level_int >= 3) {
                            color = terminal_colors.red;
                        } else {
                            color = terminal_colors.blue;
                        }

                        console.log(color + level.toUpperCase() + terminal_colors.reset + ' :: ' + date.toISOString() + ' :: ' + message);
                    } else {
                        console.log(level.toUpperCase() + ' :: ' + date.toISOString() + ' :: ' + message);
                    }
                }
            }
        }
        // }}}
    };
    // }}}

    // export {{{
    if (typeof module === 'object' && typeof module.exports === 'object') {
        theosp.object.extend(exports, theosp);
    } else {
        this.theosp = theosp;
    }
    // }}}
})();


// vim:fdm=marker:fmr={{{,}}}:
