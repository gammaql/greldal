webpackHotUpdate("static\\development\\pages\\playground.js",{

/***/ "./pages/playground.js":
/*!*****************************!*\
  !*** ./pages/playground.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/json/stringify */ "../../node_modules/@babel/runtime-corejs2/core-js/json/stringify.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "../../node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/object/get-prototype-of */ "../../node_modules/@babel/runtime-corejs2/core-js/object/get-prototype-of.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/extends */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectWithoutProperties */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/promise */ "../../node_modules/@babel/runtime-corejs2/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! knex */ "../../node_modules/knex/knex.js");
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(knex__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _utils_SQLJSClient__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/SQLJSClient */ "./utils/SQLJSClient.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! graphql */ "../../node_modules/graphql/index.mjs");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-loadable */ "../../node_modules/react-loadable/lib/index.js");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var react_split_pane__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-split-pane */ "../../node_modules/react-split-pane/dist/index.esm.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _assets_logo_png__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../assets/logo.png */ "./assets/logo.png");
/* harmony import */ var _assets_logo_png__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_assets_logo_png__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _styles_split_pane_css__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../styles/split-pane.css */ "./styles/split-pane.css");
/* harmony import */ var _styles_split_pane_css__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_styles_split_pane_css__WEBPACK_IMPORTED_MODULE_17__);








var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal\\src\\docs\\pages\\playground.js";












var Loading = function Loading() {
  return react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "Loading...");
};

var CodeMirror = react_loadable__WEBPACK_IMPORTED_MODULE_13___default.a.Map({
  loader: {
    ReactCodeMirror: function ReactCodeMirror() {
      return __webpack_require__.e(/*! import() */ 3).then(__webpack_require__.t.bind(null, /*! react-codemirror */ "../../node_modules/react-codemirror/lib/Codemirror.js", 7));
    },
    resources: function resources() {
      return _babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_7___default.a.all([__webpack_require__.e(/*! import() */ "styles").then(__webpack_require__.t.bind(null, /*! codemirror/lib/codemirror.css */ "../../node_modules/codemirror/lib/codemirror.css", 7)), __webpack_require__.e(/*! import() */ 7).then(__webpack_require__.t.bind(null, /*! codemirror/mode/javascript/javascript */ "../../node_modules/codemirror/mode/javascript/javascript.js", 7)), __webpack_require__.e(/*! import() */ "styles").then(__webpack_require__.t.bind(null, /*! codemirror/theme/monokai.css */ "../../node_modules/codemirror/theme/monokai.css", 7)), __webpack_require__.e(/*! import() */ 5).then(__webpack_require__.t.bind(null, /*! codemirror/addon/hint/show-hint */ "../../node_modules/codemirror/addon/hint/show-hint.js", 7)), __webpack_require__.e(/*! import() */ 6).then(__webpack_require__.t.bind(null, /*! codemirror/addon/lint/lint */ "../../node_modules/codemirror/addon/lint/lint.js", 7)), __webpack_require__.e(/*! import() */ 1).then(__webpack_require__.t.bind(null, /*! codemirror-graphql/hint */ "../../node_modules/codemirror-graphql/hint.js", 7)), __webpack_require__.e(/*! import() */ 2).then(__webpack_require__.t.bind(null, /*! codemirror-graphql/lint */ "../../node_modules/codemirror-graphql/lint.js", 7)), __webpack_require__.e(/*! import() */ 4).then(__webpack_require__.t.bind(null, /*! codemirror-graphql/mode */ "../../node_modules/codemirror-graphql/mode.js", 7))]);
    }
  },
  render: function render(loaded, _ref) {
    var innerRef = _ref.innerRef,
        props = Object(_babel_runtime_corejs2_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_6__["default"])(_ref, ["innerRef"]);

    var ReactCodeMirror = loaded.ReactCodeMirror.default;
    return react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(ReactCodeMirror, Object(_babel_runtime_corejs2_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_5__["default"])({}, props, {
      ref: innerRef,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 32
      },
      __self: this
    }));
  },
  loading: Loading
});

var AsyncFunction = _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4___default()(eval("(async function __test() {})")).constructor;

if (typeof window !== "undefined") {
  window.Knex = knex__WEBPACK_IMPORTED_MODULE_9___default.a;
  window.greldal = _lib__WEBPACK_IMPORTED_MODULE_11__;
}

var defaultCode = "\n    greldal.useDatabaseConnector(knex);\n\n    await knex.schema.createTable(\"customers\", t => {\n        t.increments(\"pk\");\n        t.string(\"first_name\");\n        t.string(\"last_name\");\n    });\n\n    await knex(\"customers\").insert([\n        {first_name: \"Harry\", last_name: \"Granger\"},\n        {first_name: \"Ron\", last_name: \"Potter\"}\n    ]);\n\n    const fields = greldal.mapFields({\n        id: {\n            sourceColumn: \"pk\",\n            type: greldal.types.number,\n            to: {\n                input: graphql.GraphQLID,\n                output: graphql.GraphQLID,\n            },\n        },\n        firstName: {\n            sourceColumn: \"first_name\",\n            type: greldal.types.string,\n        },\n        lastName: {\n            sourceColumn: \"last_name\",\n            type: greldal.types.string,\n        },\n    });\n\n    const users = greldal.mapDataSource({\n        name: {\n            mapped: \"User\",\n            stored: \"customers\",\n        },\n        fields,\n    });\n\n    const schema = greldal.mapSchema(greldal.operationPresets.defaults(users));\n\n    return schema;\n";
var defaultQuery = "\n    query { \n        findManyUsers(where: {}) { \n            id, \n            firstName, \n            lastName \n        }\n    }\n";
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_8__["useState"])(defaultCode),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState, 2),
      code = _useState2[0],
      setCode = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_8__["useState"])(null),
      _useState4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState3, 2),
      schema = _useState4[0],
      setSchema = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_8__["useState"])(defaultQuery),
      _useState6 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState5, 2),
      query = _useState6[0],
      setQuery = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_8__["useState"])(""),
      _useState8 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState7, 2),
      result = _useState8[0],
      setResult = _useState8[1];

  var codeEditorRef = Object(react__WEBPACK_IMPORTED_MODULE_8__["useRef"])(null);
  var gqlEditorRef = Object(react__WEBPACK_IMPORTED_MODULE_8__["useRef"])(null);

  var runCode =
  /*#__PURE__*/
  function () {
    var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
      var knex, run, _schema;

      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              knex = knex__WEBPACK_IMPORTED_MODULE_9___default()({
                client: _utils_SQLJSClient__WEBPACK_IMPORTED_MODULE_10__["default"],
                debug: true,
                pool: {
                  min: 1,
                  max: 1
                },
                acquireConnectionTimeout: 500
              });
              knex.initialize();
              run = new AsyncFunction("Knex", "knex", "greldal", "graphql", code);
              _context.prev = 3;
              _context.next = 6;
              return run(knex__WEBPACK_IMPORTED_MODULE_9___default.a, knex, _lib__WEBPACK_IMPORTED_MODULE_11__, graphql__WEBPACK_IMPORTED_MODULE_12__);

            case 6:
              _schema = _context.sent;
              setSchema(_schema);
              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](3);
              console.error(_context.t0);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[3, 10]]);
    }));

    return function runCode() {
      return _ref2.apply(this, arguments);
    };
  }();

  var queryAPI = function queryAPI() {
    if (!schema || !query) return;
    graphql__WEBPACK_IMPORTED_MODULE_12__["graphql"](schema, query).then(function (res) {
      return setResult(res);
    }).catch(function (e) {
      return console.error(e);
    });
  };

  var refreshEditors = function refreshEditors() {
    var _arr = [codeEditorRef, gqlEditorRef];

    for (var _i = 0; _i < _arr.length; _i++) {
      var ref = _arr[_i];
      if (!ref.current) continue;
      var editor = ref.current.getCodeMirror();
      if (!editor) continue;
      editor.refresh();
    }
  };

  return react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(PageContainer, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(react_split_pane__WEBPACK_IMPORTED_MODULE_14__["default"], {
    split: "vertical",
    minSize: 50,
    defaultSize: "50%",
    onChange: refreshEditors,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 144
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(PaneBody, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 145
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(HeaderInfo, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 147
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("a", {
    href: "",
    style: {
      display: "block",
      marginRight: "10px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 148
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("img", {
    src: _assets_logo_png__WEBPACK_IMPORTED_MODULE_16___default.a,
    style: {
      height: "50px",
      width: "50px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 149
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 151
    },
    __self: this
  }, "GRelDAL Playground is an ", react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("strong", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 152
    },
    __self: this
  }, "experimental"), " sandboxed environment where you can play around with a GraphQL API powered by GRelDAL and sql.js within your browser without having to install anything."), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("div", {
    style: {
      flexBasis: "170px",
      flexGrow: "0",
      flexShrink: "0"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 156
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(PrimaryBtn, {
    style: {
      marginLeft: "10px"
    },
    onClick: runCode,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 163
    },
    __self: this
  }, "Generate Schema \u21E8"))), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("div", {
    style: {
      position: "relative",
      flexGrow: 2,
      flexShrink: 1,
      overflow: "hidden"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 168
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(CodeMirror, {
    options: {
      scrollbarStyle: "native",
      theme: "monokai",
      mode: "javascript"
    },
    value: code,
    onChange: setCode,
    innerRef: codeEditorRef,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 169
    },
    __self: this
  }))), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(react_split_pane__WEBPACK_IMPORTED_MODULE_14__["default"], {
    split: "horizontal",
    defaultSize: "50%",
    onChange: refreshEditors,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 181
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(PaneBody, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 182
    },
    __self: this
  }, schema ? react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_8___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(HeaderInfo, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 185
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 186
    },
    __self: this
  }, "Query your API using GraphQL"), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(PrimaryBtn, {
    style: {
      float: "right",
      marginLeft: "10px"
    },
    onClick: queryAPI,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 187
    },
    __self: this
  }, "Run Query \u21E9")), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(EditorContainer, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 191
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(CodeMirror, {
    options: {
      theme: "monokai",
      mode: "graphql",
      lint: {
        schema: schema
      },
      hintOptions: {
        schema: schema
      }
    },
    value: query,
    onChange: setQuery,
    innerRef: gqlEditorRef,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 192
    },
    __self: this
  }))) : react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(BlankPanel, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 210
    },
    __self: this
  }, "Once your Schema has been prepared, you will be able to query it from this panel.")), react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 215
    },
    __self: this
  }, result ? react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement("pre", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 217
    },
    __self: this
  }, _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default()(result, null, 2)) : react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(BlankPanel, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 219
    },
    __self: this
  }, "Once you perform a query, you will be able to see the results here")))));
});
var PageContainer = styled_components__WEBPACK_IMPORTED_MODULE_15__["default"].div.withConfig({
  displayName: "playground__PageContainer",
  componentId: "icyl98-0"
})(["position:absolute;top:4px;left:0;right:0;bottom:0;.ReactCodeMirror{position:absolute;top:0;left:0;right:0;bottom:0;}.CodeMirror{height:100%;width:100%;}"]);
var HeaderInfo = styled_components__WEBPACK_IMPORTED_MODULE_15__["default"].div.withConfig({
  displayName: "playground__HeaderInfo",
  componentId: "icyl98-1"
})(["padding:10px;background:lemonchiffon;color:#404040;border-bottom:2px solid #8dd35f;display:flex;flex-direction:row;flex-grow:0;flex-shrink:0;"]);
var EditorContainer = styled_components__WEBPACK_IMPORTED_MODULE_15__["default"].div.withConfig({
  displayName: "playground__EditorContainer",
  componentId: "icyl98-2"
})(["position:relative;flex-grow:2;flex-shrink:1;overflow:hidden;"]);
var PrimaryBtn = styled_components__WEBPACK_IMPORTED_MODULE_15__["default"].button.withConfig({
  displayName: "playground__PrimaryBtn",
  componentId: "icyl98-3"
})(["background:#5aac31;border:1px solid #abe081;border-radius:4px;padding:10px;color:white;"]);
var BlankPanel = styled_components__WEBPACK_IMPORTED_MODULE_15__["default"].div.withConfig({
  displayName: "playground__BlankPanel",
  componentId: "icyl98-4"
})(["color:#a7a6a6;font-size:1.5rem;padding:50px;line-height:2rem;background:#ddd;position:absolute;top:0;right:0;bottom:0;left:0;"]);
var PaneBody = styled_components__WEBPACK_IMPORTED_MODULE_15__["default"].div.withConfig({
  displayName: "playground__PaneBody",
  componentId: "icyl98-5"
})(["position:relative;width:100%;height:100%;overflow:hidden;display:flex;flex-direction:column;"]);

/***/ })

})
//# sourceMappingURL=playground.js.44070b60795c75d38147.hot-update.js.map