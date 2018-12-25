import "normalize.css/normalize.css";
import "highlight.js/styles/github.css";

import HomeContent, { tableOfContents } from "../sections/introduction.md";
import { Nav } from "../components/Nav";
import { PageLayout } from "../components/PageLayout";

export default () => (
    <PageLayout sidebar={<Nav>{tableOfContents()}</Nav>}>
        <HomeContent />
    </PageLayout>
);
