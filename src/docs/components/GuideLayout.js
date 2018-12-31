import "normalize.css/normalize.css";
import "highlight.js/styles/github.css";

import { Nav } from "../components/Nav";
import { PageLayout } from "../components/PageLayout";

export default ({ guide: { default: Content, tableOfContents } }) => (
    <PageLayout sidebar={<Nav>{tableOfContents()}</Nav>}>
        <Content />
    </PageLayout>
);
