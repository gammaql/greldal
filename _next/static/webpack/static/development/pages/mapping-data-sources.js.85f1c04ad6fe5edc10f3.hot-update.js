webpackHotUpdate("static\\development\\pages\\mapping-data-sources.js",{

/***/ "./pages/mapping-data-sources.md":
/*!***************************************!*\
  !*** ./pages/mapping-data-sources.md ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mdx-js/tag */ "../../node_modules/@mdx-js/tag/dist/index.js");
/* harmony import */ var _mdx_js_tag__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Link */ "./components/Link.js");
/* harmony import */ var _components_CodeSnippet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/CodeSnippet */ "./components/CodeSnippet.js");

var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\pages\\mapping-data-sources.md";




/* harmony default export */ __webpack_exports__["default"] = (function (_ref) {
  var components = _ref.components,
      props = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, ["components"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "h1",
    components: components,
    props: {
      "id": "mapping-data-sources"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h1",
    props: {
      "href": "#mapping-data-sources",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  })), "Mapping Data Sources"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, "Creation of a GraphQL API using GRelDAL essentially involves defining operations on data sources."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, "Operations are what we expose to the outside world through GraphQL queries and mutations and these operations interact with the data stored in our databases through data sources. These data sources are usually backed by tables, but they can also be backed by views, materialized views, joined tables, etc."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, "We can use the mapSource function to map a datasource:"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_CodeSnippet__WEBPACK_IMPORTED_MODULE_4__["CodeSnippet"], {
    name: "mapDataSource_user_simple",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "As we have already covered in the ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_3__["Link"], {
    href: "#quick-start",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "Quick Start"), " the above configuration tells GRelDAL that we want to map the ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "users"), " table (pluralized from ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "User"), ") to a ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "User"), " data source, and this data source will have two fields: id, name."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, "GRelDAL's focus on convention over configuration reduces quite a bit of boilerplate from what would otherwise have been a more verbose mapping:"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_CodeSnippet__WEBPACK_IMPORTED_MODULE_4__["CodeSnippet"], {
    name: "mapDataSource_user_simple_explicit",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "h2",
    components: components,
    props: {
      "id": "type-specifications"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h2",
    props: {
      "href": "#type-specifications",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  })), "Type specifications"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "Note that for every field we had to specify a type. This type was specified through what we call runtime-types. The section on ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_3__["Link"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "Type Safety"), "\ngoes into more on detail on this, but essentially for all primitives we have corresponding runtime types:"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, "| string  | types.string  |\n| number  | types.number  |\n| boolean | types.boolean |"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, "Some GraphQL types have no equivalent typescript type (eg. GraphQLInt, GraphQLID) and for them we can specifically mention the input and output types.\nIn case both are same (", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, "{to: {input: GraphQLID, output: GraphQLID}}"), ") can can just specify them once (", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, "{to: GraphQLID}"), ")."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, "We can compose these types to build composite types:"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "metaString": null
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "const addresses = types.array([\n    types.type({\n        street: types.string,\n        plot_no: types.number\n    })\n])\n")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, "Refer to the documentation of io-ts (which we simply re-export as types) for more details around using and defining runtime types."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "h2",
    components: components,
    props: {
      "id": "computed-fields"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h2",
    props: {
      "href": "#computed-fields",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  })), "Computed fields"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, "Fields don't necessarily have to map to columns one-to-one."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, "We can have computed fields which depend on other column-based fields and are computed on the fly:"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "metaString": null
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, "fields: {\n    fullName: {\n        dependencies: [\"firstName\", \"lastName\"],\n        derive: ({firstName, lastName}) => `${firstName} ${lastName}`,\n        to: types.string\n    }\n}\n")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "h2",
    components: components,
    props: {
      "id": "associations"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h2",
    props: {
      "href": "#associations",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  })), "Associations"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, "GRelDAL supports linking together data sources through associations and performing operations that span across multiple data sources."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_2__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, "The section on ", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_3__["Link"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, "association mapping"), " will cover this in more detail."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_3__["NextPageLink"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }, "Mapping Operations"));
});

/***/ })

})
//# sourceMappingURL=mapping-data-sources.js.85f1c04ad6fe5edc10f3.hot-update.js.map