import faqs from "../data/faqs.yml";
import { ContentHierarchy } from "../components/ContentSection";

export default function FAQsPage() {
    return (
        <ContentHierarchy root={faqs} />
    )
}