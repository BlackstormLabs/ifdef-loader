import path = require('path');
import url = require('url');
import queryString = require('querystring');

import { parse } from "./preprocessor";

export = function (source: string, map) {
  this.cacheable && this.cacheable();
  let data;
  if (typeof this.query === 'string') {
    // webpack 1
    // ?json=... contains JSON encoded data object
    const query = queryString.parse(url.parse(this.query).query);
    data = JSON.parse(query.json);
  } else {
    // webpack 2
    data = this.query;
  }

  const verboseFlag = "ifdef-verbose";
  const verbose = data[verboseFlag];
  if (verbose !== undefined) {
    delete data[verboseFlag];
  }

  const tripleSlashFlag = "ifdef-triple-slash";
  const tripleSlash = data[tripleSlashFlag];
  if (tripleSlash !== undefined) {
    delete data[tripleSlashFlag];
  }

  try {
    source = parse(source, data, verbose, tripleSlash);
    this.callback(null, source, map);
  }
  catch (err) {
    const errorMessage = `ifdef-loader error: ${err}`;
    this.callback(new Error(errorMessage));
  }
};
