
export const TYPES_MAPPING = [
    {
        regexp: /INT/,
        type: "integer",
    },
    {
        regexp: /(TEXT|CHAR|CLOB)/,
        type: "string",
    },
    {
        regexp: /(REAL|DOUBLE|FLOAT|NUMERIC|DECIMAL)/,
        type: "number",
    },
    {
        regexp: /DATETIME/,
        type: "dateTime",
    },
    {
        regexp: /DATE/,
        type: "date",
    },
    {
        regexp: /BOOLEAN/,
        type: "boolean",
    },
];
