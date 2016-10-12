/**
 * jsBeautify loader for Webpack
 * @author Tomasz Czechowski (czechowski.pl)
 * @copyright 2016
 * @license MIT
 */
var path = require("path")
  , fs = require("fs")
  , beautify = require('js-beautify')
  , qs = require('query-string')
  , RcLoader = require("rcloader")
  , stripJsonComments = require('strip-json-comments')
  , fileExtensionParser = require('file-extension')
  , rcFile = new RcLoader(".jsbeautifyrc", null, {
    loader: function (path) {
      return path;
    }
  });

/**
 * Method returns beautify handler for specific type of file.
 * @param  {String} type - type of file e.g. html or js.
 * @return {Object}      - beautify object.
 */
var getBeautify = function (type) {
  var handlers = { 'html': beautify.html, 'css': beautify.css, 'js': beautify.js };

  if (type === undefined) {
    return beautify;
  }

  if (type in handlers) {
    return handlers[type];
  }

  throw new Error('Unrecognized beautifier type:', type);
};

/**
 * Method checks whether jsBeautify property exists in webpack config file.
 * @return {Object} - returns config object or null in case object does not exist.
 */
var getGlobalOptions = function () {
  if ('jsBeautify' in this.options) {
    return this.options.jsBeautify;
  }

  return null;
};

/**
 * Method checks whether config object is nested.
 * @param  {Object}  obj - configuration object.
 * @return {Boolean}
 */
var isNestedStructure = function (obj) {
  for (var prop in obj) {
    //todo: if obj[prop] would be an array? check if obj[prop] is LITERAL object!
    if (typeof obj[prop] === "object") {
      return true;
    }
  }

  return false;
};

/**
 * Method checks whether file's extension has corresponded configuration object.
 * @param  {Object} options       - configuration object.
 * @param  {String} fileExtension - file's extension.
 * @return {String|Object}        - object key or null.
 */
var getOptionsForExtension = function (options, fileExtension) {
  var getOptionsKey = function (options, fileExtension) {
    for (var prop in options) {
      var _prop = prop.toLowerCase();

      if ((options[_prop].hasOwnProperty('allowed_file_extensions') && options[_prop].allowed_file_extensions.indexOf(fileExtension) > -1) || (!options[_prop].hasOwnProperty('allowed_file_extensions') && _prop === fileExtension)) {
        return prop;
      }
    }

    return null;
  };

  if (isNestedStructure(options)) {
    var optionsKey = getOptionsKey(options, fileExtension);
    return optionsKey !== null ? options[optionsKey]: {};
  }

  return options;
};

/**
 * Method parses file synchronously
 * @param  {String} source        - file's content.
 * @param  {String} fileExtension - file's extension.
 * @param  {Object} globalOptions - configuration from weback file.
 * @return {String}               - parsed content of file.
 */
var processSync = function (source, fileExtension, globalOptions, beautify) {
  var path = rcFile.for(this.resourcePath)
    , options = globalOptions || {};

  if (globalOptions === null && typeof path === "string") {
    this.addDependency(path);
    options = JSON.parse(stripJsonComments(fs.readFileSync(path, "utf8")));
  }

  return beautify(source, getOptionsForExtension(options, fileExtension));
};

/**
 * Method parses file asynchronously
 * @param {String} source        - file's content.
 * @param {String} fileExtension - file's extension.
 * @param {Object} globalOptions - configuration from weback file.
 * @param {Function} callback    - callback function with processed file content or with error message.
 */
var processAsync = function (source, fileExtension, globalOptions, beautify, callback) {
  var _this = this;

  if (globalOptions === null) {
    rcFile.for(this.resourcePath, function (err, path) {
      if (!err) {
        if (typeof path === "string") {
          _this.addDependency(path);

          fs.readFile(path, "utf8", function (err, file) {
            if (!err) {
              var options = getOptionsForExtension(JSON.parse(stripJsonComments(file)), fileExtension);
              callback(null, beautify(source, options));
            } else {
              callback(err);
            }
          });
        } else {
          callback(null, beautify(source, {}));
        }
      } else {
        callback(err);
      }
    });
  } else {
    callback(null, beautify(source, getOptionsForExtension(globalOptions, fileExtension)));
  }
};

/**
 * Module definition
 * @param  {String} source - file content.
 * @return {String}        - modified file content or nothing if task is ran asynchronously.
 */
module.exports = function (source) {
  this.cacheable();

  var callback = this.async()
    , options = getGlobalOptions.call(this)
    , queryStringOptions = qs.parse(this.query)
    , fileExtension = fileExtensionParser(this.resource).toLowerCase()
    , beautifierType = ('type' in queryStringOptions) ? queryStringOptions.type.toLowerCase() : fileExtension
    , beautifyHandler = getBeautify(beautifierType);

  if (!callback) {
    return processSync.call(this, source, fileExtension, options, beautifyHandler);
  }

  processAsync.call(this, source, fileExtension, options, beautifyHandler, callback);
};
