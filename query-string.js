/*
Node.js's QueryString

RERUIRES: Node.js's Buffer
*/

(function () {
    var QueryString = {};

    function charCode (c) {
      return c.charCodeAt(0);
    }

    QueryString.unescapeBuffer = decodeURIComponent;


    QueryString.unescape = function (s, decodeSpaces) {
      return QueryString.unescapeBuffer(s, decodeSpaces).toString();
    };


    QueryString.escape = function (str) {
      return encodeURIComponent(str);
    };

    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case "string":
          return v;

        case "boolean":
          return v ? "true" : "false";

        case "number":
          return isFinite(v) ? v : "";

        default:
          return "";
      }
    };

    /**
     * <p>Converts an arbitrary value to a Query String representation.</p>
     *
     * <p>Objects with cyclical references will trigger an exception.</p>
     *
     * @method stringify
     * @param obj {Variant} any arbitrary value to convert to query string
     * @param sep {String} (optional) Character that should join param k=v pairs together. Default: "&"
     * @param eq  {String} (optional) Character that should join keys to their values. Default: "="
     * @param name {String} (optional) Name of the current key, for handling children recursively.
     * @static
     */
    QueryString.stringify = QueryString.encode = function (obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      obj = (obj === null) ? undefined : obj;

      switch (typeof obj) {
        case "object":
          return theosp.array.map(theosp.object.keys(obj), function(k) {
            if (theosp.array.isArray(obj[k])) {
              return obj[k].map(function(v) {
                return QueryString.escape(stringifyPrimitive(k)) +
                       eq +
                       QueryString.escape(stringifyPrimitive(v));
              }).join(sep);
            } else {
              return QueryString.escape(stringifyPrimitive(k)) + 
                     eq +
                     QueryString.escape(stringifyPrimitive(obj[k]));
            }
          }).join(sep);

        default:
          return (name) ?
            QueryString.escape(stringifyPrimitive(name)) + eq +
              QueryString.escape(stringifyPrimitive(obj)) :
            "";
      }
    };

    // Parse a key=val string.
    QueryString.parse = QueryString.decode = function (qs, sep, eq) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};

      if (typeof qs !== 'string') {
        return obj;
      }

      var splitted = qs.split(sep);

      for (var i = 0; i < splitted.length; i++) {
        var kvp = splitted[i];
      
        var x = kvp.split(eq);
        var k = QueryString.unescape(x[0], true);
        var v = QueryString.unescape(x.slice(1).join(eq), true);

        if (!(k in obj)) {
            obj[k] = v;
        } else if (!theosp.array.isArray(obj[k])) {
            obj[k] = [obj[k], v];
        } else {
            obj[k].push(v);
        }
          
      }

      return obj;
    };

    // Assign functions to the global scope's QUERY_STRING var (which `this`
    // points to since we call the function without the new operator).
    this.NODE_QUERY_STRING = QueryString;
})();
