export const TYPES_MAPPING = [
    {
        regexp: /INT/i,
        type: "integer",
    },
    {
        regexp: /(TEXT|CHAR|CLOB)/i,
        type: "string",
    },
    {
        regexp: /(REAL|DOUBLE|FLOAT|NUMERIC|DECIMAL)/i,
        type: "number",
    },
    {
        regexp: /DATETIME/i,
        type: "dateTime",
    },
    {
        regexp: /DATE/i,
        type: "date",
    },
    {
        regexp: /BOOLEAN/i,
        type: "boolean",
    },
];
