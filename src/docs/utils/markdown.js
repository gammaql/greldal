import marked from "marked";
import {identity} from "lodash";

marked.setOptions({
    gfm: true,
    tables: true,
});

export const renderMarkdown = (content, postProcess = identity, extraProps = null) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: postProcess(marked(content)) }} {...extraProps} />
    );
}