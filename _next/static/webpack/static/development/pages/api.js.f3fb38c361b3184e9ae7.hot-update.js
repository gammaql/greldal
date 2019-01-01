webpackHotUpdate("static\\development\\pages\\api.js",{

/***/ "./components/APIEntityContainer.js":
/*!******************************************!*\
  !*** ./components/APIEntityContainer.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return APIEntityContainer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! marked */ "../../node_modules/marked/lib/marked.js");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(marked__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react_collapsible__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-collapsible */ "../../node_modules/react-collapsible/dist/Collapsible.js");
/* harmony import */ var react_collapsible__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_collapsible__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _TypePresenter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TypePresenter */ "./components/TypePresenter.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Sidebar */ "./components/Sidebar.js");
/* harmony import */ var _ParamsTable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ParamsTable */ "./components/ParamsTable.js");
/* harmony import */ var _styles_collapsible_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../styles/collapsible.css */ "./styles/collapsible.css");
/* harmony import */ var _styles_collapsible_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_styles_collapsible_css__WEBPACK_IMPORTED_MODULE_9__);
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\components\\APIEntityContainer.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











marked__WEBPACK_IMPORTED_MODULE_1___default.a.setOptions({
  gfm: true,
  tables: true
});

var APIEntityContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(APIEntityContainer, _React$Component);

  function APIEntityContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, APIEntityContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(APIEntityContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "containerRef", react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef());

    return _this;
  }

  _createClass(APIEntityContainer, [{
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        ref: this.containerRef,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EntityHeader, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      }, entity.kindString && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          float: "right",
          color: "silver"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, "(", entity.kindString, ")"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, Object(_utils_api__WEBPACK_IMPORTED_MODULE_6__["getAPIName"])(entity))), entity.comment && this.renderDescription(), entity.type && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_7__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        },
        __self: this
      }, "Type"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TypePresenter__WEBPACK_IMPORTED_MODULE_5__["TypePresenter"], {
        type: entity.type,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        },
        __self: this
      })), entity.signatures && entity.signatures.map(function (sig) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, sig.comment && sig.comment.shortText && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
          className: "api-section",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_7__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 56
          },
          __self: this
        }, "Description"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 57
          },
          __self: this
        }, sig.comment.shortText)), sig.parameters && sig.parameters.length > 0 && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_7__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 63
          },
          __self: this
        }, "Parameters"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ParamsTable__WEBPACK_IMPORTED_MODULE_8__["ParamsTable"], {
          params: sig.parameters,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          },
          __self: this
        })), sig.type && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 68
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_7__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 69
          },
          __self: this
        }, "Returns"), Object(lodash__WEBPACK_IMPORTED_MODULE_4__["get"])(Object(lodash__WEBPACK_IMPORTED_MODULE_4__["find"])(entity.tags, {
          tag: "returns"
        }), "text"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TypePresenter__WEBPACK_IMPORTED_MODULE_5__["TypePresenter"], {
          type: sig.type,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 71
          },
          __self: this
        })));
      }), entity.sources && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_7__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        },
        __self: this
      }, "Sources"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 79
        },
        __self: this
      }, Object(lodash__WEBPACK_IMPORTED_MODULE_4__["uniqBy"])(entity.sources, function (s) {
        return s.fileName;
      }).map(function (src) {
        var fileName = src.fileName.replace(/\.d\.ts$/, ".ts");
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 83
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "https://github.com/gql-dal/greldal/blob/master/src/".concat(fileName),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 84
          },
          __self: this
        }, fileName));
      }))), entity.children && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 94
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_7__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 95
        },
        __self: this
      }, "Members"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MemberListContainer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 96
        },
        __self: this
      }, entity.children.map(function (e) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_collapsible__WEBPACK_IMPORTED_MODULE_3___default.a, {
          trigger: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 100
            },
            __self: this
          }, e.kindString && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            style: {
              float: "right",
              color: "silver"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 102
            },
            __self: this
          }, "(", e.kindString, ")"), Object(_utils_api__WEBPACK_IMPORTED_MODULE_6__["getAPIName"])(e)),
          open: activeEntityName && e.name === activeEntityName,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 98
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(APIEntityContainer, {
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
      var fullText = Object(lodash__WEBPACK_IMPORTED_MODULE_4__["compact"])([text, shortText]).join("\n");
      if (text) return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: marked__WEBPACK_IMPORTED_MODULE_1___default()(text)
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 124
        },
        __self: this
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 125
        },
        __self: this
      }, shortText);
    }
  }]);

  return APIEntityContainer;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


var Section = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].section.withConfig({
  displayName: "APIEntityContainer__Section",
  componentId: "eqy01y-0"
})(["margin:10px 0;"]);
var EntityHeader = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div.withConfig({
  displayName: "APIEntityContainer__EntityHeader",
  componentId: "eqy01y-1"
})([""]);
var MemberListContainer = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div.withConfig({
  displayName: "APIEntityContainer__MemberListContainer",
  componentId: "eqy01y-2"
})(["padding-left:5px;border-left:4px solid #ddd;padding-right:0;", "{display:none;}"], EntityHeader);

/***/ })

})
//# sourceMappingURL=api.js.f3fb38c361b3184e9ae7.hot-update.js.map