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
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! qs */ "../../node_modules/qs/lib/index.js");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_json_tree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-json-tree */ "../../node_modules/react-json-tree/lib/index.js");
/* harmony import */ var react_json_tree__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_json_tree__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _HierarchyContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HierarchyContext */ "./components/HierarchyContext.js");
/* harmony import */ var _Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Link */ "./components/Link.js");
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_HierarchyContext__WEBPACK_IMPORTED_MODULE_4__["HierarchyContext"].Consumer, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, function (_ref2) {
    var hierarchy = _ref2.hierarchy;
    var primary;

    if (type.type === "reference") {
      primary = type.name;

      if (primary) {
        var primaryEntity = Object(_utils_api__WEBPACK_IMPORTED_MODULE_3__["findAnywhereInHierarchy"])(hierarchy, primary);

        if (primaryEntity) {
          primary = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Link__WEBPACK_IMPORTED_MODULE_5__["Link"], {
            href: "?" + qs__WEBPACK_IMPORTED_MODULE_1___default.a.stringify({
              apiCategory: "ConfigType",
              rootEntityName: primary
            }),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 40
            },
            __self: this
          }, primary);
        } else {
          primary = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            href: "https://github.com/gql-dal/greldal/search?q=".concat(primary),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 53
            },
            __self: this
          }, primary);
        }
      }
    }

    var tree = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_json_tree__WEBPACK_IMPORTED_MODULE_2___default.a, {
      data: type,
      theme: theme,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57
      },
      __self: this
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, primary, primary && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61
      },
      __self: this
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      title: "The parsed representation of type. This structure can provide more information about type parameters",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62
      },
      __self: this
    }, "Details"), tree);
  });
};

/***/ })

})
//# sourceMappingURL=api.js.5593dc023bf44d3ad705.hot-update.js.map