Array.isArray = 
    Array.isArray || // Part of ECMAScript5
    function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};
