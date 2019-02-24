import SyntaxHighlighter from "react-syntax-highlighter";
import dedentStr from "dedent";
import assert from "assert";
import github from "react-syntax-highlighter/dist/cjs/styles/hljs/github";
import snippets from "../../../api/snippets.json";

export const CodeSnippet = ({ name, language = "javascript", stripTripleComment = true, dedent = true }) => {
    assert(snippets[name], `Snippet could not be found ${name}`);
    let { content } = snippets[name];
    if (stripTripleComment) content = content.replace(/\s\/\/\/\s/g, " ");
    if (dedent) content = dedentStr(content);
    return (
        <SyntaxHighlighter language={language} style={github}>
            {content}
        </SyntaxHighlighter>
    );
};
