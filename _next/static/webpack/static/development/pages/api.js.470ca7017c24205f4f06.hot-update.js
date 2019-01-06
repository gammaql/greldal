webpackHotUpdate("static\\development\\pages\\api.js",{

/***/ "./components/APITree.js":
/*!*******************************!*\
  !*** ./components/APITree.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return APITree; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_treebeard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-treebeard */ "../../node_modules/react-treebeard/index.js");
/* harmony import */ var react_treebeard__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_treebeard__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_treebeard_lib_themes_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-treebeard/lib/themes/default */ "../../node_modules/react-treebeard/lib/themes/default.js");
/* harmony import */ var react_treebeard_lib_themes_default__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_treebeard_lib_themes_default__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_treebeard_lib_components_decorators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-treebeard/lib/components/decorators */ "../../node_modules/react-treebeard/lib/components/decorators.js");
/* harmony import */ var react_treebeard_lib_components_decorators__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_treebeard_lib_components_decorators__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\components\\APITree.js";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





react_treebeard_lib_themes_default__WEBPACK_IMPORTED_MODULE_2___default.a.tree.base.backgroundColor = "transparent";
function APITree(_ref) {
  var hierarchy = _ref.hierarchy,
      handleToggle = _ref.handleToggle,
      handleClick = _ref.handleClick;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_treebeard__WEBPACK_IMPORTED_MODULE_1__["Treebeard"], {
    style: react_treebeard_lib_themes_default__WEBPACK_IMPORTED_MODULE_2___default.a,
    data: hierarchy,
    onToggle: handleToggle,
    decorators: _objectSpread({}, react_treebeard_lib_components_decorators__WEBPACK_IMPORTED_MODULE_3___default.a, {
      Header: function Header(props) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          style: _objectSpread({}, props.style, {
            display: "inline-block",
            cursor: "pointer"
          }),
          onClick: handleClick(props.node.name, props.node.entity),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 17
          },
          __self: this
        }, props.node.name);
      }
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  });
}

/***/ })

})
//# sourceMappingURL=api.js.470ca7017c24205f4f06.hot-update.js.map