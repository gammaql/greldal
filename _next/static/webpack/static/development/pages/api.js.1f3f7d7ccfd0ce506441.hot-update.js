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
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/get-iterator */ "../../node_modules/@babel/runtime-corejs2/core-js/get-iterator.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/classCallCheck */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/createClass */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/possibleConstructorReturn */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/getPrototypeOf */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/inherits */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/assertThisInitialized */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/defineProperty */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! qs */ "../../node_modules/qs/lib/index.js");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _PageLayout__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PageLayout */ "./components/PageLayout.js");
/* harmony import */ var _APITree__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./APITree */ "./components/APITree.js");
/* harmony import */ var _APIBody__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./APIBody */ "./components/APIBody.js");
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Sidebar */ "./components/Sidebar.js");
/* harmony import */ var lodash_memoize__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lodash/memoize */ "../../node_modules/lodash/memoize.js");
/* harmony import */ var lodash_memoize__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(lodash_memoize__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _api_api_hierarchy_json__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../api/api-hierarchy.json */ "../../api/api-hierarchy.json");
var _api_api_hierarchy_json__WEBPACK_IMPORTED_MODULE_17___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../api/api-hierarchy.json */ "../../api/api-hierarchy.json", 1);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../utils/api */ "./utils/api.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_utils_api__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _HierarchyContext__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./HierarchyContext */ "./components/HierarchyContext.js");









var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal\\src\\docs\\components\\APIContainer.js";












var APIContainer =
/*#__PURE__*/
function (_React$Component) {
  Object(_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__["default"])(APIContainer, _React$Component);

  function APIContainer() {
    var _getPrototypeOf2;

    var _this;

    Object(_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, APIContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = Object(_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, (_getPrototypeOf2 = Object(_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(APIContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(_this)), "state", {
      hierarchy: _api_api_hierarchy_json__WEBPACK_IMPORTED_MODULE_17__,
      active: null
    });

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(_this)), "syncFromLocation", function () {
      var search = location.search.slice(1);
      if (!search) return;

      _this.setState({
        active: qs__WEBPACK_IMPORTED_MODULE_11___default.a.parse(search)
      });
    });

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(_this)), "handleClick", lodash_memoize__WEBPACK_IMPORTED_MODULE_16___default()(function (name, entity) {
      return function (event) {
        if (!entity) return;
        var rootEntity = entity;

        while (rootEntity.parent) {
          rootEntity = rootEntity.parent;
        }

        var active = {
          apiCategory: Object(_utils_api__WEBPACK_IMPORTED_MODULE_18__["getAPICategory"])(rootEntity),
          rootEntityName: Object(_utils_api__WEBPACK_IMPORTED_MODULE_18__["getAPIName"])(rootEntity),
          entityName: Object(_utils_api__WEBPACK_IMPORTED_MODULE_18__["getAPIName"])(entity)
        };

        _this.setState({
          active: active
        });

        history.pushState(null, "GRelDAL Documentation | ".concat(rootEntity.name, " | ").concat(entity.name), "?".concat(qs__WEBPACK_IMPORTED_MODULE_11___default.a.stringify(active)));
        event.stopPropagation();
        event.preventDefault();
      };
    }));

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__["default"])(_this)), "handleToggle", function (node, toggled) {
      node.toggled = toggled;

      _this.setState({
        hierarchy: _this.state.hierarchy
      });
    });

    return _this;
  }

  Object(_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(APIContainer, [{
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

      if (active && active.rootEntityName) {
        var entityPath = active.rootEntityName.split(".");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _babel_runtime_corejs2_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_1___default()(this.state.hierarchy), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var category = _step.value;
            var node = Object(_utils_api__WEBPACK_IMPORTED_MODULE_18__["findInHierarchy"])(category, entityPath);

            if (node) {
              activeCategory = category;
              rootEntity = node.entity;
              break;
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

      return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_PageLayout__WEBPACK_IMPORTED_MODULE_12__["PageLayout"], {
        sidebar: react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_9___default.a.Fragment, null, hierarchy.map(function (h) {
          return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_9___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_Sidebar__WEBPACK_IMPORTED_MODULE_15__["SectionHeader"], {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 59
            },
            __self: this
          }, h.name), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_APITree__WEBPACK_IMPORTED_MODULE_13__["default"], {
            hierarchy: h.children,
            handleToggle: _this2.handleToggle,
            handleClick: _this2.handleClick,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 60
            },
            __self: this
          }));
        })),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 54
        },
        __self: this
      }, activeCategory && activeCategory.banners.map(function (b) {
        return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(NotificationBanner, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 71
          },
          __self: this
        }, b.children);
      }), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_HierarchyContext__WEBPACK_IMPORTED_MODULE_19__["HierarchyContext"].Provider, {
        value: this.state.hierarchy,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_APIBody__WEBPACK_IMPORTED_MODULE_14__["default"], Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
        activeCategory: activeCategory,
        rootEntity: rootEntity,
        activeEntityName: active && active.entityName
      }, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 73
        },
        __self: this
      }))));
    }
  }]);

  return APIContainer;
}(react__WEBPACK_IMPORTED_MODULE_9___default.a.Component);


var NotificationBanner = styled_components__WEBPACK_IMPORTED_MODULE_10__["default"].div.withConfig({
  displayName: "APIContainer__NotificationBanner",
  componentId: "doiguk-0"
})(["background:lemonchiffon;border:1px solid #ffe7bb;padding:5px;color:orange;border-radius:5px;text-align:left;& + &{margin-top:10px;}"]);

/***/ })

})
//# sourceMappingURL=api.js.1f3f7d7ccfd0ce506441.hot-update.js.map