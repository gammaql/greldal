import ReactCodeMirror from "react-codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/monokai.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/lint/lint";
// import "codemirror-graphql/hint";
// import "codemirror-graphql/lint";
// import "codemirror-graphql/mode";

const Editor = ({innerRef, ...props}) => (
    <ReactCodeMirror {...props} ref={innerRef} />
);

export default Editor;
