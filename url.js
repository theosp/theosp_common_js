/*
Node.js's Url

RERUIRES: Node.js's QueryString
          Daniel Chcouri's theosp_common_js (theosp.js)
*/
(function () {
    var protocolPattern = /^([a-z0-9]+:)/,
        portPattern = /:[0-9]+$/,
        delims = ['<', '>', '"', '\'', '`', /\s/],
        unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
        nonHostChars = ['/', '?', ';', '#'].concat(unwise),
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[a-z0-9][a-z0-9A-Z-]{0,62}$/,
        unsafeProtocol = {
          'javascript': true,
          'javascript:': true
        },
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true,
          'file': true,
          'file:': true
        },
        pathedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        },
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        },
        querystring = NODE_QUERY_STRING;

    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && typeof(url) === 'object' && url.href) return url;
    
      var out = {},
          rest = url;
    
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        out.protocol = proto;
        rest = rest.substr(proto.length);
      }
    
      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          out.slashes = true;
        }
      }
    
      if (!hostlessProtocol[proto] &&
          (slashes || (proto && !slashedProtocol[proto]))) {
        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        // don't enforce full RFC correctness, just be unstupid about it.
        var firstNonHost = -1;
        for (var i = 0, l = nonHostChars.length; i < l; i++) {
          var index = rest.indexOf(nonHostChars[i]);
          if (index !== -1 &&
              (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
        }
        if (firstNonHost !== -1) {
          out.host = rest.substr(0, firstNonHost);
          rest = rest.substr(firstNonHost);
        } else {
          out.host = rest;
          rest = '';
        }
    
        // pull out the auth and port.
        var p = parseHost(out.host);
        var keys = theosp.object.keys(p);
        for (var i = 0, l = keys.length; i < l; i++) {
          var key = keys[i];
          out[key] = p[key];
        }
        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        out.hostname = out.hostname || '';
    
        // validate a little.
        if (out.hostname.length > hostnameMaxLen) {
          out.hostname = '';
        } else {
          var hostparts = out.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part.match(hostnamePartPattern)) {
              out.hostname = '';
              break;
            }
          }
        }
      }
    
      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[proto]) {
        var chop = rest.length;
        for (var i = 0, l = delims.length; i < l; i++) {
          var c = rest.indexOf(delims[i]);
          if (c !== -1) {
            chop = Math.min(c, chop);
          }
        }
        rest = rest.substr(0, chop);
      }
    
    
      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        out.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        out.search = rest.substr(qm);
        out.query = rest.substr(qm + 1);
        if (parseQueryString) {
          out.query = querystring.parse(out.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        out.search = '';
        out.query = {};
      }
      if (rest) out.pathname = rest;
      if (slashedProtocol[proto] &&
          out.hostname && !out.pathname) {
        out.pathname = '/';
      }
    
      // finally, reconstruct the href based on what has been validated.
      out.href = urlFormat(out);
    
      return out;
    }

    // format a parsed object into a url string
    function urlFormat(obj) {
      // ensure it's an object, and not a string url.
      // If it's an obj, this is a no-op.
      // this way, you can call url_format() on strings
      // to clean up potentially wonky urls.
      if (typeof(obj) === 'string') obj = urlParse(obj);

      var protocol = obj.protocol || '',
          host = (obj.host !== undefined) ? obj.host :
              obj.hostname !== undefined ? (
                  (obj.auth ? obj.auth + '@' : '') +
                  obj.hostname +
                  (obj.port ? ':' + obj.port : '')
              ) :
              false,
          pathname = obj.pathname || '',
          search = obj.search || (
              obj.query && ('?' + (
                  typeof(obj.query) === 'object' ?
                  querystring.stringify(obj.query) :
                  String(obj.query)
              ))
          ) || '',
          hash = obj.hash || '';

      if (protocol && protocol.substr(-1) !== ':') protocol += ':';

      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (obj.slashes ||
          (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }

      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;

      return protocol + host + pathname + search + hash;
    }

    function parseHost(host) {
      var out = {};
      var at = host.indexOf('@');
      if (at !== -1) {
        out.auth = host.substr(0, at);
        host = host.substr(at + 1); // drop the @
      }
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        out.port = port.substr(1);
        host = host.substr(0, host.length - port.length);
      }
      if (host) out.hostname = host;
      return out;
    }

    // Assign functions to the global scope's NODE_URL var (which `this`
    // points to since we call the function without the new operator).
    this.NODE_URL = {
        parse: urlParse,
        format: urlFormat
    };
})();
