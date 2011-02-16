/*
Node.js's Url

RERUIRES: Node.js's QueryString
              Node.js's Buffer
          Daniel Chcouri's theosp_common_js (theosp.js)
*/
(function () {
    var protocolPattern = /^([a-z0-9]+:)/,
        portPattern = /:[0-9]+$/,
        nonHostChars = ['/', '?', ';', '#'],
        hostlessProtocol = {
          'file': true,
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

      var out = { href: url },
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
      }

      // now rest is set to the post-host stuff.
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
        out.query = {};
      }
      if (rest) out.pathname = rest;

      return out;
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
        parse: urlParse
    };
})();
