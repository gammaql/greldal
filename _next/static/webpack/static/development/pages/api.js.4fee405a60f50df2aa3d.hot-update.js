webpackHotUpdate("static\\development\\pages\\api.js",{

/***/ "./components/APIContainer.js":
/*!************************************!*\
  !*** ./components/APIContainer.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return APIContainer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! qs */ "../../node_modules/qs/lib/index.js");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _PageLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PageLayout */ "./components/PageLayout.js");
/* harmony import */ var _APITree__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./APITree */ "./components/APITree.js");
/* harmony import */ var _APIBody__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./APIBody */ "./components/APIBody.js");
/* harmony import */ var _LibInfoBanner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./LibInfoBanner */ "./components/LibInfoBanner.js");
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Sidebar */ "./components/Sidebar.js");
/* harmony import */ var lodash_memoize__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash/memoize */ "../../node_modules/lodash/memoize.js");
/* harmony import */ var lodash_memoize__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(lodash_memoize__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _api_api_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../api/api.json */ "../../api/api.json");
var _api_api_json__WEBPACK_IMPORTED_MODULE_10___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../api/api.json */ "../../api/api.json", 1);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_11__);
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\components\\APIContainer.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }














var APIContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(APIContainer, _React$Component);

  function APIContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, APIContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(APIContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      hierarchy: Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["getAPIHierarchy"])(_api_api_json__WEBPACK_IMPORTED_MODULE_10__),
      active: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleClick", lodash_memoize__WEBPACK_IMPORTED_MODULE_9___default()(function (name, entity) {
      return function (event) {
        if (!entity) return;
        var rootEntity = entity;

        while (rootEntity.parent) {
          rootEntity = rootEntity.parent;
        }

        var active = {
          apiCategory: Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["getAPICategory"])(rootEntity),
          rootEntityName: Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["getAPIName"])(rootEntity),
          entityName: Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["getAPIName"])(entity)
        };

        _this.setState({
          active: active
        });

        history.pushState(null, "GRelDAL Documentation | ".concat(rootEntity.name, " | ").concat(entity.name), "?".concat(qs__WEBPACK_IMPORTED_MODULE_2___default.a.stringify(active)));
        event.stopPropagation();
        event.preventDefault();
      };
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleToggle", function (node, toggled) {
      node.toggled = toggled;

      _this.setState({
        hierarchy: _this.state.hierarchy
      });
    });

    return _this;
  }

  _createClass(APIContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var search = location.search.slice(1);
      if (!search) return;
      this.setState({
        active: qs__WEBPACK_IMPORTED_MODULE_2___default.a.parse(search)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          active = _this$state.active,
          hierarchy = _this$state.hierarchy;
      var activeCategory;
      var rootEntity;

      if (active && active.apiCategory) {
        activeCategory = this.state.hierarchy.find(function (h) {
          return h.id === active.apiCategory;
        });
      }

      if (activeCategory && active.rootEntityName) {
        rootEntity = Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["findInHierarchy"])(activeCategory, active.rootEntityName.split("."));
        if (rootEntity) rootEntity = rootEntity.entity;
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PageLayout__WEBPACK_IMPORTED_MODULE_4__["PageLayout"], {
        sidebar: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, hierarchy.map(function (h) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_8__["SectionHeader"], {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 45
            },
            __self: this
          }, h.name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_APITree__WEBPACK_IMPORTED_MODULE_5__["default"], {
            hierarchy: h.children,
            handleToggle: _this2.handleToggle,
            handleClick: _this2.handleClick,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 46
            },
            __self: this
          }));
        })),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NotificationBanner, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 56
        },
        __self: this
      }, "API Documentation site is currently work in progress."), activeCategory && activeCategory.banners.map(function (b) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NotificationBanner, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 58
          },
          __self: this
        }, b.children);
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_APIBody__WEBPACK_IMPORTED_MODULE_6__["default"], _extends({
        activeCategory: activeCategory,
        rootEntity: rootEntity,
        activeEntityName: active && active.entityName
      }, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        },
        __self: this
      })));
    }
  }]);

  return APIContainer;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


var Container = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "APIContainer__Container",
  componentId: "doiguk-0"
})(["position:absolute;top:0;left:0;right:0;bottom:0;"]);
var Pane = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "APIContainer__Pane",
  componentId: "doiguk-1"
})(["overflow:auto;height:100%;padding:10px;"]);
var NotificationBanner = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "APIContainer__NotificationBanner",
  componentId: "doiguk-2"
})(["background:lemonchiffon;border:1px solid #ffe7bb;padding:5px;color:orange;border-radius:5px;text-align:center;& + &{margin-top:10px;}"]);

/***/ }),

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
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react_collapsible__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-collapsible */ "../../node_modules/react-collapsible/dist/Collapsible.js");
/* harmony import */ var react_collapsible__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_collapsible__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _TypePresenter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TypePresenter */ "./components/TypePresenter.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Sidebar */ "./components/Sidebar.js");
/* harmony import */ var _ParamsTable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ParamsTable */ "./components/ParamsTable.js");
/* harmony import */ var _styles_collapsible_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../styles/collapsible.css */ "./styles/collapsible.css");
/* harmony import */ var _styles_collapsible_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_collapsible_css__WEBPACK_IMPORTED_MODULE_7__);
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
          lineNumber: 31
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EntityHeader, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 32
        },
        __self: this
      }, entity.kindString && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          float: "right",
          color: "silver"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        },
        __self: this
      }, "(", entity.kindString, ")"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 34
        },
        __self: this
      }, Object(_utils_api__WEBPACK_IMPORTED_MODULE_4__["getAPIName"])(entity))), entity.comment && entity.comment.shortText && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_5__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      }, "Description"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, entity.comment.shortText)), entity.type && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_5__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        },
        __self: this
      }, "Type"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TypePresenter__WEBPACK_IMPORTED_MODULE_3__["TypePresenter"], {
        type: entity.type,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        },
        __self: this
      })), entity.signatures && entity.signatures.map(function (sig) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, sig.comment && sig.comment.shortText && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
          className: "api-section",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 54
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_5__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          },
          __self: this
        }, "Description"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 56
          },
          __self: this
        }, sig.comment.shortText)), sig.parameters && sig.parameters.length > 0 && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 61
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_5__["SectionHeader"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          },
          __self: this
        }, "Parameters"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ParamsTable__WEBPACK_IMPORTED_MODULE_6__["ParamsTable"], {
          params: sig.parameters,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 63
          },
          __self: this
        })));
      }), entity.sources && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 69
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_5__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 70
        },
        __self: this
      }, "Sources"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 71
        },
        __self: this
      }, entity.sources.map(function (src) {
        var fileName = src.fileName.replace(/\.d\.ts$/, ".ts");
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 75
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "https://github.com/gql-dal/greldal/blob/master/src/".concat(fileName),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 76
          },
          __self: this
        }, fileName));
      }))), entity.children && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 86
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_5__["SectionHeader"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        },
        __self: this
      }, "Members"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MemberListContainer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 88
        },
        __self: this
      }, entity.children.map(function (e) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_collapsible__WEBPACK_IMPORTED_MODULE_2___default.a, {
          trigger: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 92
            },
            __self: this
          }, e.kindString && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            style: {
              float: "right",
              color: "silver"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 94
            },
            __self: this
          }, "(", e.kindString, ")"), Object(_utils_api__WEBPACK_IMPORTED_MODULE_4__["getAPIName"])(e)),
          open: activeEntityName && e.name === activeEntityName,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 90
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(APIEntityContainer, {
          entity: e,
          activeEntityName: activeEntityName,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 101
          },
          __self: this
        }));
      }))));
    }
  }]);

  return APIEntityContainer;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


var Section = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].section.withConfig({
  displayName: "APIEntityContainer__Section",
  componentId: "eqy01y-0"
})(["margin:10px 0;"]);
var EntityHeader = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "APIEntityContainer__EntityHeader",
  componentId: "eqy01y-1"
})([""]);
var MemberListContainer = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "APIEntityContainer__MemberListContainer",
  componentId: "eqy01y-2"
})(["padding-left:5px;border-left:4px solid #ddd;padding-right:0;", "{display:none;}"], EntityHeader);

/***/ }),

/***/ "./utils/api.js":
/*!**********************!*\
  !*** ./utils/api.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js"),
    merge = _require.merge,
    forEach = _require.forEach,
    find = _require.find,
    compact = _require.compact,
    map = _require.map,
    flatten = _require.flatten,
    memoize = _require.memoize,
    get = _require.get;

var climber = __webpack_require__(/*! tree-climber */ "../../node_modules/tree-climber/index.js");

function getAPINode(entityInfo) {
  var name = getAPIName(entityInfo);
  var path = name.split(".");
  var root = {};
  var curLevel = root;
  path.forEach(function (fragment, index) {
    curLevel.name = fragment;

    if (index === path.length - 1) {
      curLevel.entity = entityInfo;
      curLevel.children = entityInfo.children && entityInfo.children.map(function (childEntityInfo) {
        var node = getAPINode(childEntityInfo); // node.entity.parent = entityInfo;

        return node;
      });
    } else {
      curLevel.children = [{}];
      curLevel = curLevel.children[0];
    }
  });
  return root;
}

function injectIntoHierarchy(hierarchy, node) {
  var prevChild = find(hierarchy, function (child) {
    return child.name === node.name;
  });

  if (!prevChild) {
    hierarchy.push(node);
    return;
  }

  prevChild.entity = prevChild.entity || node.entity;

  if (node.children) {
    prevChild.children = prevChild.children || [];
    forEach(node.children, function (nextChild) {
      injectIntoHierarchy(prevChild.children, nextChild);
    });
  }
}

function injectIntoEntity(entity, childEntity) {
  entity.children = entity.children || [];
  var prevChild = entity.children.find(function (c) {
    return c.name === childEntity.name;
  });
  if (prevChild) merge(prevChild, childEntity);else entity.children.push(childEntity);
}

function findInHierarchy(root, entityPath) {
  if (!root || !root.children || !entityPath.length) return root;
  var child = root.children.find(function (child) {
    return child.name === entityPath[0];
  });
  return findInHierarchy(child, entityPath.slice(1));
}

var getAllTags = memoize(function (entityInfo) {
  return compact(flatten(map(compact([entityInfo].concat(entityInfo.signatures)), "comment.tags")));
});

function getAPIName(entityInfo) {
  var nameTag = getAllTags(entityInfo).find(function (t) {
    return t.tag === "name";
  });
  if (nameTag) return nameTag.text.trim();
  return entityInfo.name;
}

function getAPICategory(entityInfo) {
  var tags = compact(flatten(map(compact([entityInfo].concat(entityInfo.signatures)), "comment.tags")));
  var categoryTag = tags.find(function (t) {
    return t.tag === "api-category";
  });
  if (!categoryTag) return null;
  var category = categoryTag.text.trim();
  return category;
}

function getAPIHierarchy(apiData) {
  var categories = {
    PrimaryAPI: [],
    ConfigType: [],
    MapperClass: []
  };
  var entities = {};
  apiData.children.forEach(function (moduleInfo) {
    if (!moduleInfo.children) return;
    moduleInfo.children.forEach(function (entityInfo) {
      var category = getAPICategory(entityInfo);
      if (!category || !categories[category]) return;
      var node = getAPINode(entityInfo);
      injectIntoHierarchy(categories[category], node);
      entities[getAPIName(entityInfo)] = node;
    });
  });
  climber.climb(apiData, function (key, value, path) {
    if (key === "tag" && value === "memberof") {
      var tag = get(apiData, path.split(".").slice(0, -1));
      var curEntity = get(apiData, path.split(".").slice(0, -4));
      var parentNode = entities[tag.text.trim()];
      if (!parentNode) return;
      parentNode.children = parentNode.children || [];
      injectIntoHierarchy(parentNode.children, {
        entity: curEntity,
        name: getAPIName(curEntity)
      });
      injectIntoEntity(parentNode.entity, curEntity);
    }
  });
  return [{
    name: "Primary API",
    toggled: true,
    id: "PrimaryAPI",
    children: categories.PrimaryAPI,
    banners: []
  }, {
    name: "Configuration Types",
    toggled: true,
    id: "ConfigType",
    children: categories.ConfigType,
    banners: [{
      children: "This page describes the type of a configuration type. Some of the functions exposed in the primary APIs would accept arguments of this type."
    }]
  }, {
    name: "Mapper Classes",
    toggled: true,
    id: "MapperClass",
    children: categories.MapperClass,
    banners: [{
      children: "This page describes a Mapper class which is instantiated by one of the functions exposed in primary APIs. You would usually not want to create instances of this class yourself."
    }]
  }];
}

module.exports = {
  getAPINode: getAPINode,
  injectIntoHierarchy: injectIntoHierarchy,
  findInHierarchy: findInHierarchy,
  getAllTags: getAllTags,
  getAPIName: getAPIName,
  getAPICategory: getAPICategory,
  getAPIHierarchy: getAPIHierarchy
};

/***/ })

})
//# sourceMappingURL=api.js.4fee405a60f50df2aa3d.hot-update.js.map