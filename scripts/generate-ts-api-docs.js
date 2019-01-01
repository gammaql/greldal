const path = require("path");
const cp = require("child_process");
const fs = require("fs-extra");
const { getAPIHierarchy } = require("../src/docs/utils/api");
const typeDoc = require.resolve("typedoc/bin/typedoc");

const generatedDocPath = path.resolve("api/api.json");
cp.execSync(
    `node ${typeDoc} --json ${generatedDocPath} ./lib --module commonjs --includeDeclarations --ignoreCompilerErrors --excludeExternals`,
);

const apiData = JSON.parse(fs.readFileSync(generatedDocPath).toString());

fs.writeFileSync(path.resolve("api/api-hierarchy.json"), JSON.stringify(getAPIHierarchy(apiData), null, 2));
