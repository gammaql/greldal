webpackHotUpdate("static\\development\\pages\\playground.js",{

/***/ "./utils/SQLJSClient.js":
/*!******************************!*\
  !*** ./utils/SQLJSClient.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SQLJSClient; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "../../node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/classCallCheck */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/createClass */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/possibleConstructorReturn */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/getPrototypeOf */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/assertThisInitialized */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/inherits */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/defineProperty */ "../../node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! knex */ "../../node_modules/knex/knex.js");
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(knex__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var knex_lib_dialects_sqlite3__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! knex/lib/dialects/sqlite3 */ "../../node_modules/knex/lib/dialects/sqlite3/index.js");
/* harmony import */ var knex_lib_dialects_sqlite3__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(knex_lib_dialects_sqlite3__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var sql_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! sql.js */ "../../node_modules/sql.js/dist/sql-wasm.js");
/* harmony import */ var sql_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(sql_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_12__);













var initSqlJSOnce = Object(lodash__WEBPACK_IMPORTED_MODULE_12__["once"])(sql_js__WEBPACK_IMPORTED_MODULE_11___default.a);

var SQLJSClient =
/*#__PURE__*/
function (_SQLiteClient) {
  Object(_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(SQLJSClient, _SQLiteClient);

  function SQLJSClient() {
    var _getPrototypeOf2;

    var _this;

    Object(_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, SQLJSClient);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = Object(_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, (_getPrototypeOf2 = Object(_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(SQLJSClient)).call.apply(_getPrototypeOf2, [this].concat(args)));

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "dialect", "sqljs");

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "driverName", "sqljs");

    return _this;
  }

  Object(_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(SQLJSClient, [{
    key: "_driver",
    value: function _driver() {
      throw new Error("ExpectedToNotBeReachable");
    } // Get a raw connection from the database, returning a promise with the connection object.

  }, {
    key: "acquireRawConnection",
    value: function acquireRawConnection() {
      return new knex__WEBPACK_IMPORTED_MODULE_9___default.a.Promise(
      /*#__PURE__*/
      function () {
        var _ref = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
        /*#__PURE__*/
        _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(resolve, reject) {
          var SQL;
          return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return initSqlJSOnce({
                    locateFile: function locateFile(pathname) {
                      if (pathname === "sql-wasm.wasm") {
                        return __webpack_require__(/*! sql.js/dist/sql-wasm.wasm */ "../../node_modules/sql.js/dist/sql-wasm.wasm");
                      }

                      throw new Error("Unhandled locate path:", pathname);
                    }
                  });

                case 3:
                  SQL = _context.sent;
                  resolve(new SQL.Database());
                  _context.next = 10;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](0);
                  reject(_context.t0);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 7]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    } // Runs the query on the specified connection, providing the bindings and any
    // other necessary prep work.

  }, {
    key: "_query",
    value: function () {
      var _query2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(connection, obj) {
        var method, stmt;
        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                method = obj.method;
                stmt = connection.prepare(obj.sql);
                stmt.bind(obj.bindings);
                obj.response = [];

                while (stmt.step()) {
                  obj.response.push(stmt.getAsObject());
                }

                obj.context = this;
                return _context2.abrupt("return", obj);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _query(_x3, _x4) {
        return _query2.apply(this, arguments);
      }

      return _query;
    }()
  }, {
    key: "_stream",
    value: function _stream(connection, sql, stream) {
      throw new Error("Unsupported");
    } // Ensures the response is returned in the same format as other clients.

  }, {
    key: "processResponse",
    value: function processResponse(obj, runner) {
      var ctx = obj.context;
      var response = obj.response;

      switch (obj.method) {
        case "pluck":
          throw new Error("Unsupported");

        case "select":
        case "first":
          // const selectResult = map(get(response, [0, 'values']), (row) => zipObject(get(response, [0, 'columns']), row));
          return obj.method === "first" ? Object(lodash__WEBPACK_IMPORTED_MODULE_12__["first"])(response) : response;

        case "insert":
        case "del":
        case "update":
        case "counter":
          return [];

        default:
          return response;
      }
    }
  }]);

  return SQLJSClient;
}(knex_lib_dialects_sqlite3__WEBPACK_IMPORTED_MODULE_10___default.a);



/***/ })

})
//# sourceMappingURL=playground.js.063678ed1fc39e1590be.hot-update.js.map