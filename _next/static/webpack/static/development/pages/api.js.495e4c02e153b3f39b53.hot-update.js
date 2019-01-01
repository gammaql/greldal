webpackHotUpdate("static\\development\\pages\\api.js",{

/***/ "./components/TypePresenter.js":
/*!*************************************!*\
  !*** ./components/TypePresenter.js ***!
  \*************************************/
/*! exports provided: TypePresenter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypePresenter", function() { return TypePresenter; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_json_tree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-json-tree */ "../../node_modules/react-json-tree/lib/index.js");
/* harmony import */ var react_json_tree__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_json_tree__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _HierarchyContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HierarchyContext */ "./components/HierarchyContext.js");
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\components\\TypePresenter.js";



 // https://github.com/reduxjs/redux-devtools/blob/75322b15ee7ba03fddf10ac3399881e302848874/src/react/themes/default.js

var theme = {
  scheme: "default",
  author: "chris kempson (http://chriskempson.com)",
  base00: "#181818",
  base01: "#282828",
  base02: "#383838",
  base03: "#585858",
  base04: "#b8b8b8",
  base05: "#d8d8d8",
  base06: "#e8e8e8",
  base07: "#f8f8f8",
  base08: "#ab4642",
  base09: "#dc9656",
  base0A: "#f7ca88",
  base0B: "#a1b56c",
  base0C: "#86c1b9",
  base0D: "#7cafc2",
  base0E: "#ba8baf",
  base0F: "#a16946"
};
var TypePresenter = function TypePresenter(_ref) {
  var type = _ref.type;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_HierarchyContext__WEBPACK_IMPORTED_MODULE_3__["HierarchyContext"].Consumer, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, function (_ref2) {
    var hierarchy = _ref2.hierarchy;
    var primary, primaryEntity;

    if (type.type === "reference") {
      primary = type.name;

      if (primary) {
        primaryEntity = Object(_utils_api__WEBPACK_IMPORTED_MODULE_2__["findAnywhereInHierarchy"])();
      }
    }

    var tree = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_json_tree__WEBPACK_IMPORTED_MODULE_1___default.a, {
      data: type,
      theme: theme,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 38
      },
      __self: this
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, tree);
  });
};

/***/ })

})
//# sourceMappingURL=api.js.495e4c02e153b3f39b53.hot-update.js.map