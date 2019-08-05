const path = require('path');

module.exports = {
    resolveSnapshotPath: (testPath, snapshotExtension) => {
        const db = process.env.DB || "sqlite3";
        return path.join(path.dirname(testPath), '__snapshots__', db, path.basename(testPath)+snapshotExtension);
    },
    resolveTestPath: (snapshotPath, snapshotExtension) => {
        return path.join(
            path.dirname(snapshotPath),
            '..',
            '..',
            path.basename(snapshotPath, snapshotExtension)
        );
    },
    testPathForConsistencyCheck: path.join('src', '__specs__', 'insertion.spec.ts'),
};
