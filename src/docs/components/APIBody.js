import APIEntityContainer, {APIContainer} from "./APIEntityContainer";
import styled from "styled-components";
import { Link } from "./Link";

export const EmptyMsgContainer = styled.div`
    color: silver;
    font-weight: 900;
    font-size: 3rem;
    padding: 20px;
    padding-top: 100px;
    text-align: center;
    line-height: 4rem;
`;

export function APIIntro(props) {
    return (
        <APIContainer>
            <h1>Welcome to GRelDAL's API Documentation </h1>
            <div>
                Please make sure that you have first gone through the <Link href="guides">Guides</Link> before diving
                deep into the API docs.
            </div>
            <div>
                <h1>Terms</h1>
                <p>Summary of the terminology used in the API docs</p>
                <ul>
                    <li>
                        <strong>DataSource</strong>
                        <p>
                            A DataSource is a mapper that mediates operations against a table/view in the persistence
                            layer.
                        </p>
                        <p>
                            DataSources are expected to have a fixed set of <strong>fields</strong> (see below) and can
                            interact with other data sources through <strong>associations</strong> (see below).
                        </p>
                    </li>
                    <li>
                        <strong>Entity</strong>
                        <p>
                            Entities are plain JavaScript objects returned by operations on data sources.
                        </p>
                        <p>
                            When application logic is written against Entities, it is sheilded from the specifics 
                            of persistence layer. Using plain js entities instead of ORM models or managed instances
                            prevents accidental coupling of application logic and persistence specific concerns.
                        </p>
                        <p>
                            The shape of an entity may not be same as rows in the underlying persistence layer (table or
                            view) and whenever required, the DataSource will perform coversion between rows and
                            entities.
                        </p>
                    </li>
                    <li>
                        <strong>Row</strong>
                        <p>
                            In the documentation here, rows always refer to rows in a table/view in the persistence
                            layer.
                        </p>
                    </li>
                    <li>
                        <strong>Association</strong>
                        <p>An association is a link using which operations can span over multiple data source</p>
                    </li>
                    <li>
                        <strong>Field</strong>
                        <p>
                            A field refers to an attribute in an Entity. A field can either be directly mapped from a
                            column or be derived from a combination of multiple columns.
                        </p>
                        <p>
                            The <Link href="mapping-data-sources">DataSource mapping guide</Link> elaborates more on
                            mapping fields.
                        </p>
                    </li>
                </ul>
            </div>
            <div>
                <h1>Important top level functions</h1>
                <ul>
                    <li>
                        <strong>useDatabaseConnector</strong>
                        <p>
                            Configures a knex instance to be used for connecting to the database. For polyglot
                            persistence, we can also specify a knex instance at a data source level.
                        </p>
                    </li>
                    <li>
                        <strong>mapDataSource</strong>
                        <p>
                            Map tables (or views) in database to data sources which operations exposed through the
                            GraphQL schema can interact with.
                        </p>
                    </li>
                    <li>
                        <strong>mapSchema</strong>
                        <p>Derive a GraphQL schema from GRelDAL data sources and operations.</p>
                    </li>
                </ul>
            </div>
            <h2>Looking for a particular class/function ?</h2>
            <p>← Find it through the sidebar</p>
        </APIContainer>
    );
}

export default function APIBody(props) {
    if (!props.activeCategory || !props.rootEntity) {
        return <APIIntro />;
    }
    return <APIEntityContainer entity={props.rootEntity} activeEntityName={props.activeEntityName} />;
}
