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
/* harmony import */ var _api_api_hierarchy_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../api/api-hierarchy.json */ "../../api/api-hierarchy.json");
var _api_api_hierarchy_json__WEBPACK_IMPORTED_MODULE_10___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../api/api-hierarchy.json */ "../../api/api-hierarchy.json", 1);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _HierarchyContext__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./HierarchyContext */ "./components/HierarchyContext.js");
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
      hierarchy: _api_api_hierarchy_json__WEBPACK_IMPORTED_MODULE_10__,
      active: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "syncFromLocation", function () {
      var search = location.search.slice(1);
      if (!search) return;

      _this.setState({
        active: qs__WEBPACK_IMPORTED_MODULE_2___default.a.parse(search)
      });
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
      this.syncFromLocation();
      window.addEventListener("popstate", this.syncFromLocation);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("popstate", this.syncFromLocation);
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

      var rootEntityName = active.rootEntityName || active.entityName;
      var namePath = active.rootEntityName.split(".");

      if (activeCategory && rootEntityName) {
        rootEntity = Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["findInHierarchy"])(activeCategory, namePath);
        if (rootEntity) rootEntity = rootEntity.entity;
      } else if (rootEntityName) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.state.hierarchy[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var category = _step.value;

            if (!rootEntity) {
              rootEntity = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["get"])(Object(_utils_api__WEBPACK_IMPORTED_MODULE_11__["findInHierarchy"])(category, namePath), "entity");
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PageLayout__WEBPACK_IMPORTED_MODULE_4__["PageLayout"], {
        sidebar: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, hierarchy.map(function (h) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_8__["SectionHeader"], {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 65
            },
            __self: this
          }, h.name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_APITree__WEBPACK_IMPORTED_MODULE_5__["default"], {
            hierarchy: h.children,
            handleToggle: _this2.handleToggle,
            handleClick: _this2.handleClick,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 66
            },
            __self: this
          }));
        })),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 60
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NotificationBanner, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        },
        __self: this
      }, "API Documentation site is currently work in progress."), activeCategory && activeCategory.banners.map(function (b) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NotificationBanner, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 78
          },
          __self: this
        }, b.children);
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_HierarchyContext__WEBPACK_IMPORTED_MODULE_12__["HierarchyContext"].Provider, {
        value: this.state.hierarchy,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 79
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_APIBody__WEBPACK_IMPORTED_MODULE_6__["default"], _extends({
        activeCategory: activeCategory,
        rootEntity: rootEntity,
        activeEntityName: active && active.entityName
      }, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 80
        },
        __self: this
      }))));
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

/***/ })

})
//# sourceMappingURL=api.js.f807d1b033be4c78c47f.hot-update.js.map