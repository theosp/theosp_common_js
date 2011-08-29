/*
$.RazossDockElements.ClassicDock

AUTHOR: Daniel Chcouri <333222@gmail.com>

RERUIRES: jQuery
          HeadJS
          Daniel Chcouri's theosp_common_js (theosp.js)
*/
(function () {

    // theosp {{{
    var theosp_css3 = {

        // setGradient {{{
        setGradient: function (element, begin_color, end_color, gradient_type) {
            element = $(element);

            var background = {
                    position: (gradient_type === "horizontal") ? "center top" : "left center",
                    begin: "left top",
                    end: (gradient_type === "horizontal") ? "left bottom" : "right top",
                    begin_color: begin_color,
                    end_color: end_color,
                    ie_gradient_type: (gradient_type === "horizontal") ? 0 : 1
                };

            if ($("html").hasClass("webkit")) {
                element.css({
                    backgroundImage: "-webkit-gradient(linear, " + background.begin + ", " + background.end + ", from(" + background.begin_color + "), to(" + background.end_color + "))"
                });
            } else if ($("html").hasClass("mozilla")) {
                element.css({
                    backgroundImage: "-moz-linear-gradient(" + background.position + ", " + background.begin_color + ", " + background.end_color + ")"
                });
            } else if ($("html").hasClass("opera")) {
                element.css({
                    backgroundImage: "-o-linear-gradient(" + background.position + ", " + background.begin_color + ", " + background.end_color + ")"
                });
            } else if ($("html").hasClass("ie")) {
                element.css({
                    filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=" + background.begin_color + ", endColorstr=" + background.end_color + ", GradientType=" + background.ie_gradient_type + ")"
                });
            } else {
                element.css({
                    backgroundImage: "linear-gradient(" + background.position + ", " + background.begin_color + ", " + background.end_color + ")"
                });
            }
        }
        // }}}

    };
    // }}}

    // export {{{
    if (typeof module === 'object' && typeof module.exports === 'object') {
        theosp.object.extend(exports, theosp_css3);
    } else {
        this.theosp_css3 = theosp_css3;
    }
    // }}}

})();

// vim:fdm=marker:fmr={{{,}}}:
