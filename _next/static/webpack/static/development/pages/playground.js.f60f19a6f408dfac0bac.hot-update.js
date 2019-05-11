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
/* harmony import */ var _babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/promise */ "../../node_modules/@babel/runtime-corejs2/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! knex */ "../../node_modules/knex/knex.js");
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(knex__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _utils_SQLJSClient__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/SQLJSClient */ "./utils/SQLJSClient.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! graphql */ "../../node_modules/graphql/index.mjs");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-loadable */ "../../node_modules/react-loadable/lib/index.js");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var react_split_pane__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-split-pane */ "../../node_modules/react-split-pane/dist/index.esm.js");
/* harmony import */ var _styles_split_pane_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../styles/split-pane.css */ "./styles/split-pane.css");
/* harmony import */ var _styles_split_pane_css__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_styles_split_pane_css__WEBPACK_IMPORTED_MODULE_13__);






var _jsxFileName = "C:\\Users\\loref\\Projects\\greldal\\src\\docs\\pages\\playground.js";










var Loading = function Loading() {
  return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, "Loading...");
};

var CodeMirror = react_loadable__WEBPACK_IMPORTED_MODULE_11___default()({
  loader: function loader() {
    var CodeMirrorP = __webpack_require__.e(/*! import() */ 3).then(__webpack_require__.t.bind(null, /*! react-codemirror */ "../../node_modules/react-codemirror/lib/Codemirror.js", 7));
    return _babel_runtime_corejs2_core_js_promise__WEBPACK_IMPORTED_MODULE_5___default.a.all([CodeMirrorP, __webpack_require__.e(/*! import() */ "styles").then(__webpack_require__.t.bind(null, /*! codemirror/lib/codemirror.css */ "../../node_modules/codemirror/lib/codemirror.css", 7)), __webpack_require__.e(/*! import() */ 7).then(__webpack_require__.t.bind(null, /*! codemirror/mode/javascript/javascript */ "../../node_modules/codemirror/mode/javascript/javascript.js", 7)), __webpack_require__.e(/*! import() */ "styles").then(__webpack_require__.t.bind(null, /*! codemirror/theme/monokai.css */ "../../node_modules/codemirror/theme/monokai.css", 7)), __webpack_require__.e(/*! import() */ 5).then(__webpack_require__.t.bind(null, /*! codemirror/addon/hint/show-hint */ "../../node_modules/codemirror/addon/hint/show-hint.js", 7)), __webpack_require__.e(/*! import() */ 6).then(__webpack_require__.t.bind(null, /*! codemirror/addon/lint/lint */ "../../node_modules/codemirror/addon/lint/lint.js", 7)), __webpack_require__.e(/*! import() */ 1).then(__webpack_require__.t.bind(null, /*! codemirror-graphql/hint */ "../../node_modules/codemirror-graphql/hint.js", 7)), __webpack_require__.e(/*! import() */ 2).then(__webpack_require__.t.bind(null, /*! codemirror-graphql/lint */ "../../node_modules/codemirror-graphql/lint.js", 7)), __webpack_require__.e(/*! import() */ 4).then(__webpack_require__.t.bind(null, /*! codemirror-graphql/mode */ "../../node_modules/codemirror-graphql/mode.js", 7))]).then(function () {
      return CodeMirrorP;
    });
  },
  loading: Loading
});

var AsyncFunction = _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4___default()(eval("(async function __test() {})")).constructor;

if (typeof window !== "undefined") {
  window.Knex = knex__WEBPACK_IMPORTED_MODULE_7___default.a;
  window.greldal = _lib__WEBPACK_IMPORTED_MODULE_9__;
}

var defaultCode = "\n    greldal.useDatabaseConnector(knex);\n\n    await knex.schema.createTable(\"customers\", t => {\n        t.increments(\"pk\");\n        t.string(\"first_name\");\n        t.string(\"last_name\");\n    });\n\n    await knex(\"customers\").insert([\n        {first_name: \"Harry\", last_name: \"Granger\"},\n        {first_name: \"Ron\", last_name: \"Potter\"}\n    ]);\n\n    const fields = greldal.mapFields({\n        id: {\n            sourceColumn: \"pk\",\n            type: greldal.types.number,\n            to: {\n                input: graphql.GraphQLID,\n                output: graphql.GraphQLID,\n            },\n        },\n        firstName: {\n            sourceColumn: \"first_name\",\n            type: greldal.types.string,\n        },\n        lastName: {\n            sourceColumn: \"last_name\",\n            type: greldal.types.string,\n        },\n    });\n\n    const users = greldal.mapDataSource({\n        name: {\n            mapped: \"User\",\n            stored: \"customers\",\n        },\n        fields,\n    });\n\n    const schema = greldal.mapSchema(greldal.operationPresets.defaults(users));\n\n    return schema;\n";
var defaultQuery = "\n    query { \n        findManyUsers(where: {}) { \n            id, \n            firstName, \n            lastName \n        }\n    }\n";
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(defaultCode),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState, 2),
      code = _useState2[0],
      setCode = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(null),
      _useState4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState3, 2),
      schema = _useState4[0],
      setSchema = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(defaultQuery),
      _useState6 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState5, 2),
      query = _useState6[0],
      setQuery = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(""),
      _useState8 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useState7, 2),
      result = _useState8[0],
      setResult = _useState8[1];

  var runCode =
  /*#__PURE__*/
  function () {
    var _ref = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
      var knex, run, _schema;

      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              knex = knex__WEBPACK_IMPORTED_MODULE_7___default()({
                client: _utils_SQLJSClient__WEBPACK_IMPORTED_MODULE_8__["default"],
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
              return run(knex__WEBPACK_IMPORTED_MODULE_7___default.a, knex, _lib__WEBPACK_IMPORTED_MODULE_9__, graphql__WEBPACK_IMPORTED_MODULE_10__);

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
      return _ref.apply(this, arguments);
    };
  }();

  var queryAPI = function queryAPI() {
    if (!schema || !query) return;
    graphql__WEBPACK_IMPORTED_MODULE_10__["graphql"](schema, query).then(function (res) {
      return setResult(res);
    }).catch(function (e) {
      return console.error(e);
    });
  };

  return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    style: {
      position: "absolute",
      top: '4px',
      left: 0,
      right: 0,
      bottom: 0
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 126
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_split_pane__WEBPACK_IMPORTED_MODULE_12__["default"], {
    split: "vertical",
    minSize: 50,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 128
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 129
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("button", {
    style: {
      float: 'right'
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 130
    },
    __self: this
  }, "Run Code"), "Code"), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(CodeMirror, {
    options: {
      theme: "monokai",
      mode: "javascript"
    },
    value: code,
    onChange: setCode,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 133
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_split_pane__WEBPACK_IMPORTED_MODULE_12__["default"], {
    split: "horizontal",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 136
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 137
    },
    __self: this
  }, schema && react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(CodeMirror, {
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
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 155
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("pre", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 156
    },
    __self: this
  }, _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default()(result, null, 2))))));
});

/***/ })

})
//# sourceMappingURL=playground.js.f60f19a6f408dfac0bac.hot-update.js.map