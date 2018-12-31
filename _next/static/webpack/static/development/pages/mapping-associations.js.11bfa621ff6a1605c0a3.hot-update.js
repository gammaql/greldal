webpackHotUpdate("static\\development\\pages\\mapping-associations.js",{

/***/ "./pages/mapping-associations.md":
/*!***************************************!*\
  !*** ./pages/mapping-associations.md ***!
  \***************************************/
/*! exports provided: default, tableOfContents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tableOfContents", function() { return tableOfContents; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mdx-js/tag */ "../../node_modules/@mdx-js/tag/dist/index.js");
/* harmony import */ var _mdx_js_tag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ "../../node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal-2\\src\\docs\\pages\\mapping-associations.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




/* harmony default export */ __webpack_exports__["default"] = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "h1",
    components: components,
    props: {
      "id": "mapping-queries-over-associations"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h1",
    props: {
      "href": "#mapping-queries-over-associations",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  })), "Mapping Queries over Associations"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "While data sources derived from a single tables are useful in themselves, in larger applications, you'd likely have data stored across multiple tables. After all, the ability to join tables and enforce constraints on connected tables is what makes relational databases so powerful."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, "GRelDAL makes it easy for you to take advantage of advanced features of relational databases, by providing APIs to link data sources through different loading strategies."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "h3",
    components: components,
    props: {
      "id": "associations-fetched-through-join-queries"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h3",
    props: {
      "href": "#associations-fetched-through-join-queries",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  })), "Associations fetched through join queries"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, "We can configure an association between multiple data sources to use a join."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "hljs language-ts",
      "metaString": ""
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, "const"), " products = mapDataSource({\n    name: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "\"Product\""), ",\n    fields,\n    associations: {\n        department: {\n            target: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-function"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-params"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "()"), " =>"), " departments,\n            singular: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-literal"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, "true"), ",\n            fetchThrough: [\n                {\n                    join: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, "\"leftOuterJoin\""), ",\n                },\n            ],\n            associatorColumns: {\n                inSource: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "\"department_id\""), ",\n                inRelated: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, "\"id\""), ",\n            },\n        },\n    },\n});")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, "So now, for a query like the following:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "metaString": null
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, "findManyProducts(where: {release_month: \"december\"}) {\n    id,\n    name,\n    department {\n        id,\n        name\n    }\n}\n")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "GRelDAL will join the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "products"), " and ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "departments"), " table on the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "department_id"), " and ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "id"), " columns."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, "You are not limited in how many tables you can join and how the joins should be performed. Even in case of multiple joins or recursive joins, GRelDAL can take care of reverse mapping the fetched data sets into the hierarchical format your client expects."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "hljs language-ts",
      "metaString": ""
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, "const"), " tags = mapDataSource({\n    name: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, "\"Tag\""), ",\n    fields,\n    associations: {\n        products: {\n            target: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-function"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-params"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, "()"), " =>"), " products,\n            singular: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-literal"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, "false"), ",\n            fetchThrough: [\n                {\n                    ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, "// Instead of the above configuration based join, we are now tapping into the underlying data access"), "\n                    ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, "// library - Knex, to perform a join over multiple tables."), "\n                    join: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-function"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, "(", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-params"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, "queryBuilder, aliasTreeVisitor"), ") =>"), " {\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }, "// GRelDAL relies on aliases to alleviate conflicts and to properly map the"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "// fetched data set (tabular) to the format the client expects (hierarchical)."), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, "//"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, "// So we need to use the aliases exposed through aliasTreeVisitor when querying the data source"), "\n\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  }, "// Lets derive visitors for the tables we intend to join"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  }, "const"), " ptaVisitor = aliasTreeVisitor.visit(", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  }, "\"product_tag_associators\""), ");\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, "const"), " productsVisitor = ptaVisitor.visit(", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, "\"products\""), ");\n\n                        queryBuilder\n                            .leftOuterJoin(\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, "// Now we can obtain registered aliases from these visitors and use them in our queries"), "\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }, "`product_tag_associators as ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-subst"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }, "${ptaVisitor.alias}"), "`"), ",\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, "`", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-subst"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, "${ptaVisitor.alias}"), ".tag_id`"), ",\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, "`", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-subst"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, "${aliasTreeVisitor.alias}"), ".id`"), ",\n                            )\n                            .leftOuterJoin(\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, "`products as ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-subst"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, "${productsVisitor.alias}"), "`"), ",\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    },
    __self: this
  }, "`", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-subst"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    },
    __self: this
  }, "${productsVisitor.alias}"), ".id`"), ",\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, "`", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-subst"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, "${ptaVisitor.alias}"), ".product_id`"), ",\n                            );\n\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: this
  }, "// Once we have constructed the query, we are done. We don't have to write any mapping logic"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: this
  }, "// for converting the obtained results into the hierarchy of fields."), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    },
    __self: this
  }, "return"), " productsVisitor;\n                    },\n                },\n            ],\n        },\n    },\n});")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "h3",
    components: components,
    props: {
      "id": "associations-fetched-through-batch-queries"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "h3",
    props: {
      "href": "#associations-fetched-through-batch-queries",
      "aria-hidden": "true"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "a",
    props: {
      "className": "icon icon-link"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  })), "Associations fetched through batch queries:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 87
    },
    __self: this
  }, "An alternative to joins is to side-load the operations on related data sources."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }, "Note that in the below scenario, when we are fetching a department and related products, we are always making only two queries - irrespective of the number of departments or the number of products we have or how many of them end up in our result set. Both of these queries are batched, and once again we can fall back on GRelDAL do our reverse mapping for us."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "hljs language-js",
      "metaString": ""
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }, "const"), " departments = mapDataSource({\n    ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: this
  }, "name"), ": ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: this
  }, "\"Department\""), ",\n    fields,\n    ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: this
  }, "associations"), ": {\n        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    },
    __self: this
  }, "products"), ": {\n            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }, "target"), ": ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-function"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "span",
    props: {
      "className": "hljs-params"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }, "()"), " =>"), " products,\n            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    },
    __self: this
  }, "singular"), ": ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-literal"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    },
    __self: this
  }, "false"), ",\n            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: this
  }, "associatorColumns"), ": {\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 97
    },
    __self: this
  }, "inSource"), ": ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 97
    },
    __self: this
  }, "\"id\""), ",\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 98
    },
    __self: this
  }, "inRelated"), ": ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 98
    },
    __self: this
  }, "\"department_id\""), ",\n            },\n            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }, "fetchThrough"), ": [\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 101
    },
    __self: this
  }, "// We can define multiple side-loading strategies here."), "\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 102
    },
    __self: this
  }, "//"), "\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 103
    },
    __self: this
  }, "// When user queried by id of department, then we don't have to wait for the query on departments to complete"), "\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    },
    __self: this
  }, "// before we start fetching products. In case of preFetch strategy, these queries can happen in parallel, because"), "\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 105
    },
    __self: this
  }, "// given the parameters used to query the data source we can start a parallel query to fetch all the products in"), "\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }, "// matching departments"), "\n                {\n                    useIf(operation) {\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109
    },
    __self: this
  }, "return"), " has(operation.args, [", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109
    },
    __self: this
  }, "\"where\""), ", ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109
    },
    __self: this
  }, "\"id\""), "]);\n                    },\n                    preFetch(operation) {\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 112
    },
    __self: this
  }, "// What preFetch returns is a MappedForeignQuery - which basically points to another operation"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 113
    },
    __self: this
  }, "// in the related data source (findManyProducts) and the arguments needed to initiate this operation."), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 114
    },
    __self: this
  }, "//"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115
    },
    __self: this
  }, "// Being able to compose operations defined on multiple data sources is one of the most compelling features"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 116
    },
    __self: this
  }, "// of GRelDAL."), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 117
    },
    __self: this
  }, "const"), " department_id: string = operation.args.where.id;\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: this
  }, "return"), " {\n                            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 119
    },
    __self: this
  }, "query"), ": findManyProducts,\n                            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 120
    },
    __self: this
  }, "args"), ": {\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 121
    },
    __self: this
  }, "where"), ": {\n                                    department_id,\n                                },\n                            },\n                        };\n                    },\n                },\n\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 129
    },
    __self: this
  }, "// However if the query parameters to departments are not enough to identify which products we need to fetch,"), "\n                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 130
    },
    __self: this
  }, "// we can wait for the departments"), "\n                {\n                    postFetch(operation, parents) {\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 133
    },
    __self: this
  }, "// As above, we are instructing GRelDAL to initiate another operation in a foreign data source."), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 134
    },
    __self: this
  }, "// However, in this case this body will execute once the query on parents has finished. So we have an array of"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 135
    },
    __self: this
  }, "// fetched parents at our disposal which we can use to identify additional arguments to narrow down the"), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-comment"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 136
    },
    __self: this
  }, "// subset of products to fetch."), "\n                        ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-keyword"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 137
    },
    __self: this
  }, "return"), " {\n                            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 138
    },
    __self: this
  }, "query"), ": findManyProductsByDepartmentIdList,\n                            ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139
    },
    __self: this
  }, "args"), ": {\n                                ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-attr"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 140
    },
    __self: this
  }, "department_ids"), ": map(parents, ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
    name: "span",
    components: components,
    parentName: "code",
    props: {
      "className": "hljs-string"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 140
    },
    __self: this
  }, "\"id\""), "),\n                            },\n                        };\n                    },\n                },\n            ],\n        },\n    },\n});")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_2___default.a, {
    href: "".concat("", "/best-practices"),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 149
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 149
    },
    __self: this
  }, "Next: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 149
    },
    __self: this
  }, "(Best Practices)"), " \u2192")));
});
var tableOfContents = function tableOfContents() {
  var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return [{
    id: "mapping-queries-over-associations",
    level: 1,
    title: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 154
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "a",
      components: components,
      props: {
        "href": "#mapping-queries-over-associations",
        "aria-hidden": "true"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 154
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "span",
      components: components,
      parentName: "a",
      props: {
        "className": "icon icon-link"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 154
      },
      __self: this
    })), "Mapping Queries over Associations"),
    children: []
  }, {
    id: "associations-fetched-through-join-queries",
    level: 3,
    title: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 162
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "a",
      components: components,
      props: {
        "href": "#associations-fetched-through-join-queries",
        "aria-hidden": "true"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 162
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "span",
      components: components,
      parentName: "a",
      props: {
        "className": "icon icon-link"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 162
      },
      __self: this
    })), "Associations fetched through join queries"),
    children: []
  }, {
    id: "associations-fetched-through-batch-queries",
    level: 3,
    title: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 170
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "a",
      components: components,
      props: {
        "href": "#associations-fetched-through-batch-queries",
        "aria-hidden": "true"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 170
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mdx_js_tag__WEBPACK_IMPORTED_MODULE_1__["MDXTag"], {
      name: "span",
      components: components,
      parentName: "a",
      props: {
        "className": "icon icon-link"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 170
      },
      __self: this
    })), "Associations fetched through batch queries:"),
    children: []
  }];
};
    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/mapping-associations")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "../../node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=mapping-associations.js.11bfa621ff6a1605c0a3.hot-update.js.map