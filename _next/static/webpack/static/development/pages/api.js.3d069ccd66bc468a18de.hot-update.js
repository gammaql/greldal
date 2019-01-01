webpackHotUpdate("static\\development\\pages\\api.js",{

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

function findAnywhereInHierarchy(root, entityName) {
  debugger;
  if (!root || !root.children) return null;
  if (root.name === entityName) return root;
  var child = root.children.find(function (c) {
    return findAnywhereInHierarchy(c, entityName);
  });
  if (child) return child;
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
  findAnywhereInHierarchy: findAnywhereInHierarchy,
  getAllTags: getAllTags,
  getAPIName: getAPIName,
  getAPICategory: getAPICategory,
  getAPIHierarchy: getAPIHierarchy
};

/***/ })

})
//# sourceMappingURL=api.js.3d069ccd66bc468a18de.hot-update.js.map