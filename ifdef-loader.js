"use strict";
var url = require("url");
var queryString = require("querystring");
var preprocessor_1 = require("./preprocessor");
module.exports = function (source, map) {
    this.cacheable && this.cacheable();
    var data;
    if (typeof this.query === 'string') {
        var query = queryString.parse(url.parse(this.query).query);
        data = JSON.parse(query.json);
    }
    else {
        data = this.query;
    }
    var verboseFlag = "ifdef-verbose";
    var verbose = data[verboseFlag];
    if (verbose !== undefined) {
        delete data[verboseFlag];
    }
    var tripleSlashFlag = "ifdef-triple-slash";
    var tripleSlash = data[tripleSlashFlag];
    if (tripleSlash !== undefined) {
        delete data[tripleSlashFlag];
    }
    try {
        source = preprocessor_1.parse(source, data, verbose, tripleSlash);
        this.callback(null, source, map);
    }
    catch (err) {
        var errorMessage = "ifdef-loader error: " + err;
        this.callback(new Error(errorMessage));
    }
};
