webpackHotUpdate("static\\development\\pages\\mapping-data-sources.js",{

/***/ "./utils/api.js":
/*!**********************!*\
  !*** ./utils/api.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

var _getIterator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/core-js/get-iterator */ "../../node_modules/@babel/runtime-corejs2/core-js/get-iterator.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js"));

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

function getAPIHref(ref) {
  var _ref$split = ref.split(":"),
      _ref$split2 = (0, _slicedToArray2.default)(_ref$split, 2),
      rootEntityName = _ref$split2[0],
      entityName = _ref$split2[1];

  if (!entityName) entityName = rootEntityName;
  return "".concat("", "/api?").concat(qs.stringify({
    entityName: entityName,
    rootEntityName: rootEntityName
  }));
}

function getGuideHref(ref) {
  return "".concat("", "/").concat(ref);
}

function getTermHref(ref) {
  return "".concat("", "/api?term=").concat(ref);
}

var SPECIAL_HREF_PATTERN = /href="(api|guide|term):.*"/g;
var API_HREF_PATTERN = /href="api:(.*)"/;
var GUIDE_HREF_PATTERN = /href="guide:(.*)"/;
var TERM_HREF_PATTERN = /href="term:(.*)"/;

function convertLinks(html) {
  var specialLinks = html.match(SPECIAL_HREF_PATTERN);

  if (specialLinks) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2.default)(specialLinks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var link = _step.value;
        var apiLinkMatch = link.match(API_HREF_PATTERN);

        if (apiLinkMatch) {
          html = html.replace(apiLinkMatch[0], "href=\"".concat(getAPIHref(apiLinkMatch[1]), "\""));
          continue;
        }

        var guideLinkMatch = link.match(GUIDE_HREF_PATTERN);

        if (guideLinkMatch) {
          var slug = guideLinkMatch[1];
          html = html.replace(guideLinkMatch[0], "href=\"".concat(getGuideHref(slug), "\""));
          continue;
        }

        var termLinkMatch = link.match(TERM_HREF_PATTERN);

        if (termLinkMatch) {
          var term = termLinkMatch[1];
          html = html.replace(termLinkMatch[0], "href=\"".concat(getTermHref(term), "\""));
          continue;
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

  var relLinks = html.match(/href="\/.*"/g);

  if (relLinks) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator2.default)(relLinks), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _link = _step2.value;

        var m = _link.match(/href="\/(.*)"/);

        html = html.replace(m[0], "href=\"".concat("", "/").concat(m[1], "\""));
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
//# sourceMappingURL=mapping-data-sources.js.406e4bdbf7eaf9da94e1.hot-update.js.map