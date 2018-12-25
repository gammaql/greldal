import S from "string";
import { find, isEmpty, get } from "lodash";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import ts from 'react-syntax-highlighter/dist/languages/hljs/typescript';
import github from 'react-syntax-highlighter/dist/styles/hljs/github'; 

SyntaxHighlighter.registerLanguage('typescript', ts);

import "normalize.css/normalize.css";

import { PageLayout } from "../components/PageLayout";
import api from "../../../api/api.json";

const getSrcPath = (filePath, lineNo) => `https://github.com/gql-dal/greldal/blob/master/${filePath}#L${lineNo}`;

function* getAPIItems() {
    let prevItem;
    for (const item of api) {
        if (!item.name) continue;
        if (prevItem && prevItem.location.fileName !== item.location.fileName) {
            yield <hr />;
        }
        const typeTag = find(item.documentation.tags, t => t.type === "interface" || t.type === "property");
        const isProperty = typeTag && typeTag.type === "property";
        const slug = S(item.name).slugify().s;
        yield (
            <div
                style={{
                    marginLeft: isProperty ? "20px" : 0,
                    padding: "5px 10px",
                    borderLeft: "4px solid silver",
                }}
            >
                {typeTag && <div style={{ float: "right", color: "silver" }}>{typeTag.type}</div>}
                <a href={`#${slug}`} id={slug} className="api-link">
                    <strong>{item.name}</strong>
                </a>
                <div dangerouslySetInnerHTML={{ __html: get(item, "documentation.description.full") || "" }} />
                <div>
                    <div className="type-header">Type</div>
                    <SyntaxHighlighter language="typescript" style={github}>{item.type}</SyntaxHighlighter>
                </div>
            </div>
        );
        if (!isEmpty(item.documentation.tags)) {
            const rows = item.documentation.tags.map(
                t =>
                    t !== typeTag && (
                        <tr>
                            <th>{t.type}</th>
                            <td>{t.name}</td>
                            <td dangerouslySetInnerHTML={{ __html: t.description || t.string }} />
                        </tr>
                    ),
            );
            yield (
                <>
                    <style jsx global>{`
                        .api-table {
                            margin: 10px;
                            margin-left: 15px;
                        }
                        .api-table th,
                        .api-table td {
                            border: 1px solid silver;
                            padding: 5px;
                        }
                        .api-table td > p {
                            margin: 0;
                            padding: 0;
                        }
                        pre {
                            max-height: 200px;
                            margin:0;
                        }
                        .type-header {
                            background: #ddd;
                            font-weight: 900;
                            padding: 0 5px;
                            color: gray;
                            font-size: 0.6rem;
                            text-transform: uppercase;
                        }
                        .api-link {
                            text-decoration: none !important;
                            color: #e535ab;
                        }
                    `}</style>
                    <table className="api-table" cellSpacing={0} cellPadding={0}>
                        <tbody>{rows}</tbody>
                    </table>
                </>
            );
        }

        prevItem = item;
    }
}

export default () => (
<PageLayout>
    <h1>API Documentation</h1>
    <p>This document is current work in progress</p>
    <hr/>
    {[...getAPIItems()]}
</PageLayout>
);
