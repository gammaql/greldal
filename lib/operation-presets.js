"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryOperationResolver_1 = require("./QueryOperationResolver");
const InsertionOperationResolver_1 = require("./InsertionOperationResolver");
const MappedQueryOperation_1 = require("./MappedQueryOperation");
const UpdateOperationResolver_1 = require("./UpdateOperationResolver");
const MappedInsertionOperation_1 = require("./MappedInsertionOperation");
const MappedUpdateOperation_1 = require("./MappedUpdateOperation");
const MappedDeletionOperation_1 = require("./MappedDeletionOperation");
const DeletionOperationResolver_1 = require("./DeletionOperationResolver");
const inflection_1 = require("inflection");
function findOneOperation(rootSource) {
    return new MappedQueryOperation_1.MappedQueryOperation({
        rootSource,
        name: `findOne${inflection_1.singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: false,
        resolver: QueryOperationResolver_1.QueryOperationResolver,
    });
}
exports.findOneOperation = findOneOperation;
function findManyOperation(rootSource) {
    return new MappedQueryOperation_1.MappedQueryOperation({
        rootSource,
        name: `findMany${inflection_1.pluralize(rootSource.mappedName)}`,
        returnType: undefined,
        description: undefined,
        args: undefined,
        singular: false,
        shallow: false,
        resolver: QueryOperationResolver_1.QueryOperationResolver,
    });
}
exports.findManyOperation = findManyOperation;
function insertOneOperation(rootSource) {
    return new MappedInsertionOperation_1.MappedInsertionOperation({
        rootSource,
        name: `insertOne${inflection_1.singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: InsertionOperationResolver_1.InsertionOperationResolver,
    });
}
exports.insertOneOperation = insertOneOperation;
function insertManyOperation(rootSource) {
    return new MappedInsertionOperation_1.MappedInsertionOperation({
        rootSource,
        name: `insertMany${inflection_1.pluralize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
        resolver: InsertionOperationResolver_1.InsertionOperationResolver,
    });
}
exports.insertManyOperation = insertManyOperation;
function updateOneOperation(rootSource) {
    return new MappedUpdateOperation_1.MappedUpdateOperation({
        rootSource,
        name: `updateOne${inflection_1.singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: UpdateOperationResolver_1.UpdateOperationResolver,
    });
}
exports.updateOneOperation = updateOneOperation;
function updateManyOperation(rootSource) {
    return new MappedUpdateOperation_1.MappedUpdateOperation({
        rootSource,
        name: `updateMany${inflection_1.pluralize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
        resolver: UpdateOperationResolver_1.UpdateOperationResolver,
    });
}
exports.updateManyOperation = updateManyOperation;
function deleteOneOperation(rootSource) {
    return new MappedDeletionOperation_1.MappedDeletionOperation({
        rootSource,
        name: `deleteOne${inflection_1.singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: DeletionOperationResolver_1.DeletionOperationResolver,
    });
}
exports.deleteOneOperation = deleteOneOperation;
function deleteManyOperation(rootSource) {
    return new MappedDeletionOperation_1.MappedDeletionOperation({
        rootSource,
        name: `deleteMany${inflection_1.pluralize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
        resolver: DeletionOperationResolver_1.DeletionOperationResolver,
    });
}
exports.deleteManyOperation = deleteManyOperation;
exports.query = {
    findOneOperation,
    findManyOperation,
    all: (rootSource) => [findOneOperation(rootSource), findManyOperation(rootSource)],
};
exports.mutation = {
    insertOneOperation,
    insertManyOperation,
    updateOneOperation,
    updateManyOperation,
    deleteOneOperation,
    deleteManyOperation,
    all: (rootSource) => [
        insertOneOperation(rootSource),
        insertManyOperation(rootSource),
        updateOneOperation(rootSource),
        updateManyOperation(rootSource),
        deleteOneOperation(rootSource),
        deleteManyOperation(rootSource),
    ],
};
exports.all = (rootSource) => [...exports.query.all(rootSource), ...exports.mutation.all(rootSource)];
//# sourceMappingURL=operation-presets.js.map