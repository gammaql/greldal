import React from "react";
import { renderMarkdown } from "../utils/markdown";

const initialContext = { level: 1 };

export const ContentHierarchyContext = React.createContext(initialContext);

export function ContentHierarchy(props) {
    return (
        <ContentHierarchyContext.Consumer>
            {({ level } = initialContext) => {
                const { root } = props;
                if (!root) return null;
                const Header = `h${level}`;
                const title = root.title && <Header style={{lineHeight: '2rem'}}>{root.title}</Header>;
                const content = root.content && <p>{renderMarkdown(root.content)}</p>;
                return (
                    <>
                        {title}
                        {content}
                        {root.members && (
                            <div style={{ paddingLeft: "15px" }}>
                                {root.members.map(member => (
                                    <ContentHierarchy root={member} />
                                ))}
                            </div>
                        )}
                    </>
                );
            }}
        </ContentHierarchyContext.Consumer>
    );
}
