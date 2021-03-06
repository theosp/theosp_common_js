/*
RERUIRES: Daniel Chcouri's theosp_common_js (theosp.js)
          Steven Levithan date.format.js
*/

(function () {
    // init theosp.debug {{{
    theosp.debug = {};
    // }}}
    
    // theosp.debug.initDebugBox {{{
    var debug_box_initiated = false;
    theosp.debug.initDebugBox = function () {
        if (debug_box_initiated === false) {
            debug_box_initiated = true;
            
            $('body').append(
                '<style type="text/css">' + 
                    '#debug_box_container {' +
                        'width: 400px; ' +
                        'height: 300px; ' +
                        'position: absolute; ' +
                        'top: 10px; ' +
                        'left: 10px; ' +
                        'background-color: black; ' +
                        'overflow: auto; ' +
                        'color: white; ' +
                    '}' +
                    '#debug_box_content {' +
                        'font-size: 10px; ' +
                    '}' +
                '</style>' +
                '<div id="debug_box_container">' +
                    '<div id="debug_box_header">' +
                        '<b style="color: red;">Debug Messages:</b><br />' +
                        '<span style="color: yellow">Debug Level: [' + debug_level.join(', ') + ']</span>' +
                    '</div>' +
                    '<div id="debug_box_content">' +
                    '</div>' +
                '</div>'
            );
        }
    };
    // }}}

    // isCurrectDebugLevel {{{
    theosp.debug.isCurrectDebugLevel = function (levels) {
        var levels_in_debug = false;

        if (typeof debug_mode !== 'undefined' && debug_mode === true) {
            if (theosp.array.isArray(levels)) {
                for (var i = 0; i < levels.length; i++) {
                    var level = levels[i];
                
                    if (theosp.array.indexOf(level, debug_level) !== -1) {
                        levels_in_debug = true;
                    }
                }
            } else {
                if (theosp.array.indexOf(levels, debug_level) !== -1) {
                    levels_in_debug = true;
                }
            }

            if (levels_in_debug === true || debug_level.length === 0) {
                return true;
            }
        }

        return false;
    };
    // }}}

    // log {{{
    theosp.debug.log = function (message, levels) {
        if (theosp.debug.isCurrectDebugLevel(levels) === true) {
            theosp.debug.initDebugBox();

            $("#debug_box_content").prepend(
                '<span style="color: yellow;">' + (new Date()).format("h:MM:ss.l") + " :: " + JSON.stringify(levels) + "</span>:<br />" +
                message + "<br /><br />"
            );
        }
    };
    // }}}

})();

// vim:fdm=marker:fmr={{{,}}}:
