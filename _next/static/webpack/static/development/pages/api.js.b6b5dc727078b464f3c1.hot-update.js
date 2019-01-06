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

/***/ }),

/***/ "./utils/api.js":
/*!**********************!*\
  !*** ./utils/api.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var qs = __webpack_require__(/*! qs */ "../../node_modules/qs/lib/index.js");

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

function findAnywhereInHierarchy(root, entityName) {
  if (!root) return null;
  return root.find(function (c) {
    if (c.name === entityName) return c;
    return findAnywhereInHierarchy(c.children, entityName);
  });
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
    MapperClass: [],
    CRUDResolvers: []
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
      console.log("Associating orphaned member:", tag);
      var curEntity = get(apiData, path.split(".").slice(0, -4));
      var parentNode = entities[tag.text.trim()];

      if (!parentNode) {
        console.log("Unable to find parentNode:", tag);
        return;
      }

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
    children: categories.PrimaryAPI || [],
    banners: []
  }, {
    name: "CRUD Resolvers",
    toggled: true,
    id: "CRUDResolvers",
    children: categories.CRUDResolvers || [],
    banners: []
  }, {
    name: "Configuration Types",
    toggled: true,
    id: "ConfigType",
    children: categories.ConfigType || [],
    banners: [{
      children: "This page describes the type of a configuration type. Some of the functions exposed in the primary APIs would accept arguments of this type."
    }]
  }, {
    name: "Mapper Classes",
    toggled: true,
    id: "MapperClass",
    children: categories.MapperClass || [],
    banners: [{
      children: "This page describes a Mapper class which is instantiated by one of the functions exposed in primary APIs. You would usually not want to create instances of this class yourself."
    }]
  }, {
    name: "Utils",
    toggled: false,
    id: "Utils",
    children: categories.Utils || []
  }];
}

function convertLinks(html) {
  var apiLinks = html.match(/href="api:.*"/g);

  if (apiLinks) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = apiLinks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var link = _step.value;
        var m = link.match(/href="api:(.*)"/);

        var _m$1$split = m[1].split(":"),
            _m$1$split2 = _slicedToArray(_m$1$split, 2),
            rootEntityName = _m$1$split2[0],
            entityName = _m$1$split2[1];

        if (!entityName) entityName = rootEntityName;
        html = html.replace(m[0], "href=\"".concat("", "/api?").concat(qs.stringify({
          entityName: entityName,
          rootEntityName: rootEntityName
        }), "\""));
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

  var relLinks = html.match(/href="\/.*"/g);

  if (relLinks) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = relLinks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _link = _step2.value;

        var _m = _link.match(/href="\/(.*)"/);

        html = html.replace(_m[0], "href=\"".concat("", "/").concat(_m[1], "\""));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  return html;
}

module.exports = {
  getAPINode: getAPINode,
  injectIntoHierarchy: injectIntoHierarchy,
  findInHierarchy: findInHierarchy,
  findAnywhereInHierarchy: findAnywhereInHierarchy,
  getAllTags: getAllTags,
  getAPIName: getAPIName,
  getAPICategory: getAPICategory,
  getAPIHierarchy: getAPIHierarchy,
  convertLinks: convertLinks
};

/***/ })

})
//# sourceMappingURL=api.js.b6b5dc727078b464f3c1.hot-update.js.map