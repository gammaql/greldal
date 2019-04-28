import * as t from "io-ts";
import { InstanceOf } from "./util-types";

export interface DateStringBrand {
    readonly Format: unique symbol;
}

export const DateStringRT = t.brand(
    t.string,
    (n): n is t.Branded<string, DateStringBrand> => !! n.match(/^\d{4}-\d{2}-\d{2}$/),
    "Format",
);

export type DateString = t.TypeOf<typeof DateStringRT>;

export const date = t.union([
    DateStringRT,
    InstanceOf(Date)
]);

export interface UTCTimeStringBrand {
    readonly Format: unique symbol;
}

export const UTCTimeStringRT = t.brand(
    t.string,
    (n): n is t.Branded<string, UTCTimeStringBrand> => !! n.match(/^\d{2}:\d{2}Z$/),
    "Format",
);

export type UTCTimeString = t.TypeOf<typeof UTCTimeStringRT>;

export const time = t.union([
    UTCTimeStringRT,
    InstanceOf(Date)
]);

export interface UTCDateTimeStringBrand {
    readonly Format: unique symbol;
}

export const UTCDateTimeStringRT = t.brand(
    t.string,
    (n): n is t.Branded<string, UTCDateTimeStringBrand> => !! n.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    "Format",
);

export type UTCDateTimeString = t.TypeOf<typeof UTCDateTimeStringRT>;

export const dateTime = t.union([
    UTCDateTimeStringRT,
    InstanceOf(Date)
]);
