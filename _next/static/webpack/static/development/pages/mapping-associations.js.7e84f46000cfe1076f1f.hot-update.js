webpackHotUpdate("static\\development\\pages\\mapping-associations.js",{

/***/ "./components/CodeSnippet.js":
/*!***********************************!*\
  !*** ./components/CodeSnippet.js ***!
  \***********************************/
/*! exports provided: CodeSnippet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeSnippet", function() { return CodeSnippet; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-syntax-highlighter */ "../../node_modules/react-syntax-highlighter/dist/esm/index.js");
/* harmony import */ var dedent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dedent */ "../../node_modules/dedent/dist/dedent.js");
/* harmony import */ var dedent__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dedent__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var assert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! assert */ "../../node_modules/assert/assert.js");
/* harmony import */ var assert__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(assert__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_syntax_highlighter_dist_cjs_styles_hljs_github__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-syntax-highlighter/dist/cjs/styles/hljs/github */ "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs/github.js");
/* harmony import */ var react_syntax_highlighter_dist_cjs_styles_hljs_github__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter_dist_cjs_styles_hljs_github__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _api_snippets_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../api/snippets.json */ "../../api/snippets.json");
var _api_snippets_json__WEBPACK_IMPORTED_MODULE_5___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../api/snippets.json */ "../../api/snippets.json", 1);
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\components\\CodeSnippet.js";






var CodeSnippet = function CodeSnippet(_ref) {
  var name = _ref.name,
      _ref$language = _ref.language,
      language = _ref$language === void 0 ? "javascript" : _ref$language,
      _ref$stripTripleComme = _ref.stripTripleComment,
      stripTripleComment = _ref$stripTripleComme === void 0 ? true : _ref$stripTripleComme,
      _ref$dedent = _ref.dedent,
      dedent = _ref$dedent === void 0 ? true : _ref$dedent,
      transform = _ref.transform;
  assert__WEBPACK_IMPORTED_MODULE_3___default()(_api_snippets_json__WEBPACK_IMPORTED_MODULE_5__[name], "Snippet could not be found ".concat(name));
  var content = _api_snippets_json__WEBPACK_IMPORTED_MODULE_5__[name].content;
  if (stripTripleComment) content = content.replace(/\s\/\/\/\s/g, " ");
  if (dedent) content = dedent__WEBPACK_IMPORTED_MODULE_2___default()(content);
  if (transform) content = transform(content);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_1__["default"], {
    language: language,
    style: react_syntax_highlighter_dist_cjs_styles_hljs_github__WEBPACK_IMPORTED_MODULE_4___default.a,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, content);
};

/***/ })

})
//# sourceMappingURL=mapping-associations.js.7e84f46000cfe1076f1f.hot-update.js.map