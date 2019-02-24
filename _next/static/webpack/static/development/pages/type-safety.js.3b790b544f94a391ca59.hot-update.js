webpackHotUpdate("static\\development\\pages\\type-safety.js",{

/***/ "./components/Link.js":
/*!****************************!*\
  !*** ./components/Link.js ***!
  \****************************/
/*! exports provided: Link, Anchor, TrailingIcon, NextPageLink */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return Link; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Anchor", function() { return Anchor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrailingIcon", function() { return TrailingIcon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NextPageLink", function() { return NextPageLink; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/link */ "../../node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! slugify */ "../../node_modules/slugify/index.js");
/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_7__);
function _templateObject2() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n                float: left;\n                background: gray;\n                margin: -5px;\n                padding: 5px 10px;\n                border-radius: 4px 0 0 4px;\n                margin-right: 5px;\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n                margin-left: 10px;\n                padding-left: 5px;\n                border-left: 1px solid white;\n            "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}






var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\components\\Link.js";





var Link = function Link(_ref) {
  var _ref$href = _ref.href,
      href = _ref$href === void 0 ? slugify__WEBPACK_IMPORTED_MODULE_7___default()(children || "") : _ref$href,
      className = _ref.className,
      style = _ref.style,
      children = _ref.children,
      highlighted = _ref.highlighted,
      props = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, ["href", "className", "style", "children", "highlighted"]);

  return children && react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_5___default.a, Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({}, props, {
    href: "".concat("", "/").concat(href),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(Anchor, Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
    className: className,
    style: style,
    highlighted: highlighted
  }, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }), children));
};
var Anchor = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].a.withConfig({
  displayName: "Link__Anchor",
  componentId: "sc-1hbrjrd-0"
})(["cursor:pointer;", ";"], function (props) {
  return props.highlighted && "background: black;\n        padding: 5px;\n        text-transform: uppercase;\n        border-radius: 4px;\n        color: white !important;";
});
var TrailingIcon = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "Link__TrailingIcon",
  componentId: "sc-1hbrjrd-1"
})(["margin-right:5px;float:right;"]);
var NextPageLink = function NextPageLink(_ref2) {
  var children = _ref2.children,
      _ref2$href = _ref2.href,
      href = _ref2$href === void 0 ? S(children).slugify().s : _ref2$href,
      props = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref2, ["children", "href"]);

  return react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(Link, Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
    highlighted: true
  }, props, {
    href: href,
    style: {
      display: "inline-block",
      cursor: "pointer"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_StyledTrailingIcon, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, "\u2BC8"), react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Next"), " ", react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("strong", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, children));
};

var _StyledTrailingIcon = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["default"])(TrailingIcon)(_templateObject());

var _StyledDiv = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["default"])("div")(_templateObject2());

/***/ })

})
//# sourceMappingURL=type-safety.js.3b790b544f94a391ca59.hot-update.js.map