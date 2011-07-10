/*
 * Dispatcher
 *
 * RERUIRES: Node.js's EventEmitter
 *           Daniel Chcouri's theosp_common_js (theosp.js)
 *           jQuery
 *
 * The constructor gets an object "routes" of the following form:
 *
 * [
 *     {
 *         regex: /re/g,
 *         action: function () {}
 *     },
 *     {
 *         regex: /re2/g,
 *         action: function () {}
 *     },
 *     {
 *         action: function () {
 *             // default route
 *         }
 *     }
 * ]
 *
 * The .dispatch(url) method looks for the first object in routes whose regex
 * property matches the url and calls the function in its action property
 *
 * Routes without route.regex are default (we will always stop on them and run
 * their action)
*/

// if running under commonjs (nodejs) {{{
if ((typeof $ === "undefined" || typeof $.extend === "undefined") && typeof require === "function") {
    require.paths.unshift('.');
    EventEmitter = require('events').EventEmitter;
    theosp = require("./theosp");

    if (typeof $ === 'undefined') {
        $ = {};
    }

    $.extend = theosp.object.extend;
}
// }}}

(function () {
    // Dispatcher {{{

    // constructor {{{
    var Dispatcher = function (routes, options) {
        var self = this;

        // init options {{{
        if (typeof options === 'undefined') {
            options = {};
        }
        self.options = theosp.object.clone(self.options); // clone the prototypical options
        $.extend(self.options, options);
        // }}}

        // init routes {{{
        if (typeof routes === 'undefined') {
            routes = [];
        }
        self.routes = routes;
        // }}}
    };
    // }}}

    // Prototypical Chain {{{
    Dispatcher.prototype = new EventEmitter();
    Dispatcher.prototype.constructor = Dispatcher;
    // }}}

    // properties {{{
    $.extend(Dispatcher.prototype, {
        // options {{{
        options: { 
            default_dispatcher_input: ""
        }
        // }}}
    });
    // }}}

    // methods {{{
    $.extend(Dispatcher.prototype, {
        // dispatch {{{
        dispatch: function (string, context) {
            var self = this;

            if (typeof string === 'undefined') {
                if (typeof self.options.default_dispatcher_input === "function") {
                    string = self.options.default_dispatcher_input();
                } else {
                    string = self.options.default_dispatcher_input;
                }
            }

            if (typeof context === 'undefined') {
                context = {};
            }

            for (var i = 0; i < self.routes.length; i++) {
                var route = self.routes[i];

                if (typeof route.regex !== 'undefined') {
                    // avoid bugs in cases where the regex ends with /g
                    route.regex.lastIndex = 0;
                    if ((route_params = route.regex.exec(string)) !== null) {
                        route.action.apply(context, route_params);

                        return;
                    }
                } else {
                    // We look on routes without route.regex as defaults
                    route.action.call(context, string);

                    return;
                }
            }
        }
        // }}}

    });
    // }}}

    // }}}

    // export {{{
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // If imported using common js (nodejs)
        exports.Dispatcher = Dispatcher;
    } else {
        // Otherwise simply attach to the global object
        this.Dispatcher = Dispatcher;
    }
    // }}}

    // }}}
})();

// vim:fdm=marker:fmr={{{,}}}:
