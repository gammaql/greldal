import React from "react";

export const Nav = props => (
    <>
        {props.children.map(item => {
            const Heading = `h${item.level}`;
            return (
                <>
                    <a href={`#${item.id}`}>
                        <Heading>{item.title}</Heading>
                    </a>
                    <div className="toc-children">{item.children && <Nav>{item.children}</Nav>}</div>
                </>
            );
        })}
    </>
);
