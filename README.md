# jsbeautify-loader [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![dependencies][jsbeautify-loader-dependencies-image]][jsbeautify-loader-dependencies-url]
> Webpack loader for jsbeautify-loader

## Ustage

1. Define code syntax in `.jsbeautifyrc` file
2. Apply the jsBeautify loader as pre/postLoader in webpack configuration:

```javascript
module.exports = {
  jsBeautify: {
    "js": {
      "allowed_file_extensions": ["js"],
      "indent_size": 2,
      "indent_char": " ",
      "space_after_anon_function": true
    },
    "html": {
      "allowed_file_extensions": ["html", "xhtml", "shtml", "xml", "svg"],
      "indent_size": 2
    }
  },

  module: {
    preLoaders: [
      {
        test: /\.(js|html)$/,
        exclude: /node_modules/,
        loader: 'jsbeautify-loader'
      }
    ]
  }
};
```
All available options you can find here: [https://github.com/beautify-web/js-beautify](https://github.com/beautify-web/js-beautify)

##### Release History
 * 2016-09-19   v0.1.0   Initial version.

License: MIT

Author [Tomasz Czechowski](http://czechowski.pl/)

[travis-url]: http://travis-ci.org/tomaszczechowski/jsbeautify-loader
[travis-image]: https://secure.travis-ci.org/tomaszczechowski/jsbeautify-loader.svg?branch=master
[npm-url]: https://npmjs.org/package/jsbeautify-loader
[npm-image]: https://badge.fury.io/js/jsbeautify-loader.svg
[jsbeautify-loader-dependencies-image]: https://david-dm.org/tomaszczechowski/jsbeautify-loader/status.png
[jsbeautify-loader-dependencies-url]: https://david-dm.org/tomaszczechowski/jsbeautify-loader#info=dependencies