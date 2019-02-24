webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "../../api/snippets.json":
/*!***********************************************************!*\
  !*** C:/Users/loref/Projects/greldal-2/api/snippets.json ***!
  \***********************************************************/
/*! exports provided: mapDataSource_user_simple, mapDataSource_user_simple_explicit, default */
/***/ (function(module) {

module.exports = {"mapDataSource_user_simple":{"name":"mapDataSource_user_simple","content":"    /// import {mapDataSource, mapFields, types} from \"greldal\";\r\n\r\n    const users = mapDataSource({\r\n        name: \"User\",\r\n        fields: mapFields({\r\n            id: {\r\n                type: types.number,\r\n                to: GraphQLID,\r\n                isPrimary: true,\r\n            },\r\n            name: {\r\n                type: types.string,\r\n            },\r\n            age: {\r\n                type: types.integer,\r\n            },\r\n        }),\r\n    });\r\n"},"mapDataSource_user_simple_explicit":{"name":"mapDataSource_user_simple_explicit","content":"    /// import {mapDataSource, mapFields, types} from \"greldal\";\r\n\r\n    const users = mapDataSource({\r\n        name: {\r\n            mapped: \"User\",\r\n            stored: \"users\",\r\n        },\r\n        fields: mapFields({\r\n            id: {\r\n                sourceColumn: \"id\",\r\n                type: types.string,\r\n                to: {\r\n                    input: GraphQLID,\r\n                    output: GraphQLID,\r\n                },\r\n            },\r\n            name: {\r\n                sourceColumn: \"name\",\r\n                type: types.string,\r\n                to: {\r\n                    input: GraphQLString,\r\n                    output: GraphQLString,\r\n                },\r\n            },\r\n            age: {\r\n                sourceColumn: \"age\",\r\n                type: types.integer,\r\n                to: {\r\n                    input: GraphQLInt,\r\n                    output: GraphQLInt\r\n                }\r\n            }\r\n        }),\r\n    });\r\n"}};

/***/ })

})
//# sourceMappingURL=index.js.7e9bcabac128aed6ca88.hot-update.js.map