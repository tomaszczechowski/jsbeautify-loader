/**
 * jsBeautifiler Loader for Webpack
 * @author Tomasz Czechowski
 * @copyright 2016
 * @license MIT
 */
var path = require("path")
  , fs = require("fs")
  , beautify = require('js-beautify')
  , RcLoader = require("rcloader")
  , stripJsonComments = require('strip-json-comments')
  , fileExtensionParser = require('file-extension')
  , rcFile = new RcLoader(".jsbeautifyrc", null, {
    loader: function (path) {
      return path;
    }
  });

/**
 * Method checks whether jsBeautfier exists in webpack config file.
 * @return {Object} - returns config object or null in case object does not exist.
 */
var getGlobalOptions = function () {
  if ('jsBeautfier' in this.options) {
    return this.options.jsBeautfier;
  }

  return null;
};

/**
 * Methid checks whether config object is nested.
 * @param  {Object}  obj - configuration object.
 * @return {Boolean}
 */
var isNestedStructure = function (obj) {
  for (var prop in obj) {
    if (typeof obj[prop] === "object") {
      return true;
    }
  }

  return false;
};

/**
 * Method checks whether file's extensions has corresponded configuration object.
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
 * Method parses file synchroniously
 * @param  {String} source        - file content.
 * @param  {String} fileExtension - file's extension.
 * @param  {Object} globalOptions - configuration from weback file.
 * @return {String}               - parsed content of file.
 */
var processSync = function (source, fileExtension, globalOptions) {
  var path = rcFile.for(this.resourcePath)
    , options = globalOptions || {};

  if (globalOptions === null && typeof path === "string") {
    this.addDependency(path);
    options = getOptionsForExtension(JSON.parse(stripJsonComments(fs.readFileSync(path, "utf8"))), fileExtension);
  }

  return beautify(source, options);
};

/**
 * Method parses file asysynchroniously
 * @param  {String} source        - file content.
m* @param  {String} fileExtension - file's extension.
 * @param  {Object} globalOptions - configuration from weback file.
 * @param  {Function} callback    - callback function with processed content or with error.
 */
var processAsync = function (source, fileExtension, globalOptions, callback) {
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
 * @param  {String} source - file content
 * @return {[type]}        [description]
 */g
module.exports = function (source) {
  this.cacheable();
  var callback = this.async()
    , options = getGlobalOptions.call(this)
    , fileExtension = fileExtensionParser(this.resource).toLowerCase();

  if (!callback) {
    return processSync.call(this, source, fileExtension, options);
  }

  processAsync.call(this, source, fileExtension, options, callback);
};