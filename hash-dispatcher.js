/*
 * HashDispatcher
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
 *     /regex2/: function () {
 *         regex: /re/g,
 *         action: function () {}
 *     }
 * ]
 *
 * The .dispatch(url) method looks for the first object in routes whose regex
 * property matches the url and calls the function in its action property
 *
*/

(function () {
    // HashDispatcher {{{

    // constructor {{{
    var HashDispatcher = function (routes, options) {
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

        // bind to the hashchange event {{{
        $(window).bind('hashchange', function() {
            self.dispatch();
        });

        $(window).ready(function () {
            $(window).trigger('hashchange');
        });
        // }}}
    };

    HashDispatcher.prototype = new EventEmitter();
    HashDispatcher.prototype.constructor = HashDispatcher;
    // }}}

    // properties {{{
    $.extend(HashDispatcher.prototype, {
        // options {{{
        options: { }
        // }}}
    });
    // }}}

    // methods {{{
    $.extend(HashDispatcher.prototype, {
        // dispatch {{{
        dispatch: function (hash) {
            var self = this;

            if (typeof hash === 'undefined') {
                hash = window.location.hash;
            }

            for (var i = 0; i < self.routes.length; i++) {
                var route = self.routes[i];

                // avoid bugs in cases where the regex ends with /g
                route.regex.lastIndex = 0;
                if (route.regex.test(hash) === true) {
                    route.action(hash);

                    return;
                }
            }
        }
        // }}}

    });
    // }}}

    // }}}

    // Assign functions to the global scope's HashDispatcher var (which `this`
    // points to since we call the function without the new operator).
    this.HashDispatcher = HashDispatcher;
})();

// vim:fdm=marker:fmr={{{,}}}:
