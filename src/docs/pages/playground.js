import Knex from "knex";
import { useState, useRef } from "react";
import SQLJSClient from "../utils/SQLJSClient";
import * as greldal from "../../../lib/universal";
import * as graphql from "graphql";
import loadable from "@loadable/component";
import SplitPane from "react-split-pane";
import styled from "styled-components";
import logo from "../assets/logo.png";

import "../styles/split-pane.css";

const Loading = () => <div>Loading...</div>;

const Editor = loadable(() => import("../components/Editor"));

const AsyncFunction = Object.getPrototypeOf(eval(`(async function __test() {})`)).constructor;

if (typeof window !== "undefined") {
    window.Knex = Knex;
    window.greldal = greldal;
}

const defaultCode = `
// Libraries available in the sandbox
// import * as greldal from "greldal";
// import * as Knex from "knex";

// knex is a Knex instance configured to connect to an
// in memory sqlite database.
greldal.useDatabaseConnector(knex);

// Setup tables 

await knex.schema.createTable("customers", t => {
    t.increments("pk");
    t.string("first_name");
    t.string("last_name");
});

// Insert some sample data:

await knex("customers").insert([
    {first_name: "Harry", last_name: "Granger"},
    {first_name: "Ron", last_name: "Potter"}
]);

// Map the database schema to GraphQL API schema using GRelDAL:

const fields = greldal.mapFields({
    id: {
        sourceColumn: "pk",
        type: greldal.types.number,
        to: {
            input: graphql.GraphQLID,
            output: graphql.GraphQLID,
        },
    },
    firstName: {
        sourceColumn: "first_name",
        type: greldal.types.string,
    },
    lastName: {
        sourceColumn: "last_name",
        type: greldal.types.string,
    },
});

const users = greldal.mapDataSource({
    name: {
        mapped: "User",
        stored: "customers",
    },
    fields,
});

// Generate GraphQL schema:

const schema = greldal.mapSchema(greldal.operationPresets.defaults(users));

// This return is required for the playground to work:
return schema;
`;

const defaultQuery = `
query { 
    findManyUsers(where: {}) { 
        id, 
        firstName, 
        lastName 
    }
}
`;

export default function() {
    const [code, setCode] = useState(defaultCode);
    const [schema, setSchema] = useState(null);
    const [query, setQuery] = useState(defaultQuery);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const codeEditorRef = useRef(null);
    const gqlEditorRef = useRef(null);
    const resultRef = useRef(null);

    const runCode = async () => {
        const knex = Knex({
            client: SQLJSClient,
            debug: true,
            pool: { min: 1, max: 1 },
            acquireConnectionTimeout: 500,
        });
        knex.initialize();
        const run = new AsyncFunction("Knex", "knex", "greldal", "graphql", code);
        try {
            const schema = await run(Knex, knex, greldal, graphql);
            setResult("");
            setError("");
            setSchema(schema);
        } catch (e) {
            console.error(e);
            setError(`${e.message}\n${e.stack}`);
        }
    };

    const queryAPI = () => {
        if (!schema || !query) return;
        graphql
            .graphql(schema, query)
            .then(res => {
                setResult(res);
                setError("");
            })
            .catch(e => {
                console.error(e);
                setError(`${e.message}\n${e.stack}`);
            });
    };

    const refreshEditors = () => {
        for (const ref of [codeEditorRef, gqlEditorRef]) {
            if (!ref.current) continue;
            const editor = ref.current.getCodeMirror();
            if (!editor) continue;
            editor.refresh();
        }
    };

    return (
        <PageContainer>
            <SplitPane split="vertical" minSize={50} defaultSize="50%" onChange={refreshEditors}>
                <PaneBody>
                    <HeaderInfo>
                        <a href={ROOT_PATH || "/"} style={{ display: "block", marginRight: "10px" }}>
                            <img src={logo} style={{ height: "50px", width: "50px" }} />
                        </a>
                        <div style={{ padding: "5px" }}>
                            GRelDAL Playground is an <strong>experimental</strong> sandboxed environment where you can
                            play around with a <a href="https://graphql.org/">GraphQL API</a> powered by{" "}
                            <a href="https://gammaql.github.io/greldal/">GRelDAL</a> and{" "}
                            <a href="https://github.com/kripken/sql.js">sql.js</a> within your browser without having to
                            install anything.
                        </div>
                        <div
                            style={{
                                flexBasis: "170px",
                                flexGrow: "0",
                                flexShrink: "0",
                            }}
                        >
                            <PrimaryBtn style={{ marginLeft: "10px" }} onClick={runCode}>
                                Generate Schema ⇨
                            </PrimaryBtn>
                        </div>
                    </HeaderInfo>
                    <div style={{ position: "relative", flexGrow: 2, flexShrink: 1, overflow: "hidden" }}>
                        <Editor
                            options={{
                                scrollbarStyle: "native",
                                theme: "monokai",
                                mode: "javascript",
                                lineNumbers: true,
                            }}
                            value={code}
                            onChange={(c) => setCode(c)}
                            innerRef={codeEditorRef}
                        />
                    </div>
                </PaneBody>
                <SplitPane split="horizontal" defaultSize="50%" onChange={refreshEditors}>
                    <PaneBody>
                        {schema ? (
                            <>
                                <HeaderInfo>
                                    <div style={{ padding: "5px", flexGrow: 1 }}>Query your API using GraphQL</div>
                                    <PrimaryBtn style={{ float: "right", marginLeft: "10px" }} onClick={queryAPI}>
                                        Run Query ⇩
                                    </PrimaryBtn>
                                </HeaderInfo>
                                <EditorContainer>
                                    <Editor
                                        options={{
                                            theme: "monokai",
                                            mode: "graphql",
                                            lint: {
                                                schema,
                                            },
                                            hintOptions: {
                                                schema,
                                            },
                                            lineNumbers: true,
                                        }}
                                        value={query}
                                        onChange={(c) => setQuery(c)}
                                        innerRef={gqlEditorRef}
                                    />
                                </EditorContainer>
                            </>
                        ) : (
                            <BlankPanel>
                                Once your Schema has been prepared, you will be able to query it from this panel.
                            </BlankPanel>
                        )}
                    </PaneBody>
                    <div>
                        {result ? (
                            <Editor
                                options={{
                                    scrollbarStyle: "native",
                                    theme: "monokai",
                                    mode: "javascript",
                                    readOnly: true,
                                    lineNumbers: true,
                                }}
                                key={JSON.stringify(result, null, 2)}
                                value={JSON.stringify(result, null, 2)}
                                innerRef={resultRef}
                            />
                        ) : error ? (
                            <Editor
                                options={{
                                    scrollbarStyle: "native",
                                    theme: "monokai",
                                    readOnly: true,
                                    lineNumbers: true,
                                }}
                                value={error}
                                innerRef={resultRef}
                            />
                        ) : (
                            <BlankPanel>Once you perform a query, you will be able to see the results here</BlankPanel>
                        )}
                    </div>
                </SplitPane>
            </SplitPane>
        </PageContainer>
    );
}

const PageContainer = styled.div`
    position: absolute;
    top: 4px;
    left: 0;
    right: 0;
    bottom: 0;

    .ReactCodeMirror {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .CodeMirror {
        height: 100%;
        width: 100%;
    }

    .CodeMirror-linenumber {
        background: black;
        color: white;
        padding-right: 5px;
    }
`;

const HeaderInfo = styled.div`
    padding: 5px;
    background: lemonchiffon;
    color: #404040;
    border-bottom: 2px solid #8dd35f;
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 0;
`;

const EditorContainer = styled.div`
    position: relative;
    flex-grow: 2;
    flex-shrink: 1;
    overflow: hidden;
`;

const PrimaryBtn = styled.button`
    background: #5aac31;
    border: 1px solid #abe081;
    border-radius: 4px;
    padding: 10px;
    color: white;
    cursor: pointer;
`;

const BlankPanel = styled.div`
    color: #a7a6a6;
    font-size: 1.5rem;
    padding: 50px;
    line-height: 2rem;
    background: #ddd;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const PaneBody = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;
