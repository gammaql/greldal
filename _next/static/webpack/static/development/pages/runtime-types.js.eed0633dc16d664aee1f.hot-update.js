webpackHotUpdate("static\\development\\pages\\runtime-types.js",{

/***/ "./pages/runtime-types.md":
/*!********************************!*\
  !*** ./pages/runtime-types.md ***!
  \********************************/
/*! exports provided: default, tableOfContents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tableOfContents", function() { return tableOfContents; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mdx-js/tag */ "../../node_modules/@mdx-js/tag/dist/index.js");
/* harmony import */ var _mdx_js_tag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\pages\\runtime-types.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



/* harmony default export */ __webpack_exports__["default"] = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "h1",
    components: components,
    props: {
      "id": "runtime-type-validators"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h1",
    props: {
      "href": "#runtime-type-validators",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  })), "Runtime Type Validators"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, "In the introduction section, we saw that stores are defined like this:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "hljs language-ts",
      "metaString": ""
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "import"), " { types, mapDataSource } ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "from"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "\"greldal\""), ";\n\n", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, "const"), " users = mapDataSource({\n    name: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, "\"User\""), ",\n    description: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, "\"users\""), ",\n    fields: {\n        id: {\n            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, "type"), ": types.string,\n            to: GraphQLID,\n        },\n        name: {\n            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, "type"), ": types.string,\n        },\n    },\n});")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, "In this post, we explore more on the type specifications (eg. ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, "types.string"), ") in the mapping above."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, "These type specifications are referred to as runtime types, and they validate the type of arguments at runtime. They are not implemented inside GRelDAL, but we use ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "p",
    props: {
      "href": "https://github.com/gcanti/io-ts"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, "io-ts"), ", an excellent library by ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "p",
    props: {
      "href": "https://mobile.twitter.com/GiulioCanti"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, "Giulio Canti"), "."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "You may wonder that given GRaphQL already does validation of types at boundaries, why bother with this at all."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, "There are two reasons:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "ol",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "li",
    components: components,
    parentName: "ol",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    parentName: "li",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, "We can extract out static types from these runtime types. This enables us to write type-safe code, when using TypeScript, without ever having to define any additional types. We can simply derive the types of the entities from the data source mapping itself and if you use incorrect fields or arguments, your code will fail to compile.")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "li",
    components: components,
    parentName: "ol",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    parentName: "li",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, "Runtime types are composable and support ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "p",
    props: {
      "href": "https://github.com/gcanti/io-ts#refinements"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, "refinements"), ", so you can embed generic validation logic in the runtime types and share them across field mappings & argument mappings across multiple stores and operations."))));
});
var tableOfContents = function tableOfContents() {
  var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return [{
    id: "runtime-type-validators",
    level: 1,
    title: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "a",
      components: components,
      props: {
        "href": "#runtime-type-validators",
        "aria-hidden": "true"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "span",
      components: components,
      parentName: "a",
      props: {
        "className": "icon icon-link"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      },
      __self: this
    })), "Runtime Type Validators"),
    children: []
  }];
};
    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/runtime-types")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "../../node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=runtime-types.js.eed0633dc16d664aee1f.hot-update.js.map