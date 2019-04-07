webpackHotUpdate("static\\development\\pages\\api.js",{

/***/ "./components/APIEntityContainer.js":
/*!******************************************!*\
  !*** ./components/APIEntityContainer.js ***!
  \******************************************/
/*! exports provided: default, APIContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return APIEntityContainer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APIContainer", function() { return APIContainer; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/classCallCheck */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/createClass */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/possibleConstructorReturn */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/getPrototypeOf */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/inherits */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/assertThisInitialized */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/defineProperty */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! marked */ "../../node_modules/marked/lib/marked.js");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(marked__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react_collapsible__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-collapsible */ "../../node_modules/react-collapsible/dist/Collapsible.js");
/* harmony import */ var react_collapsible__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_collapsible__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _TypePresenter__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./TypePresenter */ "./components/TypePresenter.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Sidebar */ "./components/Sidebar.js");
/* harmony import */ var _ParamsTable__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ParamsTable */ "./components/ParamsTable.js");
/* harmony import */ var _styles_collapsible_css__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../styles/collapsible.css */ "./styles/collapsible.css");
/* harmony import */ var _styles_collapsible_css__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_styles_collapsible_css__WEBPACK_IMPORTED_MODULE_16__);







var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal\\src\\docs\\components\\APIEntityContainer.js";










marked__WEBPACK_IMPORTED_MODULE_8___default.a.setOptions({
  gfm: true,
  tables: true
});

var APIEntityContainer =
/*#__PURE__*/
function (_React$Component) {
  Object(_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(APIEntityContainer, _React$Component);

  function APIEntityContainer() {
    var _getPrototypeOf2;

    var _this;

    Object(_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, APIEntityContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = Object(_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, (_getPrototypeOf2 = Object(_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(APIEntityContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)), "containerRef", react__WEBPACK_IMPORTED_MODULE_7___default.a.createRef());

    return _this;
  }

  Object(_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(APIEntityContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.bringToView();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.bringToView();
    }
  }, {
    key: "bringToView",
    value: function bringToView() {
      if (this.props.activeEntityName && this.props.entity.name === this.props.activeEntityName) {
        this.containerRef.current.scrollIntoView();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          entity = _this$props.entity,
          activeEntityName = _this$props.activeEntityName;
      return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(APIContainer, {
        ref: this.containerRef,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(EntityHeader, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      }, entity.kindString && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          float: "right",
          color: "silver"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, "(", entity.kindString, ")"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, Object(_utils_api__WEBPACK_IMPORTED_MODULE_13__["getAPIName"])(entity))), entity.comment && this.renderDescription(), entity.type && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_14__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        },
        __self: this
      }, "Type"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_TypePresenter__WEBPACK_IMPORTED_MODULE_12__["TypePresenter"], {
        type: entity.type,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        },
        __self: this
      })), entity.signatures && entity.signatures.map(function (sig) {
        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_7___default.a.Fragment, null, sig.comment && sig.comment.shortText && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("section", {
          className: "api-section",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_14__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 56
          },
          __self: this
        }, "Description"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("p", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 57
          },
          __self: this
        }, sig.comment.shortText)), sig.parameters && sig.parameters.length > 0 && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Section, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_14__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 63
          },
          __self: this
        }, "Parameters"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_ParamsTable__WEBPACK_IMPORTED_MODULE_15__["ParamsTable"], {
          params: sig.parameters,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          },
          __self: this
        })), sig.type && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Section, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 68
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_14__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 69
          },
          __self: this
        }, "Returns"), Object(lodash__WEBPACK_IMPORTED_MODULE_11__["get"])(Object(lodash__WEBPACK_IMPORTED_MODULE_11__["find"])(entity.tags, {
          tag: "returns"
        }), "text"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_TypePresenter__WEBPACK_IMPORTED_MODULE_12__["TypePresenter"], {
          type: sig.type,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 71
          },
          __self: this
        })));
      }), entity.sources && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_14__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        },
        __self: this
      }, "Sources"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("ul", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 79
        },
        __self: this
      }, Object(lodash__WEBPACK_IMPORTED_MODULE_11__["uniqBy"])(entity.sources, function (s) {
        return s.fileName;
      }).map(function (src) {
        var fileName = src.fileName.replace(/\.d\.ts$/, ".ts");
        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("li", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 83
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("a", {
          href: "https://github.com/gql-dal/greldal/blob/master/src/".concat(fileName),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 84
          },
          __self: this
        }, fileName));
      }))), entity.children && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 94
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_14__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 95
        },
        __self: this
      }, "Members"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(MemberListContainer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 96
        },
        __self: this
      }, entity.children.map(function (e) {
        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(react_collapsible__WEBPACK_IMPORTED_MODULE_10___default.a, {
          trigger: react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 100
            },
            __self: this
          }, e.kindString && react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
            style: {
              float: "right",
              color: "silver"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 102
            },
            __self: this
          }, "(", e.kindString, ")"), Object(_utils_api__WEBPACK_IMPORTED_MODULE_13__["getAPIName"])(e)),
          open: activeEntityName && e.name === activeEntityName,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 98
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(APIEntityContainer, {
          entity: e,
          activeEntityName: activeEntityName,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 109
          },
          __self: this
        }));
      }))));
    }
  }, {
    key: "renderDescription",
    value: function renderDescription() {
      var entity = this.props.entity;
      if (!entity.comment) return null;
      var _entity$comment = entity.comment,
          text = _entity$comment.text,
          shortText = _entity$comment.shortText;
      var fullText = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["compact"])([shortText, text]).join("<br/>");
      return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: Object(_utils_api__WEBPACK_IMPORTED_MODULE_13__["convertLinks"])(marked__WEBPACK_IMPORTED_MODULE_8___default()(fullText))
        },
        style: {
          padding: "0 10px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 125
        },
        __self: this
      });
    }
  }]);

  return APIEntityContainer;
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);


var APIContainer = styled_components__WEBPACK_IMPORTED_MODULE_9__["default"].div.withConfig({
  displayName: "APIEntityContainer__APIContainer",
  componentId: "eqy01y-0"
})(["h1,h2,h3,h4,h5,h6{margin:1rem 0;}p,ol,ul{margin:1rem 0;}"]);
var Section = styled_components__WEBPACK_IMPORTED_MODULE_9__["default"].section.withConfig({
  displayName: "APIEntityContainer__Section",
  componentId: "eqy01y-1"
})(["margin:10px 0;padding:0 10px;"]);
var EntityHeader = styled_components__WEBPACK_IMPORTED_MODULE_9__["default"].div.withConfig({
  displayName: "APIEntityContainer__EntityHeader",
  componentId: "eqy01y-2"
})([""]);
var MemberListContainer = styled_components__WEBPACK_IMPORTED_MODULE_9__["default"].div.withConfig({
  displayName: "APIEntityContainer__MemberListContainer",
  componentId: "eqy01y-3"
})(["padding-left:5px;border-left:4px solid #ddd;padding-right:0;", "{display:none;}"], EntityHeader);

/***/ })

})
//# sourceMappingURL=api.js.5b455ae6ecec8a0e05c9.hot-update.js.map