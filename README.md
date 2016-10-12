# jsbeautify-loader [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![dependencies][jsbeautify-loader-dependencies-image]][jsbeautify-loader-dependencies-url]
> Webpack loader for jsbeautify-loader

## Ustage

Code syntax can be either define in `.jsbeautifyrc` file or in webpack config file:

### Example

```javascript
module.exports = {
  jsBeautify: {
    "js": {
      "allowed_file_extensions": ["js"], // optional parameter in case allowed file extension is the same as name of parent property.
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

```javascript
module.exports = {
  jsBeautify: {
    "js": {
      "allowed_file_extensions": ["js"], // optional parameter in case allowed file extension is the same as name of parent property.
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
    loaders: [
      {
        test: /\.njk$/,
        loader: "file?name=template.html!./index?type=html!nunjucks-html"
      }
    ]
  }
};
```

```javascript
module.exports = {
  jsBeautify: {
    // configuration for each file regardless of its extension.
    "indent_size": 2,
    "indent_char": " ",
    "space_after_anon_function": true
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
### Options
#### type
Type: `String`, optional, options: (js|css|html)

Determines what type of jsbeautify handler should be used. If content is a HTML code then type should "html". If type parameter is not specified than the extension of file is taken.

---
All available code formatting options you can find here: [https://github.com/beautify-web/js-beautify](https://github.com/beautify-web/js-beautify)

##### Release History
 * 2016-10-12   v0.3.0   Added type parameter in order to handle specific file's extensions.
 * 2016-09-19   v0.2.2   Initial version.

License: MIT

Author [Tomasz Czechowski
](http://czechowski.pl/)

[travis-url]: http://travis-ci.org/tomaszczechowski/jsbeautify-loader
[travis-image]: https://secure.travis-ci.org/tomaszczechowski/jsbeautify-loader.svg?branch=master
[npm-url]: https://npmjs.org/package/jsbeautify-loader
[npm-image]: https://badge.fury.io/js/jsbeautify-loader.svg
[jsbeautify-loader-dependencies-image]: https://david-dm.org/tomaszczechowski/jsbeautify-loader/status.png
[jsbeautify-loader-dependencies-url]: https://david-dm.org/tomaszczechowski/jsbeautify-loader#info=dependencies