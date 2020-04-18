import { TypePresenter } from "./TypePresenter";
import { get } from "lodash";
import React from "react";

export const columns = [
    {
        Header: "Parameter",
        accessor: "name",
        Cell: props => <div>{props.value}</div>
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
    <>
        <table>
            <thead>
                <tr>
                    {columns.map(c => (
                        <th>
                            {c.Header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {params.map(p => (
                    <tr>
                        {columns.map(({ accessor, Cell }) => (
                            <td>
                                <Cell value={get(p, accessor)} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </>
);
