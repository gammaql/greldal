import Table from "react-table";
import { TypePresenter } from "./TypePresenter";
import React from "react";

import "react-table/react-table.css";

export const columns = [
    {
        Header: "Parameter",
        accessor: "name",
    },
    {
        Header: "Type",
        accessor: "type",
        Cell: props => <TypePresenter type={props.value} />,
    },
    {
        Header: "Description",
        accessor: "comment.text",
        Cell: props => (
            <div
                css={`
                    text-overflow: unset;
                    overflow: auto;
                    white-space: normal;
                `}
            >
                {props.value}
            </div>
        ),
    },
];

export const ParamsTable = ({ params }) => (
    <Table
        showPagination={false}
        resizable={false}
        sortable={false}
        defaultPageSize={params.length}
        style={{
            marginTop: "1em",
            marginBottom: "1em",
        }}
        columns={columns}
        data={params}
    />
);
