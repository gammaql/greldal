const $ = require("shelljs");
const glob = require("glob");
const fs = require("fs");
const path = require("path");

const spawnedENV = {
    ...process.env,
    ASSET_PATH: "/greldal/",
    NODE_ENV: "production",
};

if (
    $.exec(`${path.join("node_modules", ".bin", "next")} build src/docs`, {
        env: spawnedENV,
    }).code !== 0
) {
    $.echo("Failed to compile next.js site");
    $.exit(1);
}

if (
    $.exec(`${path.join("node_modules", ".bin", "next")} export src/docs -o docs`, {
        env: spawnedENV,
    }).code !== 0
) {
    $.echo("Failed to export static site");
    $.exit(1);
}

// Hack required because nextjs doesn't support configuring subdirectory root
glob.sync("./docs/**/index.html").forEach(filePath => {
    const index = fs.readFileSync(filePath, { encoding: "utf8" });
    const updated = index
        .replace(/href="\/_next\//g, 'href="/greldal/_next/')
        .replace(/src="\/_next\//g, 'src="/greldal/_next/');
    fs.writeFileSync(filePath, updated, { encoding: "utf8" });
});
